#!/bin/bash
# PrimeCrop Production Deploy Script
# Run this on your VPS after cloning the project

set -e

echo "=== PrimeCrop Deployment ==="

# 1. Check .env exists
if [ ! -f .env ]; then
  cp deploy/.env.prod .env
  echo "[!] Created .env from template — EDIT IT BEFORE CONTINUING"
  echo "[!] Run: nano .env"
  exit 1
fi

# 2. Build and start containers
echo "[1/3] Building containers..."
docker compose -f deploy/docker-compose.prod.yml --env-file .env up -d --build

# 3. Wait for backend to be ready
echo "[2/3] Waiting for backend..."
sleep 10

# 4. Check status
echo "[3/3] Container status:"
docker compose -f deploy/docker-compose.prod.yml ps

echo ""
echo "=== Deploy complete ==="
echo "Storefront:  http://theprimecrop.com"
echo "Admin:       http://admin.theprimecrop.com"
echo "API:         http://theprimecrop.com/api/v1"
