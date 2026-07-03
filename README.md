# Spice Garden - Restaurant Management System

Spice Garden is a complete, dynamic, and responsive Full-Stack web application designed for a multi-cuisine restaurant. It features a modern customer-facing website and a secure, fully functional Admin Dashboard to manage menu items, reservations, and customer orders.

## 🚀 Features

### Customer Interface
- **Dynamic Menu:** View categorized food items with images and descriptions.
- **Online Ordering:** Add items to cart and place orders.
- **Table Reservation:** Book tables for specific dates and times.
- **Payment Integration:** Secure checkout using Razorpay gateway.

### Admin Dashboard
- **Menu Management:** Add, edit, or delete menu items (with image uploads).
- **Order Tracking:** View and update the status of customer orders.
- **Reservation Management:** View and confirm/cancel table bookings.
- **Secure Authentication:** JWT-based login for administrators.

## 🛠️ Technology Stack
- **Frontend:** HTML5, CSS3, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose ORM)
- **Authentication:** JSON Web Tokens (JWT)
- **File Uploads:** Multer
- **Payment Gateway:** Razorpay API

---

## ⚙️ Installation & Setup Guide

### 1. Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/) (Local server or MongoDB Atlas URI)

### 2. Clone/Download the Repository
Extract the project zip file or clone the repository to your local machine.

### 3. Install Dependencies
Open your terminal/command prompt, navigate to the root directory of the project, and run:
```bash
npm install
```

### 4. Environment Variables Setup
1. Navigate to the `backend` folder.
2. Rename the file `.env.example` to `.env`.
3. Open the `.env` file and fill in your specific credentials:
   - `MONGODB_URI`: Your MongoDB connection string.
   - `JWT_SECRET`: A secure random string for generating tokens.
   - `RAZORPAY_KEY_ID`: Your Razorpay API Key ID.
   - `RAZORPAY_KEY_SECRET`: Your Razorpay API Key Secret.

### 5. Seed the Database (Optional but Recommended)
To populate your database with initial sample menu items and create a default admin user, run:
```bash
npm run seed
```

### 6. Start the Server
Run the following command in the root directory to start the Node.js server:
```bash
npm start
```
*Alternatively, for development mode:*
```bash
npm run dev
```

The server will start on `http://localhost:5000` (or the PORT specified in your `.env`).

---

## 🔑 Default Admin Credentials
If you ran the seed script (`npm run seed`), a default admin account will be created.

- **Admin Login Page:** `/admin/index.html` (or via the Live URL if hosted)
- **Email:** `admin@spicegarden.com`
- **Password:** `admin123`

*(Note: It is highly recommended to change this password or create a new admin user in a production environment).*

---

## 🌐 Deployment
This project is configured with a `vercel.json` file, making it ready for deployment on [Vercel](https://vercel.com).
- Frontend files will be served statically.
- Ensure you set up the Environment Variables (`.env`) in your hosting provider's dashboard before deploying.

---
*Developed for Spice Garden Restaurant.*
