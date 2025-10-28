# Updated Architecture: Local Deployment

## Deployment Strategy
- **Platforms**: Windows & Mac (cross-platform via Node.js, Java, Docker).
- **Docker?**: Yes—recommended for consistency (avoids OS diffs in env/DB). Use Docker Compose for one-command stack (backend + frontend + DB). Fallback: Native local setup without Docker.

## Local Setup (Without Docker)
### Prerequisites
- Java 17+ (OpenJDK).
- Node.js 18+ (LTS).
- PostgreSQL 13+ installed locally.
- Maven for backend.

### Backend (Spring Boot)
1. Clone repo: `git clone <repo>`.
2. Build: `mvn clean install`.
3. Config: Edit `application.properties` (DB URL: `jdbc:postgresql://localhost:5432/shopdb`).
4. Run: `mvn spring-boot:run`.
- Port: 8080.

### Frontend (React)
1. `cd frontend`.
2. `npm install` (or `yarn`).
3. Config: Update `package.json` proxy to `http://localhost:8080`.
4. Run: `npm start` (or `yarn start`).
- Port: 3000.

### DB
- Create DB: `shopdb` (user: postgres, pass: postgres).
- Run schema: SQL scripts for tables (from earlier proposals).

### Scripts
- Backend: `mvnw` (Maven Wrapper) for Windows/Mac.
- Frontend: `package.json`:
  ```json
  {
    "scripts": {
      "install:all": "npm install",
      "dev": "npm start",
      "build": "npm run build"
    }
  }
  ```
- One-liner: Batch/PowerShell script (`setup.bat` for Win, `setup.sh` for Mac):
  ```
  # setup.sh
  cd backend && mvn clean install && mvn spring-boot:run &
  cd ../frontend && npm install && npm start
  ```

## Docker Setup (Recommended)
- **Why**: Portable, DB included, no local installs needed (just Docker Desktop).
- **Prereqs**: Docker Desktop (Windows/Mac).

### Dockerfiles
#### Backend (Dockerfile in backend/):
```
FROM openjdk:17-jdk-slim
COPY target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

#### Frontend (Dockerfile in frontend/):
```
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=0 /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### docker-compose.yml (Root):
```yaml
version: '3.8'
services:
  db:
    image: postgres:13
    environment:
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: shopdb
    ports:
      - "5432:5432"
    volumes:
      - db-data:/var/lib/postgresql/data

  backend:
    build: ./backend
    ports:
      - "8080:8080"
    depends_on:
      - db
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://db:5432/shopdb

  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend

volumes:
  db-data:
```

### Deployment Script
- `docker-deploy.sh` (Mac/Linux) or `.bat` (Win):
  ```
  # docker-deploy.sh
  docker-compose up --build -d  # Detached mode
  # Or: docker-compose up --build  # Foreground
  ```
- Run: `./docker-deploy.sh`. Access: http://localhost:3000.

## Next Steps
- Test: Backend health at /actuator/health; frontend loads forms.
- Scripts in repo root for easy clone-run.