# Flex Living – Full Reviews Dashboard (Assessment)

This repository contains a complete full-stack implementation of the **Flex Living Reviews Dashboard**, built as part of the engineering assignment.

The system provides:

- A **powerful admin dashboard** for moderating property reviews  
- A **public-facing property page**  
- **Analytics & charts** for insight  
- Optional **Google Places integration**  
- Fully deployed version on Render  
- Clean, modern UI inspired by hospitality aesthetics  

---

# 🚀 Live Demo

### **Frontend (Render)**
https://flex-assignment-client.onrender.com/

Backend is deployed separately and consumed by the frontend.

---

# 📦 Project Overview

This project is a full-stack reviews platform designed for property management teams.  
It centralizes review collection, approval, and analytics — providing property managers with:

- A single source of truth for guest feedback  
- Insightful charts and trend analysis  
- Ability to publish only approved reviews  
- Optional integration with external platforms

### What’s included:

### ✔ Admin Dashboard
- Search & filter reviews  
- Approve / hide  
- Highlight pending reviews  
- Modern UI with warm hospitality style  

### ✔ Public Property Page
- Auto-generated per listing  
- Shows only approved reviews  
- Clean layout for real users  

### ✔ Charts / Analytics
- Radar chart for category scores  
- Rating distribution  
- Trend over time  
- Per-listing insights  

### ✔ Full API Backend
- Hostaway integration  
- Automatic fallback to mock reviews  
- Google Places support (optional)  
- Persistent approval database  

---

# 🧠 Features Breakdown

## 🔹 Review Ingestion
- Fetches reviews from Hostaway  
- Hostaway sandbox returns empty → automatic fallback to mock JSON  
- Optional Google Places review ingestion  

## 🔹 Moderation Tools
- Approve / hide any review  
- Persistent storage to `approved.json`  
- UI updates instantly after action  

## 🔹 Filters
Supported on both frontend & backend:
- Minimum rating  
- Channel (Airbnb, Booking, Google)  
- Type (guest-to-host)  

## 🔹 Visualizations
- **CategoryRadarChart**  
- **RatingTrendChart**  
- **RatingDistributionChart**  

Developed using **Recharts** and custom logic in `reviewStats.ts`.

## 🔹 Deployment
Both backend and frontend run perfectly on Render.

---

# 🛠 Tech Stack

### **Frontend**
- React (Vite + TS)
- TailwindCSS
- Recharts
- Axios
- React Router

### **Backend**
- Node.js + Express
- Axios
- File-based persistence
- Hostaway API
- Google Places API (optional)

---

# 🗂 Project Structure

```
flex-assignment/
  client/
    src/
      pages/
      components/
      charts/
      api/
      utils/
      index.css
      App.tsx
  server/
    src/
      routes/
      services/
      data/
    index.js
```

---

# 🔧 Local Installation

## 1. Clone the repo

```
git clone https://github.com/YOUR_USERNAME/flex-assignment.git
cd flex-assignment
```

---

# 🖥 Backend Setup

```
cd server
npm install
npm run dev
```

Backend will run on:
```
http://localhost:3001
```

### Optional `.env`
```
HOSTAWAY_ACCOUNT=61148
HOSTAWAY_API_KEY=
GOOGLE_API_KEY=
```

> Google Places API requires a paid billing account — the assignment code supports it, but it is **disabled** in the public demo.

---

# 💻 Frontend Setup

```
cd client
npm install
npm run dev
```

Frontend will run at:
```
http://localhost:5173
```

### Optional `.env`
```
VITE_API_URL=http://localhost:3001
VITE_GOOGLE_PLACE_ID=
```

---

# 🌍 Deployment (Render)

### **Frontend**
Deployed at:  
https://flex-assignment-client.onrender.com/

Frontend environment variable:
```
VITE_API_URL=https://your-backend.onrender.com
```

### **Backend**
Render Web Service  
Start command:
```
node index.js
```

---

# 📡 API Reference

## GET `/api/reviews/hostaway`
Loads normalized reviews from Hostaway or fallback mock.

### Query Parameters:
- `minRating`
- `channel`
- `type`

---

## POST `/api/reviews/approve/:id`
Body:
```json
{ "approved": true }
```

Stores approved IDs in `approved.json`.

---

## GET `/api/reviews/google`
Loads Google reviews if API key is available.

---

# 📈 Charts Overview

### Radar Chart
Shows normalized categories like:
- Cleanliness  
- Communication  
- Accuracy  
- Value  

### Trend Chart
Timeline of rating over time.

### Rating Distribution
Histogram showing rating frequency.

---

# 📌 Notes for Reviewers

- Hostaway sandbox returns **empty list** → mock JSON file is used as instructed.
- Google Places API requires paid billing → integration included but **disabled**.
- Approve/hide is fully persistent.
- UI focuses on hospitality design — warm, soft, inviting.
- Fully deployed version included.

---

# 🤝 Author

**Daniyal Namdar**  
Backend Developer

---

# ✔ End of README
