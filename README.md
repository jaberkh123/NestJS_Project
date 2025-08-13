# PANTOhealth — IoT X-Ray Ingestion (NestJS + RabbitMQ + Mongo)

Ingest IoT “x-ray” data via RabbitMQ, process & store it in MongoDB, and expose REST APIs.  
(Optional: forward created signals to n8n via RabbitMQ or webhook.)

## Architecture

Producer → RabbitMQ (xray-queue) → API (Nest) → MongoDB (signals)
└─(optional)→ n8n (queue/webhook)


---

## Prerequisites

- **Docker Engine** and **Docker Compose v2** (`docker compose`, not `docker-compose`)
- Optional (for local dev): Node.js 18+

### Install Docker + Compose v2 (Ubuntu/Debian)

```bash
# remove old docker (optional)
sudo apt-get remove -y docker docker-engine docker.io containerd runc

# setup repo & keys
sudo apt-get update && sudo apt-get install -y ca-certificates curl gnupg
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | \
  sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
https://download.docker.com/linux/ubuntu $(. /etc/os-release && echo $VERSION_CODENAME) stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list >/dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io \
  docker-buildx-plugin docker-compose-plugin

# (optional) run docker without sudo
sudo usermod -aG docker $USER && newgrp docker

# verify
docker --version
docker compose version    # should print v2.x
```

## Quick Start (Docker)
```bash
git clone [<repo-url>](https://github.com/jaberkh123/NestJS_Project.git) && cd NestJS_Project
docker compose up --build -d
```
## Services
------API Docs: http://localhost:3000/docs

------RabbitMQ UI: http://localhost:15672 (default: admin / 58595859963)

------Mongo-Express: http://localhost:8081 (default: admin / 58595859963)



## API (examples)
Swagger at /docs.

```bash
# list (sorted by time desc)
curl "http://localhost:3000/signals?limit=5"

# filter by deviceId
curl "http://localhost:3000/signals?deviceId=66bb584d4ae73e488c30a072&limit=5"

# create manually
curl -X POST http://localhost:3000/signals \
  -H "Content-Type: application/json" \
  -d '{"deviceId":"66bb","time":1735683480000,"dataLength":3,"dataVolume":123}'

# get by id
curl "http://localhost:3000/signals/<ObjectId>"

# delete by id
curl -X DELETE "http://localhost:3000/signals/<ObjectId>"
```



## Configuration (defaults baked-in)
```bash
API

   MONGO_URI = mongodb://mongo:27017/pantohealth

   RABBITMQ_URL = amqp://rabbitmq:5672

   RABBITMQ_QUEUE = xray-queue

   PORT = 3000

Producer

   RABBITMQ_URL = amqp://rabbitmq:5672

   RABBITMQ_QUEUE = xray-queue

   SAMPLE_PATH = ./data/sample.json

   PRODUCER_MODE = loop

   INTERVAL_MS = 10000

```

## Tests
```bash
cd apps/api
npm ci
npm run test
npm run test:cov
```

## Producer config
Sends the sample payload to xray-queue (default every 10s).

## Logs & teardown:

```bash
docker compose logs -f api
docker compose logs -f producer
docker compose down           # stop
# docker compose down -v      # stop + delete data volumes (careful)
```


## License
This project is licensed under the MIT License 


