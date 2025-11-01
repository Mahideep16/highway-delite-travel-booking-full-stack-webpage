# MySQL Database Creation Script
# Run this script to create the highway_delite database

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "MySQL Database Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# MySQL Path
$mysqlPath = "C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe"

if (!(Test-Path $mysqlPath)) {
    Write-Host "❌ MySQL not found at expected location" -ForegroundColor Red
    Write-Host "Please locate mysql.exe and update the path in this script" -ForegroundColor Yellow
    exit 1
}

Write-Host "✓ MySQL found" -ForegroundColor Green
Write-Host ""

# Prompt for password
$password = Read-Host "Enter MySQL root password" -AsSecureString
$BSTR = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($password)
$plainPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($BSTR)

Write-Host ""
Write-Host "Creating database..." -ForegroundColor Yellow

# Create database
$createDbCommand = "CREATE DATABASE IF NOT EXISTS highway_delite; SHOW DATABASES LIKE 'highway_delite';"
$output = & $mysqlPath -u root -p"$plainPassword" -e $createDbCommand 2>&1

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Green
    Write-Host "✓ Database created successfully!" -ForegroundColor Green
    Write-Host "========================================" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Update backend/.env with your MySQL password:" -ForegroundColor White
    Write-Host "   DB_PASSWORD=your_password" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "2. Start the backend server:" -ForegroundColor White
    Write-Host "   cd backend" -ForegroundColor Cyan
    Write-Host "   npm run dev" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "3. Seed the database (in another terminal):" -ForegroundColor White
    Write-Host "   cd backend" -ForegroundColor Cyan
    Write-Host "   npx ts-node src/scripts/seed.ts" -ForegroundColor Cyan
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Failed to create database" -ForegroundColor Red
    Write-Host "Error: $output" -ForegroundColor Red
    Write-Host ""
    Write-Host "Common issues:" -ForegroundColor Yellow
    Write-Host "- Incorrect password" -ForegroundColor White
    Write-Host "- MySQL service not running" -ForegroundColor White
    Write-Host ""
    Write-Host "Try accessing MySQL manually:" -ForegroundColor Yellow
    Write-Host "  & 'C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe' -u root -p" -ForegroundColor Cyan
}
