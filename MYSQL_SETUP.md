# MySQL Setup Guide for Highway Delite

The application has been converted to use **MySQL** instead of PostgreSQL.

## ✅ What Changed

- Database driver: PostgreSQL → MySQL
- Default port: 5432 → 3306
- Default user: postgres → root
- Package: pg → mysql2

## 🚀 Quick Setup

### Option 1: Check if MySQL is Already Installed

```powershell
# Check if MySQL is installed
mysql --version
```

If you see a version number, MySQL is installed! Skip to **Step 3**.

### Option 2: Install MySQL (5 minutes)

1. **Download MySQL:**
   - Visit: https://dev.mysql.com/downloads/installer/
   - Download "MySQL Installer for Windows"
   - Choose "mysql-installer-community-X.X.XX.msi"

2. **Install MySQL:**
   - Run the installer
   - Choose "Custom" or "Developer Default"
   - Set root password (remember it!)
   - Default port: 3306 (keep it)
   - Complete installation

3. **Verify Installation:**
   ```powershell
   mysql --version
   ```

### Option 3: Use XAMPP (Easiest!) ⭐

If you have XAMPP installed:

1. Open XAMPP Control Panel
2. Click "Start" next to MySQL
3. That's it! MySQL is ready
4. Default password is usually empty

### Option 4: Use Docker

```powershell
docker run --name highway-delite-mysql -e MYSQL_ROOT_PASSWORD=root -e MYSQL_DATABASE=highway_delite -p 3306:3306 -d mysql:8
```

## 📝 Step-by-Step Setup

### Step 1: Create Database

**Using Command Line:**
```powershell
# Connect to MySQL (enter password when prompted)
mysql -u root -p

# In MySQL prompt:
CREATE DATABASE highway_delite;
EXIT;
```

**Using phpMyAdmin (if you have XAMPP):**
1. Open http://localhost/phpmyadmin
2. Click "New" in left sidebar
3. Database name: `highway_delite`
4. Click "Create"

**Using MySQL Workbench:**
1. Open MySQL Workbench
2. Click on your connection
3. Click "Create Schema" icon
4. Name: `highway_delite`
5. Click "Apply"

### Step 2: Configure Backend

Edit `backend/.env` file:

```env
PORT=5000
NODE_ENV=development

# Database Configuration (MySQL)
DB_HOST=localhost
DB_PORT=3306
DB_NAME=highway_delite
DB_USER=root
DB_PASSWORD=your_mysql_password

CORS_ORIGIN=http://localhost:5173
```

**Common MySQL passwords:**
- XAMPP: Usually empty (`DB_PASSWORD=`)
- MySQL Installer: Password you set during installation
- Docker: `root` (or whatever you set)

### Step 3: Start Backend & Seed Data

**Terminal 1 - Start Backend:**
```powershell
cd "C:\Users\PC\OneDrive\Desktop\New folder (2)\highway-delite\backend"
npm run dev
```

Wait for: **"Database synchronized"**

**Terminal 2 - Seed Database:**
```powershell
cd "C:\Users\PC\OneDrive\Desktop\New folder (2)\highway-delite\backend"
npx ts-node src/scripts/seed.ts
```

You should see:
```
Database synced
Created 8 experiences
Created 160 slots
Seed data created successfully
```

### Step 4: Start Frontend

**Terminal 3:**
```powershell
cd "C:\Users\PC\OneDrive\Desktop\New folder (2)\highway-delite\frontend"
npm run dev
```

### Step 5: Open Application

Visit: **http://localhost:5173**

## 🔧 Troubleshooting

### Error: "ER_NOT_SUPPORTED_AUTH_MODE"

MySQL 8+ uses a new authentication method. Fix:

```powershell
mysql -u root -p
```

In MySQL:
```sql
ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'your_password';
FLUSH PRIVILEGES;
EXIT;
```

### Error: "Access denied for user 'root'@'localhost'"

Your password is incorrect. Common defaults:
- XAMPP: No password (leave `DB_PASSWORD=` empty)
- Fresh install: Password you set during installation

Update `backend/.env` with correct password.

### Error: "Can't connect to MySQL server"

MySQL service is not running:

**Windows:**
1. Press Win+R
2. Type `services.msc`
3. Find "MySQL80" or similar
4. Right-click → Start

**XAMPP:**
1. Open XAMPP Control Panel
2. Click "Start" next to MySQL

### MySQL Service Won't Start

Port 3306 might be in use:

1. Change port in MySQL configuration
2. Or find what's using port 3306:
   ```powershell
   netstat -ano | findstr :3306
   ```

## ✨ Benefits of MySQL

- ✅ More common in shared hosting
- ✅ XAMPP includes it (easy for Windows)
- ✅ phpMyAdmin for easy database management
- ✅ Wide compatibility
- ✅ Great for small to medium applications

## 📊 Database Tables

The application will automatically create these tables:

1. **experiences** - Travel experiences
2. **slots** - Available time slots
3. **bookings** - Customer bookings

## 🎯 Test Database Connection

Create a test file to verify connection:

**test-db.js:**
```javascript
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '', // Your password
  database: 'highway_delite'
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Connection failed:', err.message);
  } else {
    console.log('✅ Connected to MySQL!');
  }
  connection.end();
});
```

Run:
```powershell
node test-db.js
```

## 🔄 Switching Back to PostgreSQL

If you want to switch back:

```powershell
cd backend
npm uninstall mysql2
npm install pg pg-hstore
```

Then update `src/config/database.ts` dialect back to `'postgres'`.

---

**Need Help?** Check the main README.md or create an issue.

**Ready to Start!** 🚀
