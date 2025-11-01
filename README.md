# Highway Delite - Travel Experience Booking Platform

A complete fullstack web application for exploring and booking travel experiences. Built with React, TypeScript, TailwindCSS on the frontend and Node.js, Express, PostgreSQL on the backend.

## 🌟 Features

- **Browse Experiences**: Explore curated travel experiences with high-quality images
- **View Details**: See complete experience information with available dates and time slots
- **Real-time Availability**: Check slot availability in real-time
- **Smart Booking**: Select date, time, and quantity with instant price calculation
- **Promo Codes**: Apply discount codes (SAVE10, FLAT100, WELCOME20)
- **Responsive Design**: Fully responsive UI matching the Figma design across all devices
- **Form Validation**: Client-side validation for booking information
- **Booking Confirmation**: Get unique booking reference after successful booking

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **TailwindCSS** for styling
- **React Router** for navigation
- **Axios** for API calls

### Backend
- **Node.js** with Express
- **TypeScript** for type safety
- **PostgreSQL** database
- **Sequelize** ORM
- **Joi** for validation

## 📋 Prerequisites

Before running this application, ensure you have:

- **Node.js** (v18 or higher)
- **PostgreSQL** (v14 or higher)
- **npm** or **yarn**

## 🚀 Getting Started

### 1. Clone the Repository

```bash
cd "C:\Users\PC\OneDrive\Desktop\New folder (2)\highway-delite"
```

### 2. Database Setup

Create a PostgreSQL database:

```sql
CREATE DATABASE highway_delite;
```

Or use psql command line:

```bash
psql -U postgres
CREATE DATABASE highway_delite;
\q
```

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
copy .env.example .env

# Edit .env file with your database credentials
# Update DB_USER, DB_PASSWORD, and other settings as needed
```

**Sample `.env` configuration:**
```env
PORT=5000
NODE_ENV=development

DB_HOST=localhost
DB_PORT=5432
DB_NAME=highway_delite
DB_USER=postgres
DB_PASSWORD=your_postgres_password

CORS_ORIGIN=http://localhost:5173
```

### 4. Seed Database

```bash
# Still in backend directory
# Run database migrations and seed data
npm run dev

# Wait for "Database synchronized" message, then stop (Ctrl+C)

# Run seed script
npx ts-node src/scripts/seed.ts
```

This will create:
- 8 different travel experiences
- Multiple time slots for each experience across 5 dates
- Various availability statuses

### 5. Start Backend Server

```bash
# In backend directory
npm run dev
```

The backend server will start on `http://localhost:5000`

### 6. Frontend Setup

Open a new terminal:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create .env file (optional, defaults work)
copy .env.example .env
```

### 7. Start Frontend Development Server

```bash
# In frontend directory
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📱 Application Flow

### User Journey

1. **Home Page** (`/`)
   - View all available travel experiences
   - See experience name, location, price, and image
   - Click "View Details" to explore an experience

2. **Details Page** (`/experience/:id`)
   - View full experience description and large image
   - Select date from available dates
   - Choose time slot (shows availability: "X left" or "Sold out")
   - Adjust quantity using +/- buttons
   - See live price calculation (subtotal, taxes, total)
   - Click "Confirm" to proceed

3. **Checkout Page** (`/checkout`)
   - Enter full name and email (with validation)
   - Apply promo code (SAVE10, FLAT100, WELCOME20)
   - Review booking summary
   - Agree to terms and safety policy
   - Click "Pay and Confirm"

4. **Result Page** (`/result`)
   - Success: See booking confirmation with unique reference ID
   - Failure: See error message with option to try again
   - Return to home

## 🎯 API Endpoints

### Experiences

**GET** `/api/experiences`
- Returns list of all experiences
- Response: `{ success: boolean, data: Experience[] }`

**GET** `/api/experiences/:id`
- Returns experience details with available slots
- Response: `{ success: boolean, data: ExperienceDetail }`

### Bookings

**POST** `/api/bookings`
- Creates a new booking
- Body: `{ experienceId, slotId, fullName, email, quantity, promoCode?, date, time }`
- Response: `{ success: boolean, message: string, data?: BookingData }`
- Validates slot availability
- Prevents double-booking
- Calculates pricing with taxes and discounts

### Promo Codes

**POST** `/api/promo/validate`
- Validates promo code and returns discount
- Body: `{ code: string, subtotal: number }`
- Response: `{ success: boolean, data?: PromoData }`

**Available Promo Codes:**
- `SAVE10` - 10% discount
- `FLAT100` - ₹100 flat discount
- `WELCOME20` - 20% discount

## 🎨 Design Features

- **Responsive Layout**: Mobile-first design that works on all screen sizes
- **Clean Typography**: Inter font family for consistent, modern look
- **Color Scheme**:
  - Primary: `#FFD93D` (Yellow) for CTAs
  - Secondary: `#6C757D` (Gray) for text
  - White cards with subtle shadows
- **Interactive Elements**:
  - Hover effects on buttons and cards
  - Loading states with animated spinners
  - Disabled states for sold-out slots
  - Form validation with error messages
- **Feedback**:
  - Success/error notifications
  - Real-time promo code validation
  - Slot availability indicators

## 🏗️ Project Structure

