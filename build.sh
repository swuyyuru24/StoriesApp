#!/usr/bin/env bash
set -o errexit

# Install Python dependencies
pip install -r requirements.txt

# Build React frontend
cd frontend
npm install
npm run build
cd ..

# Copy React build to Django staticfiles
mkdir -p staticfiles
cp -r frontend/dist/* staticfiles/

# Django setup
python manage.py collectstatic --noinput
python manage.py migrate
python manage.py seed
