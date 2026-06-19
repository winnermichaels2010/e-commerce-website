# 🌤️ WeatherApp - Weather Forecast Dashboard

A full-featured weather forecast web application built with **React**, **Vite**, **Firebase**, and **Tailwind CSS v4**. Users can search for any city's current weather, save their search history, and manage their account with Firebase Authentication.

---

## ✨ Features

### 🔐 Authentication (Firebase)
- Email & password registration
- Email verification (Firebase built-in email verification)
- Secure login/logout
- Protected routes — cannot access dashboard without signing in

### 🌍 Weather Search
- Search for any city worldwide using the **OpenWeatherMap API**
- View current temperature, weather description, humidity, wind speed, min/max temps
- Responsive weather display with icons

### 📊 Dashboard
- View all your weather search history stored in **Firestore**
- Stats cards: total searches, unique cities explored, account info
- Delete individual history entries
- Navigate to Home to search for more cities

### 🎨 Theme System
- **Dark mode**: Purple/dark gray color scheme
- **Light mode**: White background with purple & pink accents
- Toggle with a button in the navbar
- Theme persists in localStorage

### 📱 Responsive Navigation
- **Desktop (lg+)**: Sidebar always visible on the left
- **Mobile/Tablet (< lg)**: Hamburger menu toggles sidebar overlay
- Smooth slide animations

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **React 19** | UI framework |
| **Vite 5** | Build tool / dev server |
| **Tailwind CSS v4** | Utility-first CSS framework |
| **Firebase Auth** | User authentication |
| **Firestore** | Database (weather search history) |
| **React Router v7** | Client-side routing |
| **React Icons** | Icon library (Feather icons) |
| **OpenWeatherMap API** | Weather data |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- A Firebase project
- An OpenWeatherMap API key

### 1. Clone & Install
```bash
git clone <your-repo-url>
cd project-1
npm install
```

### 2. Firebase Setup
1. Go to the [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing `project-1-d279b`)
3. Enable **Authentication > Sign-in method > Email/Password**
4. Enable **Cloud Firestore** (create in test mode)
5. Copy your Firebase config object

Update `src/firebase.js` with your Firebase config if using a different project.

### 3. OpenWeatherMap Setup
1. Sign up at [OpenWeatherMap](https://openweathermap.org/api)
2. Get your free API key
3. Create a `.env` file in the root directory (see `.env.example`):

```env
VITE_WEATHER_API_KEY=your_actual_api_key_here
```

### 4. Run the Development Server
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
project-1/
├── .env                    # Environment variables (ignored by Git)
├── .env.example            # Example environment variables
├── index.html              # Entry HTML
├── package.json            # Dependencies & scripts
├── vite.config.js          # Vite configuration
├── public/
│   ├── favicon.svg
│   └── icons.svg
└── src/
    ├── main.jsx            # App entry point
    ├── App.jsx             # Router & routes
    ├── firebase.js         # Firebase initialization
    ├── index.css           # Tailwind + theme variables
    ├── auth/
    │   ├── AuthContext.jsx  # Firebase Auth context
    │   └── ThemeContext.jsx # Dark/Light mode context
    ├── components/
    │   ├── Layout.jsx      # Main layout (navbar + sidebar + footer)
    │   ├── Navbar.jsx      # Top navigation bar
    │   ├── Sidebar.jsx     # Side navigation
    │   ├── Footer.jsx      # Footer
    │   └── ProtectedRoute.jsx  # Auth guard
    ├── pages/
    │   ├── Home.jsx        # Weather search page
    │   ├── Login.jsx       # Login page
    │   ├── Register.jsx    # Registration page
    │   ├── VerifyEmail.jsx # Email verification page
    │   └── Dashboard.jsx   # Search history dashboard
    └── assets/
        ├── hero.png
        ├── react.svg
        └── vite.svg
```

---

## 🔄 App Flow

1. **Home** (`/`) — Public. Search any city for weather data.
2. **Register** (`/register`) — Create an account with email/password
3. **Verify Email** (`/verify-email`) — After registration, verify your email via the link sent
4. **Login** (`/login`) — Sign in with email & password
5. **Dashboard** (`/dashboard`) — Protected. View your weather search history

> **Note**: The dashboard requires email verification. Unverified users are redirected to the verification page.

---

## 🎨 Theme Colors

### Dark Mode
- Background: Dark navy/black (`#0f0f1a`, `#1a1a2e`)
- Accents: Purple (`#a855f7`), Pink (`#f472b6`)
- Text: Light purple/white

### Light Mode
- Background: White, light purple (`#ffffff`, `#faf5ff`)
- Accents: Purple (`#7c3aed`), Pink (`#ec4899`)
- Text: Dark gray/purple

---

## 📄 License

This project is for educational purposes."# Weather-Forecast" 
