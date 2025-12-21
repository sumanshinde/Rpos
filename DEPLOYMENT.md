# Deployment Guide: POS System (Django + React)

This guide provides step-by-step instructions for deploying the Point of Sale (POS) system.

## 🏗️ Architecture Overview
- **Backend:** Django REST Framework (Python)
- **Frontend:** React + Vite (JavaScript)
- **Database:** SQLite (Default) or PostgreSQL (Recommended for production)

---

## 🚀 Step 1: Deploying the Backend (Django)

We recommend **Render** or **PythonAnywhere** for Django deployment. **Render** is highly recommended for its support of Blueprints which automates both backend and frontend deployment.

### 1-A: Production Settings
Before deploying, update `pos-backend-django/pos_backend/settings.py`:
1.  **Set Debug to False:** `DEBUG = False`
2.  **Allowed Hosts:** `ALLOWED_HOSTS = ['your-domain.com']`
3.  **Static Files:** Ensure `STATIC_ROOT` is configured:
    ```python
    STATIC_ROOT = BASE_DIR / 'staticfiles'
    ```

### 1-B: PythonAnywhere Steps
1.  **Upload Code:** Upload the `pos-backend-django` folder to PythonAnywhere.
2.  **Virtualenv:** Create a virtualenv and install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
3.  **WSGI Configuration:** Update the WSGI file to point to your project.
4.  **Database:** Run migrations:
    ```bash
    python manage.py migrate
    ```

---

## 🎨 Step 2: Deploying the Frontend (React)

We recommend **Vercel** or **Netlify** for the frontend.

### 2-A: Environment Variables
Create a `.env.production` file in `pos-frontend/`:
```env
VITE_API_URL=https://your-backend-api.com/api
```
Update `src/api/config.js` to use this variable:
```javascript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';
```

### 2-B: Build Process
Run the build command:
```bash
cd pos-frontend
npm run build
```
Upload the contents of the `dist` folder to your hosting provider.

---

## 🔗 Step 3: Connecting Both
1.  Ensure your **CORS settings** in Django allow the frontend domain:
    ```python
    CORS_ALLOWED_ORIGINS = [
        "https://your-frontend-domain.com",
    ]
    ```
2.  Test the connection by creating a dummy order.

---

## � Step 4: Alternative Deployment (Render - Recommended)

Render allows you to deploy both the Backend and Frontend together using the `render.yaml` Blueprint.

### 4-A: Prerequisites
1.  Push your code to **GitHub** or **GitLab**.
2.  Create a free account on [Render](https://render.com/).

### 4-B: Deployment Steps
1.  **Connect Repo:** In Render, click **New +** and select **Blueprint**.
2.  **Select Repo:** Connect your GitHub/GitLab repository.
3.  **Approve Plan:** Render will detect `render.yaml`. Review the plan and click **Apply**.
4.  **Backend Setup:**
    - Render will build the backend using `render_build.sh`.
    - It will run migrations and collect static files automatically.
5.  **Frontend Setup:**
    - Render will build the frontend and serve it as a static site.
6.  **Finalize URLs:**
    - Once the backend is live, copy its URL (e.g., `https://pos-backend.onrender.com`).
    - Update the `VITE_API_URL` in the Render Frontend settings if necessary.
    - Update `ALLOWED_HOSTS` in Django settings if your domain name changes.

---

## �🛠️ Recommended Tools
- **Deployment Platform:** [Render](https://render.com/) (Most automated)
- **Frontend Only:** [Vercel](https://vercel.com/) (Fastest setup)
- **Backend Only:** [PythonAnywhere](https://www.pythonanywhere.com/) (Best for Django beginners)
- **Database:** [Supabase](https://supabase.com/) (Free PostgreSQL) or built-in SQLite (for simple use-cases).
