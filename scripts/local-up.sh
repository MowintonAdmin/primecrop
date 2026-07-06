#!/bin/bash
# PrimeCrop local development startup

echo "Starting PrimeCrop development environment..."

# Copy .env if needed
if [ ! -f .env ]; then
  cp .env.example .env
  echo "[OK] Created .env from .env.example"
fi

# Start backend + database only for dev
docker-compose -f docker-compose.dev.yml up -d

echo ""
echo "PrimeCrop is starting..."
echo ""
echo "  API:     http://localhost:8000"
echo "  API Docs: http://localhost:8000/docs"
echo ""
echo "  Run frontend web:   cd frontend/web && npm install && npm run dev"
echo "  Run admin panel:    cd frontend/admin && npm install && npm run dev"
echo ""
echo "  Admin login: admin@theprimecrop.com / PrimeCrop@Admin2026!"
