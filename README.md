### 🎯 Job Tracker — Frontend

A clean, responsive React frontend for the Job Tracker API. Track your internship and job applications with real-time stats, status filtering, and a beautiful dark UI.

### ✨ Features

- 🔐 Register & Login with JWT authentication
- 📊 Live stats dashboard (Applied, OA, Interview, Rejected, Offer)
- ➕ Add, edit, delete job applications
- 🔍 Search by company name
- 🎯 Filter by application status
- 🎨 Clean dark UI with color-coded status badges
- 🔔 Toast notifications for all actions
- 📱 Fully responsive layout

### 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool |
| Tailwind CSS v3 | Styling |
| React Router v6 | Client-side routing |
| Axios | HTTP requests |
| React Hot Toast | Notifications |
| Context API | Auth state management |

### 📁 Project Structure

```
src/
├── api/
│   └── axios.js           # Axios instance with JWT interceptor
├── components/
│   └── Navbar.jsx         # Top navigation bar
├── context/
│   └── AuthContext.jsx    # Global auth state
├── pages/
│   ├── Login.jsx          # Login page
│   ├── Register.jsx       # Register page
│   └── Dashboard.jsx      # Main dashboard
├── App.jsx                # Routes & protected route logic
└── main.jsx               # Entry point
```

### 🚀 Getting Started

### Prerequisites
- Node.js v18+
- Job Tracker API running (backend)

### Installation

```bash
# Clone the repo
git clone https://github.com/YOURUSERNAME/job-tracker-frontend.git
cd job-tracker-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Connect to Backend

In `src/api/axios.js`, update the `baseURL`:

```javascript
// For local development
baseURL: 'http://localhost:5000/api'

// For production
baseURL: 'https://your-render-api.onrender.com/api'
```

### 🎨 Status Badge Colors

| Status | Color |
|--------|-------|
| Applied | 🔵 Blue |
| OA | 🟡 Yellow |
| Interview | 🟣 Purple |
| Rejected | 🔴 Red |
| Offer | 🟢 Green |

### 🔐 Auth Flow

```
Register / Login
      ↓
JWT token saved to localStorage
      ↓
Axios interceptor attaches token to every request
      ↓
Protected routes check auth state via Context API
      ↓
Logout clears token + redirects to login
```

### 🌐 Live Demo

> Deployed on Vercel: `https://job-tracker-frontend-gules.vercel.app/login`

### 🔗 Related

- [Job Tracker API (Backend)](https://github.com/YOURUSERNAME/job-tracker-api)
