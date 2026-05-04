# VitaMetrics: Personal Health Dashboard

*By Adrien Rozario, Vonn Sayasa, Grace Yu, and Tamiya Phillips*

🌐 **Live App:** [https://v1tametrics.azurewebsites.net/](https://v1tametrics.azurewebsites.net/)

https://github.com/user-attachments/assets/2512f02d-11ff-4a15-af0d-488212b5fb28

---

## 🧠 Overview

VitaMetrics is a cloud-based personal health tracking dashboard that enables users to monitor and analyze key lifestyle metrics, including:

* Sleep
* Exercise
* Nutrition
* Mood & Stress
* Daily activity

Users can log daily health data and visualize trends through interactive charts, helping them identify patterns and make more informed decisions about their health and habits.

---

## 🚀 Features

* 🔐 User authentication (Supabase)
* 📊 Interactive data visualizations (Recharts)
* 📅 Custom date range filtering
* 🥗 Nutrition tracking (macros + calories)
* 🎯 Goal setting and tracking
* 📁 File uploads (meal images & reports via Azure Blob Storage)
* ☁️ Cloud-hosted backend (Azure + Cosmos DB)
* 🌐 Fully deployed full-stack application

---

## 🛠️ Tech Stack

**Frontend**

* React (with React Router)
* TypeScript
* Tailwind CSS
* Recharts

**Backend**

* Node.js + Express
* Azure App Service
* Azure Cosmos DB (NoSQL)
* Azure Blob Storage

**Authentication**

* Supabase Auth

---

## 🌐 Deployment

The application is fully deployed on **Azure App Service**:

👉 [https://v1tametrics.azurewebsites.net/](https://v1tametrics.azurewebsites.net/)

The deployment pipeline is automated using GitHub Actions, which builds and deploys the app on every push to the `main` branch.

---

## ⚙️ Getting Started (Local Development)

### Requirements

* Node.js ≥ 22

### Installation

```bash
npm install
```

### Run locally

```bash
npm run dev-win
```

This runs:

* Frontend (Vite dev server)
* Backend (Express API)

App will be available at:

```
http://localhost:5173
```

---

## 📦 Build for Production

```bash
npm run build
```

This generates:

```
build/
  ├── client/   # Frontend assets
  └── server/   # SSR server
```

---

## 🔄 Git Workflow

```bash
git pull
git add .
git commit -m "your message"
git push
```

---

## 🧩 Project Structure (Simplified)

```
app/
  backend/        # Express API routes (metrics, goals, files, users)
  pages/          # Main UI pages (dashboard, login, profile, etc.)
  routes/         # Route handlers
  components/     # Reusable UI components
build/
  client/         # Production frontend
  server/         # SSR server bundle
```

---

## 📊 Data Model Highlights

* **Metrics (Cosmos DB)**

  * One document per user per day
  * Includes sleep, exercise, nutrition, wellness

* **Files**

  * Stored in Azure Blob Storage
  * Metadata stored in Cosmos DB

---

## 🧠 Design Decisions

* **Supabase for Auth** → simplifies authentication without custom backend logic
* **Cosmos DB (NoSQL)** → flexible schema for evolving health metrics
* **Blob Storage** → scalable file storage for images and reports
* **React Router SSR** → full-stack React architecture

---

## ⚠️ Known Issues / Future Improvements

* File upload preview and document rendering improvements
* Enhanced error handling for failed uploads
* Optional nutrition unit conversions (grams ↔ calories)
* Mobile responsiveness improvements

---

## 🎯 Demo Notes

* Log metrics to see dashboard updates
* Upload files in the Files tab
* Use custom date ranges to explore trends
* Update profile information via Profile page

---

## ❤️ Acknowledgements

Built as part of a cloud computing project, combining full-stack development with real-world cloud infrastructure.



