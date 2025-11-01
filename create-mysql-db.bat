@echo off
echo ========================================
echo MySQL Database Setup
echo ========================================
echo.

"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p -e "CREATE DATABASE IF NOT EXISTS highway_delite; SHOW DATABASES LIKE 'highway_delite';"

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo Database created successfully!
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Update backend\.env with your MySQL password
    echo    DB_PASSWORD=your_password
    echo.
    echo 2. Start backend: cd backend ^&^& npm run dev
    echo 3. Seed database: cd backend ^&^& npx ts-node src/scripts/seed.ts
    echo.
) else (
    echo.
    echo Failed to create database
    echo Please check your MySQL password
    echo.
)

pause
