# Script to run both Backend and Frontend

$root = Get-Location

# 1. Start Backend
Start-Process powershell -ArgumentList "-NoExit", "-Command & {cd '$root\pos-backend-django'; if (Test-Path 'venv\Scripts\Activate.ps1') { . .\venv\Scripts\Activate.ps1 }; Write-Host 'Starting Django Server...'; python manage.py runserver}"

# 2. Start Frontend
Start-Process powershell -ArgumentList "-NoExit", "-Command & {cd '$root\pos-frontend'; Write-Host 'Starting React Frontend...'; npm run dev}"

Write-Host "Launched Backend and Frontend in separate windows."
