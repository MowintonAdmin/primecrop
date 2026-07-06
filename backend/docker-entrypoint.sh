#!/bin/bash
set -e

echo "Waiting for database..."
sleep 3

echo "Running database migrations..."
alembic upgrade head

echo "Bootstrapping admin user..."
python -c "from app.core.admin_bootstrap import bootstrap_admin; bootstrap_admin()"

echo "Starting PrimeCrop API server..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 2
