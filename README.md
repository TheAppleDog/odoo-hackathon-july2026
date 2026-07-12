# 🚚 TransitOps - Smart Transport Operations Platform

TransitOps is a Transport Operations Management System developed for the **Odoo Hackathon** using **Python, Flask, MySQL, HTML, CSS, and JavaScript**.

The platform helps transport companies efficiently manage vehicles, drivers, trips, maintenance, fuel records, and operational analytics through a modern web dashboard.

---

# ✨ Features

## 🔐 Authentication
- Secure Login Page
- Logout Functionality

## 📊 Dashboard
- Fleet Overview KPIs
- Recent Activities
- Analytics Charts
- Quick Actions
- Search Bar

## 🚚 Vehicle Management
- View Fleet
- Search & Filter
- Add/Edit/Delete Vehicles
- MySQL Integrated

## 👨 Driver Management
- Driver Records
- Vehicle Assignment
- Driver Status Management

## 📦 Trip Management
- Create Trips
- Trip Scheduling
- Route Tracking
- Trip Status

## 🔧 Maintenance
- Service Scheduling
- Maintenance History
- Service Status

## ⛽ Fuel Management
- Fuel Logs
- Mileage Tracking
- Fuel Cost Monitoring

## 📈 Reports & Analytics
- Fleet Analytics
- Driver Performance
- Vehicle Utilization
- Summary Reports

## ⚙ Additional Pages
- User Profile
- Settings
- Notifications

---

# 🛠 Tech Stack

- Python
- Flask
- MySQL
- HTML5
- CSS3
- JavaScript
- Chart.js

---

# 📂 Project Structure

```
TransitOps
│
├── app.py
├── config.py
├── database.py
├── requirements.txt
│
├── database
│   ├── schema.sql
│   └── sample_data.sql
│
├── static
│   ├── css
│   ├── js
│   └── images
│
├── templates
│
└── README.md
```

---

# 🗄 Database

The project includes:

- MySQL Database
- Normalized Database Schema
- Foreign Key Relationships
- Sample Dataset
- Database Connection Layer

Tables Included:

- Users
- Vehicles
- Drivers
- Trips
- Maintenance
- Fuel Logs
- Notifications

---

# 🚀 Installation

Clone the repository

```bash
git clone <repository-url>
```

Go to the project folder

```bash
cd TransitOps
```

Install dependencies

```bash
pip install -r requirements.txt
```

Create Database

```sql
CREATE DATABASE transitops;
```

Import Schema

```sql
SOURCE database/schema.sql;
```

Import Sample Data

```sql
SOURCE database/sample_data.sql;
```

Run the application

```bash
python app.py
```

Open

```
http://127.0.0.1:5000
```

---

# 📸 Modules

- Dashboard
- Vehicles
- Drivers
- Trips
- Maintenance
- Fuel
- Reports
- Profile
- Settings

---

# 🎯 Future Enhancements

- Full Database CRUD Integration
- Role-Based Access Control
- Live GPS Tracking
- Route Optimization
- Email & SMS Notifications
- Predictive Maintenance
- Fuel Consumption Analytics
- Export Reports (PDF/Excel)

---

# 👩‍💻 Developed By

**Khushi Kulkarni**

Developed as part of the **Odoo Hackathon**.

---

## ⭐ Thank You

Thank you for reviewing TransitOps!
