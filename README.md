# NutriTrack

NutriTrack is a nutrition tracking application built with Django REST Framework on the backend and React + Vite on the frontend. It helps users log meals, track nutrient intake, and compare daily nutrition against recommended dietary allowances.

## Features

- User authentication with registration and login
- Meal creation and history tracking
- Food database with nutrient details
- Daily and historical nutrition summaries
- Profile management
- JWT-based API authentication

## Project Structure

- `backend/` - Django backend
  - `accounts/` - authentication, user profile, and JWT endpoints
  - `foods/` - food items and nutrient data
  - `meals/` - meal logging endpoints
  - `nutrition/` - nutrition calculations and recommendations
  - `config/` - Django settings and URL configuration
- `frontend/` - React frontend
  - `src/` - React app source code
  - `api/` - Axios API client and endpoints
  - `components/` - reusable UI pieces
  - `pages/` - application pages

## Prerequisites

- Python 3.12+ (or compatible Python 3.x)
- Node.js 20+ and npm
- Git (optional)

## Backend Setup

1. Create and activate a virtual environment in the project root:

```bash
python -m venv .venv
.venv\Scripts\activate
```

2. Install backend dependencies:

```bash
pip install -r backend/requirements.txt
```

3. Apply migrations:

```bash
cd backend
python manage.py migrate
```

4. Load food and nutrition seed data:

```bash
python manage.py import_foods
python manage.py seed_rda
```

5. Start the backend server:

```bash
python manage.py runserver
```

The backend will run by default at `http://127.0.0.1:8000/`.

## Frontend Setup

1. Install frontend dependencies:

```bash
cd frontend
npm install
```

2. Start the frontend development server:

```bash
npm run dev
```

The frontend runs by default at `http://localhost:5173/`. It uses a relative `/api` base path, so it expects the backend to be available on the same host or proxied correctly.

## Running the App

- Open `http://localhost:5173/` in your browser.
- Register a new account or login.
- Add meals, view history, and monitor nutrition progress.

## Notes

- The backend uses SQLite (`backend/db.sqlite3`) for development.
- Environment variables may be configured using a `.env` file in `backend/` if needed.
- CORS is enabled for `http://localhost:5173` by default.

## Useful Commands

- `cd backend && python manage.py migrate`
- `cd backend && python manage.py import_foods`
- `cd backend && python manage.py seed_rda`
- `cd backend && python manage.py runserver`
- `cd frontend && npm install`
- `cd frontend && npm run dev`

## Future Improvements
- Barcode Food Scanning
- AI-based Meal Recommendations
- Nutrition Goal Planning
- Weekly Analytics Dashboard
- Mobile App Integration
- Cloud Deployment Support

## License

This README does not include a license. Add one if you plan to share or publish the project.
