#!/bin/bash
# AI Feedback System - Quick Setup Script for macOS/Linux

echo ""
echo "=========================================="
echo "AI Feedback System - Setup"
echo "=========================================="
echo ""

# Backend Setup
echo "Setting up Backend..."
cd backend

if [ ! -d "venv" ]; then
    echo "Creating virtual environment..."
    python3 -m venv venv
fi

echo "Activating virtual environment..."
source venv/bin/activate

echo "Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "Creating .env file from template..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "Please edit backend/.env with your credentials:"
    echo " - MONGODB_URI"
    echo " - GOOGLE_GEMINI_API_KEY"
    echo " - FRONTEND_URL"
fi

cd ..

# Frontend Setup
echo ""
echo "Setting up Frontend..."
cd frontend

if [ ! -d "node_modules" ]; then
    echo "Installing npm dependencies..."
    npm install
fi

echo ""
echo "Creating .env file from template..."
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo "Please edit frontend/.env with your API URL"
fi

cd ..

echo ""
echo "=========================================="
echo "Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Edit backend/.env with MongoDB and Gemini API credentials"
echo "2. Edit frontend/.env with backend API URL"
echo "3. Run backend: cd backend && python main.py"
echo "4. Run frontend (in another terminal): cd frontend && npm start"
echo ""
echo "Backend API docs: http://localhost:8000/docs"
echo "Frontend: http://localhost:3000"
echo ""
