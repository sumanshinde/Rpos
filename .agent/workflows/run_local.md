---
description: Run the full stack POS application (Django Backend + React Frontend)
---

This workflow will help you start both the backend and frontend servers. You will need **two separate terminal windows**.

# Terminal 1: Start Backend (Django)

1. Navigate to the backend directory:
   ```powershell
   cd pos-backend-django
   ```

2. Activate virtual environment (if you have one), otherwise skip.

3. Run migrations (just to be sure):
   ```powershell
   python manage.py migrate
   ```

4. Start the server:
   ```powershell
   // turbo
   python manage.py runserver
   ```
   *The backend will run at http://127.0.0.1:8000/*

---

# Terminal 2: Start Frontend (React/Vite)

1. Navigate to the frontend directory:
   ```powershell
   cd pos-frontend
   ```

2. Install dependencies (if not already done):
   ```powershell
   npm install
   ```

3. Start the development server:
   ```powershell
   // turbo
   npm run dev
   ```
   *The frontend will typically run at http://localhost:5173/*

---

# Verification
1. Open your browser to the frontend URL (e.g., `http://localhost:5173`).
2. You should see the login page.
3. Since this is a fresh database, you might need to register a new user first (if the registration page is enabled) or create a superuser in the backend terminal:
   ```powershell
   python manage.py createsuperuser
   ```