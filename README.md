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
