

```markdown
# ELD Trip Logger 🚚🗺️

A fullstack web application for logging Electronic Logging Device (ELD) driver trips, generating routes, and producing daily log sheets for compliance and trip planning.

## 🔍 Objective

This project helps drivers and fleet managers plan and log trips based on regulatory cycle limits, rest stops, and fueling requirements. The app uses map data to visualize routes and dynamically generates daily logs.

---

## 🧩 Features

### 📝 Input Fields
- **Driver Name**
- **Date**
- **Current Location** *(Mapbox autocomplete)*
- **Pickup Location** *(Mapbox autocomplete)*
- **Dropoff Location** *(Mapbox autocomplete)*
- **Current Cycle Used (Hours)**
- **Total Miles**
- **Off Duty Hours**
- **Sleeper Berth Hours**
- **Driving Hours**
- **On Duty Hours**

### 🗺️ Outputs
- **Route Map** using a free map API (Mapbox/OpenStreetMap)
  - Shows trip path from current → pickup → dropoff
  - Includes markers and polyline
- **Stops & Rest Info**
  - Assumes fueling every 1,000 miles
  - 1-hour rest time at pickup and dropoff
- **Daily Log Sheets**
  - Dynamically generated logs for trips spanning multiple days
  - Tracks driving time, rest breaks, and on-duty/off-duty hours

---

## ⚙️ Assumptions
- Property-carrying driver
- 70-hour / 8-day driving cycle limit
- No adverse driving conditions

---

## 📦 Tech Stack

### 🧠 Backend (Django + Django REST Framework)
- RESTful API to manage trip logs
- PostgreSQL or SQLite for storage
- Handles trip creation, log generation, and route instruction logic

### 💻 Frontend (React + Material UI)
- Responsive, dashboard-style layout
- Form input for trip details
- Interactive map display
- Elegant log sheet visualization
- Human-readable location inputs (Mapbox Geocoder)

---

## 🚀 How to Run Locally

### Backend (Django)

```bash
cd Backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Frontend (React)

```bash
cd Frontend
npm install
npm start
```

Access the app at: `http://localhost:3000`

---

## 🛣️ Future Improvements

- User authentication for trip ownership
- PDF export for logs
- Admin dashboard
- Real-time tracking and ETA calculation

---

## 📄 License

This project is licensed for educational and demonstration purposes.
```

---
