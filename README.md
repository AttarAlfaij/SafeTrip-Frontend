# Safe Trip Planner - React + Vite Frontend

The interactive user interface for **Safe Trip Planner**, built with React 18, Vite, and modern CSS.

---

## Features

- **Interactive Trip Planner**: Generate customized travel itineraries based on destination, budget, duration, companions, and mood.
- **My Trips Dashboard**: View, inspect, export (PDF via html2canvas / jsPDF), and delete saved itineraries.
- **Authentication**: JWT-based email/password registration & login with support for Google & GitHub OAuth2 social logins.
- **Internationalization (i18n)**: Multi-language support (English, Hindi, French, Spanish, German, Japanese, Arabic).
- **Responsive UI**: Mobile-first design with modern glassmorphism aesthetic.

---

## Tech Stack

- **React 18**
- **Vite 5**
- **Lucide React** (icons)
- **jsPDF & html2canvas** (itinerary PDF export)
- **DOMPurify** (sanitized rich rendering)

---

## Getting Started

### Prerequisites

- Node.js 18+
- npm or pnpm or yarn

### Installation

```bash
cd frontend
npm install
```

### Local Development

By default, the development server proxies API requests to the local Spring Boot backend at `http://localhost:8080`.

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Environment Configuration

The frontend dynamically detects the backend URL via `VITE_API_BASE_URL`:

- **Local Development**: If `VITE_API_BASE_URL` is omitted, it defaults automatically to `http://localhost:8080`.
- **Production Deployment**: Set the environment variable:
  ```bash
  VITE_API_BASE_URL=https://safetrip-backend-2.onrender.com
  ```

Copy `.env.example` to `.env.local` if you need custom local overrides:
```bash
cp .env.example .env.local
```

### Production Build

```bash
npm run build
```

The compiled output will be generated in the `dist/` directory.

### Deployment on Vercel

The included `vercel.json` automatically configures SPA routing and API reverse-proxy rewrites pointing to `https://safetrip-backend-2.onrender.com`.
