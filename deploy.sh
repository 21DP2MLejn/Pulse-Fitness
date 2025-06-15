#!/bin/bash

# Pull latest changes
git pull origin main

# Build and start containers
docker-compose down
docker-compose up --build -d

# Run migrations
docker-compose exec backend php artisan migrate --force

# Clear caches
docker-compose exec backend php artisan cache:clear
docker-compose exec backend php artisan config:clear
docker-compose exec backend php artisan route:clear
docker-compose exec backend php artisan view:clear

echo "Deployment completed successfully!" 