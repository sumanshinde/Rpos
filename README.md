# POS System

## Quick Start
1. **Run the Project Script:**
   ```powershell
   .\run_project.ps1
   ```
   This will open two new windows for Backend and Frontend.

---

## Detailed Setup & Run Instructions

### 1. Backend (Django)
**Location:** `pos-backend-django/`

**First Time Setup:**
```powershell
cd pos-backend-django
python -m venv venv
.\venv\Scripts\Activate
pip install -r requirements.txt
python manage.py migrate
```

**Run Server:**
```powershell
cd pos-backend-django
# Activate venv if not active
python manage.py runserver
```
- **API Root:** [http://127.0.0.1:8000/api/](http://127.0.0.1:8000/api/)

### 2. Frontend (React + Vite)
**Location:** `pos-frontend/`

**First Time Setup:**
```powershell
cd pos-frontend
npm install
```

**Run Development Server:**
```powershell
cd pos-frontend
npm run dev
```

### 3. Backend (Node.js - Legacy)
- **Location:** `pos-backend/`
- **How to run:**
  ```powershell
  cd pos-backend
  node server.js
  ```
