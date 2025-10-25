#!/bin/bash
set -e

echo "Starting deployment..."

# Update system
echo "Updating system packages..."
sudo yum update -y

# Install Git
echo "Installing Git..."
sudo yum install -y git

# Install Docker
echo "Installing Docker..."
sudo yum install -y docker
sudo service docker start
sudo usermod -a -G docker ec2-user

# Install Docker Compose
echo "Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Clone repository
echo "Cloning repository..."
REPO_URL="https://github.com/Public-Environmental-Data-Partners/CDC_EJI"
APP_DIR="/home/ec2-user/app"

if [ -d "$APP_DIR" ]; then
    echo "Directory exists, pulling latest changes..."
    cd "$APP_DIR"
    git pull
else
    git clone "$REPO_URL" "$APP_DIR"
    cd "$APP_DIR"
fi

# Download the geodatabase
sudo wget https://github.com/oedp/cdc-ej-index/raw/d373328c44d69b7aba34d21d25e49eba6dbb4c7e/2024/EJI_2024_United_States_GDB.zip
sudo unzip EJI_2024_United_States_GDB.zip
sudo chmod 757 EJI_2024_United_States -R
sudo mv EJI_2024_United_States/EJI_2024_United_States.gdb data_server/
sudo rm EJI_2024_United_States_GDB.zip
sudo rm EJI_2024_United_States -r

# TODO: create the .env file

# Start containers
echo "Starting containers..."
sudo docker-compose up -d

echo "Deployment complete!"
echo "App directory: $APP_DIR"
echo "Run 'cd $APP_DIR && docker-compose ps' to check container status"