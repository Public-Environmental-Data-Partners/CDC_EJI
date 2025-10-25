# CDC_EJI
This is the repo for the preservation of the CDC's EJI Explorer and mapping tool

Data are stored at https://github.com/oedp/cdc-ej-index

CDC's tool lives at https://www.atsdr.cdc.gov/place-health/php/eji/eji-explorer.html

## Installation

### Prerequisites (if running locally)
* [Docker](https://www.docker.com/get-started/)
* [2024 EJI Geodatabase](https://github.com/oedp/cdc-ej-index/blob/main/2024/EJI_2024_United_States_GDB.zip)

### Run Locally

1. Extract the geodatabase zip file

2. Copy the geodatabase directory (EJI_2024_United_States.gdb) and all contents to ./data_server

3. Update the .env include the s3 url where the map tiles are hoste (TILES_S3_URL=)

4. Build and start Docker containers
```bash
docker-compose up -d
```

5. Access on http://localhost:8080

### Install on production server

Note: Has been tested on an AWS EC2 instance running Amazon Linux. Recommend at least 4GB of memory. Ensure http ports 80 and 443 and exposed.

1. Configure an s3 bucket per instructions [here](https://docs.protomaps.com/pmtiles/cloud-storage#amazon-s3) and upload all map tiles (.pmtiles) in the root directory.

2. Run the following command on the server to install

```
curl -fsSL https://raw.githubusercontent.com/Public-Environmental-Data-Partners/CDC_EJI/refs/heads/main/scripts/install.sh | bash
```