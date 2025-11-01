# 🚀 Quick Start Guide

## Prerequisites Check

Before starting, verify you have:
- ✅ Node.js (v18+) - Run: `node --version`
- ✅ PostgreSQL (v14+) - Run: `psql --version`
- ✅ npm or yarn

## Setup Steps (5 minutes)

### Step 1: Create Database

Open PowerShell or Command Prompt:

```powershell
# Connect to PostgreSQL
psql -U postgres

# In psql prompt, create database:
CREATE DATABASE highway_delite;

# Exit psql
\q
```

**Alternative using pgAdmin:**
1. Open pgAdmin
2. Right-click on "Databases"
3. Create > Database
4. Name: `highway_delite`
5. Click "Save"

### Step 2: Configure Backend

1. Open `backend/.env` file
2. Update these lines with your PostgreSQL credentials:

```env
DB_USER=postgres
DB_PASSWORD=your_actual_password
```

**Default PostgreSQL password is often `postgres` or the one you set during installation.**

### Step 3: Start Backend & Seed Data

Open Terminal #1:

```powershell
cd "C:\Users\PC\OneDrive\Desktop\New folder (2)\highway-delite\backend"
npm run dev
```

Wait for message: **"Database synchronized"**

Then open Terminal #2:

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

Open Terminal #3:

```powershell
cd "C:\Users\PC\OneDrive\Desktop\New folder (2)\highway-delite\frontend"
npm run dev
```

## 🎉 Access the Application

**Frontend:** http://localhost:5173  
**Backend:** http://localhost:5000

## 📋 Test the Application

### 1. Browse Experiences
- Open http://localhost:5173
- You should see 8 travel experiences

### 2. Book an Experience
- Click "View Details" on any experience
- Select a date (e.g., Oct 22)
- Choose a time slot (pick one with availability)
- Adjust quantity if needed
- Click "Confirm"

### 3. Complete Checkout
- Enter Name: `Test User`
- Enter Email: `test@example.com`
- Try promo code: `SAVE10` (10% off)
- Check "I agree to terms"
- Click "Pay and Confirm"

### 4. View Confirmation
- You'll see a booking reference like: `HUF56XYZ`
- Note the booking details

## 🎁 Available Promo Codes

- **SAVE10** - 10% discount
- **FLAT100** - ₹100 flat discount
- **WELCOME20** - 20% discount

## ❓ Troubleshooting

### Database Connection Error

**Error:** `ECONNREFUSED ::1:5432`

**Solution:**
1. Check PostgreSQL is running:
   - Windows: Open Services (Win+R → `services.msc`)
   - Look for "postgresql-x64-XX" service
   - Right-click → Start (if not running)

2. Verify credentials in `backend/.env`:
   ```env
   DB_HOST=localhost
   DB_USER=postgres
   DB_PASSWORD=your_password
   DB_NAME=highway_delite
   ```

3. Test connection:
   ```powershell
   psql -U postgres -d highway_delite
   ```

### Port Already in Use

**Error:** `Port 5000 is already in use`

**Solution:**
Change port in `backend/.env`:
```env
PORT=5001
```

Then update `frontend/.env`:
```env
VITE_API_URL=http://localhost:5001/api
```

### Frontend Not Loading

**Error:** Blank page or errors

**Solution:**
1. Check backend is running (Terminal #1)
2. Check browser console (F12)
3. Verify API URL in `frontend/.env`
4. Clear browser cache (Ctrl+Shift+R)

## 📦 Project Structure

```
highway-delite/
├── backend/          # Node.js + Express API
│   ├── src/
│   │   ├── models/   # Database models
│   │   ├── routes/   # API endpoints
│   │   └── scripts/  # Database seed
│   └── .env          # Database config
│
└── frontend/         # React + TypeScript UI
    ├── src/
    │   ├── pages/    # Home, Details, Checkout, Result
    │   └── components/ # Reusable components
    └── .env          # API URL config
```

## 🔄 Restart Everything

If you need to restart:

1. **Stop all terminals** (Ctrl+C in each)

2. **Restart Backend:**
   ```powershell
   cd backend
   npm run dev
   ```

3. **Restart Frontend:**
   ```powershell
   cd frontend
   npm run dev
   ```

## 🛑 Stop the Application

1. Press `Ctrl+C` in each terminal window
2. Type `Y` if prompted to terminate

## 📚 Next Steps

- Read the full [README.md](README.md) for detailed documentation
- Explore the codebase
- Try different booking scenarios
- Test the promo codes
- Check responsive design on different screen sizes

---

**Need Help?** Check the main README.md or create an issue in the repository.

**Happy Coding! 🎉**