```
highway-delite/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.ts          # Database configuration
│   │   ├── models/
│   │   │   ├── Experience.ts        # Experience model
│   │   │   ├── Slot.ts             # Slot model
│   │   │   └── Booking.ts          # Booking model
│   │   ├── routes/
│   │   │   ├── experiences.ts      # Experience endpoints
│   │   │   ├── bookings.ts         # Booking endpoints
│   │   │   └── promo.ts            # Promo code validation
│   │   ├── scripts/
│   │   │   └── seed.ts             # Database seeding
│   │   └── index.ts                # Server entry point
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Header.tsx           # Navigation header
    │   │   ├── Loading.tsx          # Loading spinner
    │   │   └── ExperienceCard.tsx   # Experience card component
    │   ├── pages/
    │   │   ├── Home.tsx             # Home page
    │   │   ├── Details.tsx          # Experience details
    │   │   ├── Checkout.tsx         # Checkout form
    │   │   └── Result.tsx           # Booking result
    │   ├── services/
    │   │   └── api.ts               # API client
    │   ├── App.tsx                  # Main app component
    │   ├── main.tsx                 # Entry point
    │   └── index.css                # Global styles
    ├── package.json
    ├── vite.config.ts
    ├── tailwind.config.js
    └── .env.example
```

## 🔒 Data Validation

### Frontend Validation
- Full name: Required, minimum 2 characters
- Email: Required, valid email format
- Terms agreement: Required checkbox
- Slot selection: Required before proceeding

### Backend Validation
- All required fields validated using Joi
- UUID format validation for IDs
- Email format validation
- Quantity minimum 1
- Slot availability check
- Prevents double-booking with database transactions

## 💾 Database Schema

### Experiences Table
```sql
- id (UUID, Primary Key)
- name (String)
- location (String)
- description (Text)
- image (String - URL)
- price (Decimal)
- createdAt, updatedAt
```

### Slots Table
```sql
- id (UUID, Primary Key)
- experienceId (UUID, Foreign Key)
- date (Date)
- time (String)
- availableSpots (Integer)
- totalSpots (Integer)
- createdAt, updatedAt
```

### Bookings Table
```sql
- id (UUID, Primary Key)
- experienceId (UUID)
- slotId (UUID)
- fullName (String)
- email (String)
- quantity (Integer)
- promoCode (String, Optional)
- discount (Decimal)
- subtotal (Decimal)
- taxes (Decimal)
- total (Decimal)
- bookingRef (String, Unique)
- status (Enum: confirmed/pending/cancelled)
- createdAt, updatedAt
```

## 🧪 Testing the Application

### Test the Complete Flow:

1. **Browse Experiences**
   - Visit `http://localhost:5173`
   - Verify all 8 experiences are displayed with images

2. **View Experience Details**
   - Click "View Details" on any experience
   - Verify dates are displayed
   - Select a date and verify time slots appear
   - Try selecting a sold-out slot (should be disabled)
   - Increase quantity and verify price updates

3. **Test Booking**
   - Select an available slot
   - Click "Confirm"
   - Fill in name: "John Doe"
   - Fill in email: "john@example.com"
   - Try clicking "Pay and Confirm" without agreeing to terms (should show error)
   - Check the terms checkbox
   - Click "Pay and Confirm"

4. **Test Promo Codes**
   - On checkout page, enter "SAVE10" and click Apply
   - Verify 10% discount is applied
   - Try "FLAT100" for flat ₹100 discount
   - Try "WELCOME20" for 20% discount
   - Try invalid code "INVALID123" (should show error)

5. **Verify Booking Success**
   - Complete a booking
   - Verify you see "Booking Confirmed" page
   - Check booking reference format (e.g., "HUF56XYZ")
   - Verify booking details are correct

6. **Test Slot Updates**
   - Go back to the same experience and same slot
   - Verify available spots decreased by your booking quantity

## 🚨 Troubleshooting

### Backend Issues

**Database Connection Error:**
```
Check PostgreSQL is running:
Windows: Check Services (services.msc) for "postgresql" service
Verify database credentials in .env file
```

**Port Already in Use:**
```
Change PORT in backend/.env to a different port (e.g., 5001)
```

### Frontend Issues

**API Connection Error:**
```
Verify backend is running on port 5000
Check CORS_ORIGIN in backend/.env matches frontend URL
Check VITE_API_URL in frontend/.env
```

**Build Errors:**
```
Delete node_modules and package-lock.json
Run: npm install
```

## 📦 Build for Production

### Backend

```bash
cd backend
npm run build
npm start
```

### Frontend

```bash
cd frontend
npm run build
# Files will be in dist/ folder
npm run preview  # Preview production build
```

## 🌐 Deployment

### Backend Deployment (Example with Heroku/Railway)

1. Set environment variables
2. Configure PostgreSQL database
3. Run migrations and seed
4. Deploy backend

### Frontend Deployment (Example with Vercel/Netlify)

1. Build the project
2. Set VITE_API_URL to production backend URL
3. Deploy dist folder

## 🔑 Key Features Implemented

✅ Complete CRUD operations for experiences and bookings  
✅ Real-time slot availability management  
✅ Promo code validation system  
✅ Transaction-based booking (prevents double-booking)  
✅ Form validation (client and server side)  
✅ Responsive design matching Figma specs  
✅ Loading states and error handling  
✅ Clean, maintainable code structure  
✅ TypeScript for type safety  
✅ RESTful API design  

## 📄 License

This project is created for demonstration purposes.

## 👥 Contact

For questions or issues, please create an issue in the repository.

---

**Built with ❤️ using React, TypeScript, Node.js, and PostgreSQL**
