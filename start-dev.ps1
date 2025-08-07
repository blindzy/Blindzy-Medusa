Write-Host "🚀 Starting Medusa development environment..." -ForegroundColor Green

# Check if Docker is running
try {
    docker info | Out-Null
}
catch {
    Write-Host "❌ Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

Write-Host "📦 Building and starting containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.dev.yml up --build -d

Write-Host "⏳ Waiting for services to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

Write-Host "🔍 Checking service status..." -ForegroundColor Cyan
docker-compose -f docker-compose.dev.yml ps

Write-Host "📋 Container logs (last 20 lines):" -ForegroundColor Cyan
Write-Host "=== PostgreSQL ===" -ForegroundColor Magenta
docker-compose -f docker-compose.dev.yml logs --tail=20 postgres

Write-Host "=== Medusa ===" -ForegroundColor Magenta
docker-compose -f docker-compose.dev.yml logs --tail=20 medusa

Write-Host ""
Write-Host "✅ Development environment started!" -ForegroundColor Green
Write-Host "🌐 Medusa API: http://localhost:9000" -ForegroundColor White
Write-Host "🎛️  Admin Dashboard: http://localhost:7001" -ForegroundColor White
Write-Host "🗄️  PostgreSQL: localhost:5432" -ForegroundColor White
Write-Host "🔄 Redis: localhost:6379" -ForegroundColor White
Write-Host ""
Write-Host "📝 To view logs: docker-compose -f docker-compose.dev.yml logs -f" -ForegroundColor Yellow
Write-Host "🛑 To stop: docker-compose -f docker-compose.dev.yml down" -ForegroundColor Yellow
Write-Host ""
Write-Host "🧪 Test your custom product API with:" -ForegroundColor Cyan
Write-Host "   node test-custom-product.js" -ForegroundColor White
