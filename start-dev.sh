#!/bin/bash

echo "🚀 Starting Medusa development environment..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker Desktop first."
    exit 1
fi

echo "📦 Building and starting containers..."
docker-compose -f docker-compose.dev.yml up --build -d

echo "⏳ Waiting for services to be ready..."
sleep 10

echo "🔍 Checking service status..."
docker-compose -f docker-compose.dev.yml ps

echo "📋 Container logs (last 20 lines):"
echo "=== PostgreSQL ==="
docker-compose -f docker-compose.dev.yml logs --tail=20 postgres

echo "=== Medusa ==="
docker-compose -f docker-compose.dev.yml logs --tail=20 medusa

echo ""
echo "✅ Development environment started!"
echo "🌐 Medusa API: http://localhost:9000"
echo "🎛️  Admin Dashboard: http://localhost:7001"
echo "🗄️  PostgreSQL: localhost:5432"
echo "🔄 Redis: localhost:6379"
echo ""
echo "📝 To view logs: docker-compose -f docker-compose.dev.yml logs -f"
echo "🛑 To stop: docker-compose -f docker-compose.dev.yml down"
echo ""
echo "🧪 Test your custom product API with:"
echo "   node test-custom-product.js"
