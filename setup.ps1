# HabitFlow - Quick Start Script
# This script helps you set up your environment

Write-Host "🔥 HabitFlow - Setup Assistant" -ForegroundColor Cyan
Write-Host "================================`n" -ForegroundColor Cyan

# Check if .env exists
$envPath = ".\server\.env"
if (Test-Path $envPath) {
    Write-Host "✅ .env file already exists" -ForegroundColor Green
} else {
    Write-Host "📝 Creating .env file from template..." -ForegroundColor Yellow
    Copy-Item ".\server\.env.example" $envPath
    Write-Host "✅ .env file created!" -ForegroundColor Green
    Write-Host "`n⚠️  IMPORTANT: You need to configure your MongoDB Atlas connection!" -ForegroundColor Red
    Write-Host "   1. Open server\.env in a text editor" -ForegroundColor Yellow
    Write-Host "   2. Replace MONGODB_URI with your MongoDB Atlas connection string" -ForegroundColor Yellow
    Write-Host "   3. See MONGODB_SETUP.md for detailed instructions`n" -ForegroundColor Yellow
    
    $openFile = Read-Host "Would you like to open .env file now? (y/n)"
    if ($openFile -eq "y") {
        notepad $envPath
    }
}

Write-Host "`n📦 Checking dependencies..." -ForegroundColor Cyan

# Check if node_modules exists
if (Test-Path ".\node_modules") {
    Write-Host "✅ Frontend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Frontend dependencies not found" -ForegroundColor Yellow
    Write-Host "   Run: npm install" -ForegroundColor Yellow
}

if (Test-Path ".\server\node_modules") {
    Write-Host "✅ Backend dependencies installed" -ForegroundColor Green
} else {
    Write-Host "⚠️  Backend dependencies not found" -ForegroundColor Yellow
    Write-Host "   Run: cd server && npm install" -ForegroundColor Yellow
}

Write-Host "`n🚀 Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Configure MongoDB Atlas (see MONGODB_SETUP.md)" -ForegroundColor White
Write-Host "   2. Update server\.env with your MongoDB connection string" -ForegroundColor White
Write-Host "   3. Run backend: npm run server" -ForegroundColor White
Write-Host "   4. Run frontend: npm run dev" -ForegroundColor White
Write-Host "   5. Open http://localhost:3000 in your browser`n" -ForegroundColor White

Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "   - README.md - Main documentation" -ForegroundColor White
Write-Host "   - MONGODB_SETUP.md - MongoDB Atlas setup guide`n" -ForegroundColor White

Write-Host "Happy habit building! 🎯🔥`n" -ForegroundColor Green
