# 🕎 ניצני חנוכה — רישום מתנדבים ללביבות

A volunteer registration app for a Hanukkah levivot (latkes) event, built with React and Firebase.

> **Live App:** [nizanimhanuka.web.app](https://nizanimhanuka.web.app)

## ✨ Features

### Registration Form
- Full name and phone number registration
- Flexible phone validation — supports dashes, spaces, +972 format
- Optional levivot details: name and type (vegan / vegetarian / dairy)
- Options to volunteer for serving and bringing a warming tray
- Inline field-level error messages
- Animated conditional form fields
- RTL (Hebrew) layout

### Admin Dashboard (`/admin`)
- View all registered volunteers in a table
- Summary stats — total volunteers, levivot, servers, warming trays
- Export to Google Sheets (copy to clipboard + open new sheet)
- Export to CSV (UTF-8 with BOM for Hebrew support)
- Delete volunteers with styled confirmation modal
- Mobile-responsive card layout
- Refresh data on demand

### Thank You Page
- Hanukkah-themed confirmation with menorah decorations
- One-click return to home

## 🛠️ Tech Stack

| Technology | Purpose |
|-----------|---------|
| **React 18** | UI framework |
| **Vite** | Build tool and dev server |
| **Firebase Firestore** | Database |
| **Firebase Hosting** | Deployment |
| **React Router v6** | Client-side routing |
| **React Icons** | Icon library |

## 📁 Project Structure

```
soup_nizani_app/
├── public/
│   └── background.jpg          # Background image
├── src/
│   ├── components/
│   │   ├── AdminDashboard.jsx  # Admin panel with table & exports
│   │   ├── RegistrationForm.jsx # Volunteer registration form
│   │   └── ThankYou.jsx        # Post-registration confirmation
│   ├── App.jsx                 # Routes + Error Boundary + 404
│   ├── firebase.js             # Firebase configuration
│   ├── index.css               # Global styles & responsive design
│   └── main.jsx                # React entry point
├── firebase.json               # Firebase hosting config
├── firestore.rules             # Firestore security rules
├── vite.config.js              # Vite configuration
└── package.json
```

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18+)
- A Firebase project with Firestore enabled

### Installation

```bash
# Clone the repo
git clone https://github.com/atg2212/soup_nizani_app.git
cd soup_nizani_app

# Install dependencies
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build & Deploy

```bash
# Build for production
npm run build

# Login to Firebase (one-time)
npx firebase login

# Deploy to Firebase Hosting
npx firebase deploy --project nizanimhanuka
```

## 📱 Pages

| Route | Description |
|-------|-------------|
| `/` | Registration form |
| `/thank-you` | Confirmation page after registration |
| `/admin` | Admin dashboard — view, export, delete volunteers |
| `/*` | 404 — page not found |

## 🎨 Design

- **RTL Hebrew** layout throughout
- **Heebo & Rubik** Google Fonts
- Warm color palette: deep blue, beige, sun orange, grass green
- Background image with frosted glass card overlays
- Mobile-first responsive design
- Accessible: focus-visible styles, aria labels, screen reader support

## 📄 License

This project is for community use. Feel free to fork and adapt for your own events!
