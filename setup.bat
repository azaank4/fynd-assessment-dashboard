@echo off
REM AI Feedback System - Quick Setup Script for Windows

echo.
echo ==========================================
echo AI Feedback System - Setup
echo ==========================================
echo.

REM Backend Setup
echo Setting up Backend...
cd backend

if not exist "venv" (
    echo Creating virtual environment...
    python -m venv venv
)

echo Activating virtual environment...
call venv\Scripts\activate.bat

echo Installing dependencies...
pip install -r requirements.txt

echo.
echo Creating .env file from template...
if not exist ".env" (
    copy .env.example .env
    echo Please edit backend\.env with your credentials:
    echo  - MONGODB_URI
    echo  - GOOGLE_GEMINI_API_KEY
    echo  - FRONTEND_URL
)

cd ..

REM Frontend Setup
echo.
echo Setting up Frontend...
cd frontend

if not exist "node_modules" (
    echo Installing npm dependencies...
    call npm install
)

echo.
echo Creating .env file from template...
if not exist ".env" (
    copy .env.example .env
    echo Please edit frontend\.env with your API URL
)

cd ..

echo.
echo ==========================================
echo Setup Complete!
echo ==========================================
echo.
echo Next steps:
echo 1. Edit backend\.env with MongoDB and Gemini API credentials
echo 2. Edit frontend\.env with backend API URL
echo 3. Run backend: cd backend ^& python main.py
echo 4. Run frontend (in another terminal): cd frontend ^& npm start
echo.
echo Backend API docs: http://localhost:8000/docs
echo Frontend: http://localhost:3000
echo.
