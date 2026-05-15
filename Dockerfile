FROM node:20-slim AS frontend-build

WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

FROM python:3.11-slim

WORKDIR /app

RUN apt-get update && apt-get install -y --no-install-recommends \
    libjpeg-dev zlib1g-dev && \
    rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY manage.py .
COPY backend/ backend/
COPY accounts/ accounts/
COPY stories/ stories/

# Copy React build — index.html goes to templates, assets go to staticfiles
COPY --from=frontend-build /frontend/dist/index.html react_build/index.html
COPY --from=frontend-build /frontend/dist/assets/ staticfiles/assets/

RUN python manage.py collectstatic --noinput

EXPOSE 8080

CMD ["sh", "-c", "python manage.py migrate && python manage.py seed && gunicorn backend.wsgi:application --bind 0.0.0.0:8080 --workers 3"]
