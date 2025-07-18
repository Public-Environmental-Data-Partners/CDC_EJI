# CDC_EJI
This is the repo for the preservation of the CDC's EJI Explorer and mapping tool

Data are stored at https://github.com/oedp/cdc-ej-index

CDC's tool lives at https://www.atsdr.cdc.gov/place-health/php/eji/eji-explorer.html

## Installation

### Prerequisites
* [Docker](https://www.docker.com/get-started/)
* [2024 EJI Geodatabase](https://github.com/oedp/cdc-ej-index/blob/main/2024/EJI_2024_United_States_GDB.zip)

### Run Locally

1. Extract the geodatabase zip file

2. Copy the geodatabase directory (EJI_2024_United_States.gdb) and all contents to ./data_server

3. Build and start Docker containers
```bash
docker-compose up -d
```

4. Access on http://localhost:8080