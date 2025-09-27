# NestJS Microservices Deployment Guide for Azure Student Free Plan

## 🎯 Overview

This guide teaches beginners how to deploy a **NestJS microservice application** built with **Nx** to **Azure Student Free Plan**.

You'll learn the complete DevOps workflow: local development → testing → containerization → CI/CD → production deployment.

---

## 📋 Prerequisites

- Node.js 18+ installed
- Docker Desktop installed and running
- GitHub account
- Azure Student account
- Basic understanding of NestJS and microservices concepts

---

## 🧪 1. Testing (CI Part 1)

### Why Testing Matters in Microservices

In microservices, each service must be independently testable. When you have multiple services communicating, bugs in one service can cascade to others. Automated testing catches issues early.

### Running Tests Locally

**Step 1:** Navigate to your Nx workspace root and run tests for a specific microservice:

```bash
# Run tests for a specific microservice
npx nx test user-service

# Run tests for all microservices
npx nx run-many --target=test --all
```

**Step 2:** Check test coverage to ensure your code is well-tested:

```bash
npx nx test user-service --coverage
```

### GitHub Actions Testing Workflow

**Step 3:** Create `.github/workflows/test.yml` in your repository:

```yaml
name: Run Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
  
      - run: npm ci
      - run: npx nx run-many --target=test --all --parallel
```

**Key Concepts:**

- Tests run automatically on every code push
- Prevents broken code from reaching production
- `nx run-many` efficiently tests all microservices in parallel

---

## 🐳 2. Containerization (CI Part 2)

### Why Docker for Microservices?

Each microservice needs its own environment. Docker ensures your service runs the same way locally, in CI, and in production.

### Creating Dockerfiles

**Step 1:** Create a `Dockerfile` in each microservice directory:

```dockerfile
# apps/user-service/Dockerfile
FROM node:18-alpine
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN npm ci --only=production

# Copy built application
COPY dist/apps/user-service ./
EXPOSE 3000

CMD ["node", "main.js"]
```

**Step 2:** Build and test locally:

```bash
# Build the image
docker build -t user-service -f apps/user-service/Dockerfile .

# Run the container
docker run -p 3000:3000 user-service
```

### Docker Compose for Local Development

**Step 3:** Create `docker-compose.yml` in your project root:

```yaml
version: '3.8'
services:
  user-service:
    build: 
      context: .
      dockerfile: apps/user-service/Dockerfile
    ports:
      - "3001:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
  
  order-service:
    build:
      context: .
      dockerfile: apps/order-service/Dockerfile
    ports:
      - "3002:3000"
    depends_on:
      - user-service
```

**Step 4:** Run all services together:

```bash
docker compose up --build
```

**Key Concepts:**

- Each service has its own container and port
- Services can communicate using service names
- Environment variables pass configuration

---

## ☁️ 3. Azure Setup

### Creating Azure Container Registry (ACR)

**Step 1:** Log into [Azure Portal](https://portal.azure.com)

**Step 2:** Click "Create a resource" → Search "Container Registry"

**Step 3:** Fill out the form:

- **Subscription:** Your student subscription
- **Resource Group:** Create new "microservices-rg"
- **Registry Name:** "yourusername-acr" (must be globally unique)
- **Location:** Choose closest region
- **SKU:** Basic (free tier suitable)

**Step 4:** Click "Review + Create" → "Create"

**Step 5:** Once created, go to the ACR resource → "Access keys" → Enable "Admin user"

**Step 5a:** **IMPORTANT - Save these credentials for GitHub Actions:**
After enabling Admin user, you'll see:

- **Login server:** `yourusername-acr.azurecr.io` (copy this)
- **Username:** Usually same as your ACR name (copy this)
- **Password:** Two passwords shown - copy either one

⚠️ **Write these down immediately** - you'll need them for GitHub Secrets in section 4!

### Creating Azure Container Apps Environment

**Step 6:** In Azure Portal, click "Create a resource" → Search "Container Apps"

**Step 7:** Create Container Apps Environment:

- **Subscription:** Your student subscription
- **Resource Group:** Select "microservices-rg"
- **Environment Name:** "microservices-env"
- **Region:** Same as your ACR

**Step 8:** Click "Review + Create" → "Create"

### Connecting ACR with Container Apps

**Step 9:** In your Container Apps Environment:

- Go to "Settings" → "Container registries"
- Click "Add"
- Select your ACR
- Authentication will use the admin credentials

### Getting Azure Service Principal (for GitHub Actions Deployment)

**Step 10:** You need Azure credentials to allow GitHub Actions to deploy to Azure:

**Method 1 - Using Azure CLI (Recommended):**

```bash
# Install Azure CLI first, then run:
az ad sp create-for-rbac \
  --name "github-actions-sp" \
  --role contributor \
  --scopes /subscriptions/YOUR_SUBSCRIPTION_ID/resourceGroups/microservices-rg \
  --sdk-auth
```

This outputs JSON - **copy the entire JSON output** for `AZURE_CREDENTIALS` secret.

**Method 2 - Using Azure Portal:**

1. Go to "Azure Active Directory" → "App registrations" → "New registration"
2. Name it "github-actions-sp" → Register
3. Go to "Certificates & secrets" → "New client secret" → Copy the secret
4. Go to your Resource Group → "Access control (IAM)" → "Add role assignment"
5. Assign "Contributor" role to your app registration

**Key Concepts:**

- ACR stores your Docker images securely
- Container Apps automatically pulls images from ACR
- Service Principal allows GitHub Actions to deploy to Azure securely
- Both services should be in the same region for better performance

---

## 🚀 4. CI/CD with GitHub Actions

### The Complete Pipeline Strategy

Your CI/CD pipeline will:

1. **CI:** Test → Build → Push images to ACR
2. **CD:** Deploy updated images to Azure Container Apps

### CI Pipeline (Build & Push) ( focus on pushing to acr server)

**Step 1:** Create `.github/workflows/ci-cd.yml`:

```yaml
name: CI/CD Pipeline
on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
  
      # Run tests first
      - uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npx nx run-many --target=test --all
  
      # Build and push Docker images
      - uses: azure/docker-login@v1
        with:
          login-server: ${{ secrets.ACR_LOGIN_SERVER }}
          username: ${{ secrets.ACR_USERNAME }}
          password: ${{ secrets.ACR_PASSWORD }}
  
      - run: |
          docker build -t ${{ secrets.ACR_LOGIN_SERVER }}/user-service:${{ github.sha }} -f apps/user-service/Dockerfile .
          docker push ${{ secrets.ACR_LOGIN_SERVER }}/user-service:${{ github.sha }}
```

### CD Pipeline (Deploy)

**Step 2:** Add deployment stage to the same workflow:

```yaml
      # Deploy to Azure Container Apps
      - uses: azure/login@v1
        with:
          creds: ${{ secrets.AZURE_CREDENTIALS }}
  
      - uses: azure/container-apps-deploy-action@v1
        with:
          containerAppName: user-service-app
          resourceGroup: microservices-rg
          imageToDeploy: ${{ secrets.ACR_LOGIN_SERVER }}/user-service:${{ github.sha }}
```

**Key Concepts:**

- Pipeline runs only on `main` branch pushes
- Tests must pass before building images
- Each commit gets a unique image tag (`github.sha`)
- Failed tests stop the entire pipeline

---

## 🔐 5. Secrets Management

### GitHub Secrets Setup

**Step 1:** In your GitHub repository, go to "Settings" → "Secrets and variables" → "Actions"

**Step 2:** Add these secrets (click "New repository secret"):

| Secret Name           | Where to Find                                              | Purpose                 |
| --------------------- | ---------------------------------------------------------- | ----------------------- |
| `ACR_LOGIN_SERVER`  | Azure ACR → Overview → Login server                      | ACR endpoint            |
| `ACR_USERNAME`      | Azure ACR → Access keys → Username                       | ACR login               |
| `ACR_PASSWORD`      | Azure ACR → Access keys → Password                       | ACR password            |
| `AZURE_CREDENTIALS` | Output from `az ad sp create-for-rbac` command (Step 10) | Azure deployment access |
| `DATABASE_URL`      | Your database provider                                     | Connection string       |

### Using Secrets in Workflows

**Step 3:** Reference secrets in your GitHub Actions:

```yaml
env:
  DATABASE_URL: ${{ secrets.DATABASE_URL }}
  JWT_SECRET: ${{ secrets.JWT_SECRET }}

# Or pass to Docker build
- run: |
    docker build \
      --build-arg DATABASE_URL="${{ secrets.DATABASE_URL }}" \
      -t user-service .
```

### Environment Variables in Azure

**Step 4:** In Azure Container Apps:

- Go to your app → "Configuration" → "Environment variables"
- Add variables like `DATABASE_URL`, `JWT_SECRET`
- These become available to your NestJS application

**Key Concepts:**

- Never hardcode sensitive data in your code
- Secrets flow: GitHub Secrets → Container build → Azure runtime
- Different environments (dev/prod) can have different secret values

---

## 📊 6. Observability (Prometheus + Grafana)

### Why Monitoring Matters

In microservices, you need visibility into each service's health, performance, and errors. Prometheus collects metrics, Grafana visualizes them.

### Setting Up Local Monitoring

**Step 1:** Add Prometheus and Grafana to your `docker-compose.yml`:

```yaml
services:
  # ... your existing services ...
  
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
    command:
      - '--config.file=/etc/prometheus/prometheus.yml'
      - '--web.route-prefix=/'
  
  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
```

**Step 2:** Create `monitoring/prometheus.yml`:

```yaml
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'user-service'
    static_configs:
      - targets: ['user-service:3000']
    metrics_path: '/metrics'
  
  - job_name: 'order-service'
    static_configs:
      - targets: ['order-service:3000']
    metrics_path: '/metrics'
```

### Adding Metrics to NestJS

**Step 3:** Install Prometheus metrics in your NestJS services:

```bash
npm install @prometheus-io/client express-prometheus-middleware
```

**Step 4:** Add metrics endpoint to your main.ts:

```typescript
// In your NestJS main.ts
import { register } from 'prom-client';

app.get('/metrics', (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(register.metrics());
});
```

**Key Concepts:**

- Prometheus "scrapes" metrics from your `/metrics` endpoints
- Grafana creates dashboards from Prometheus data
- Run locally to save Azure credits while learning
- In production, Azure Application Insights could replace this setup

---

## 🔄 7. End-to-End Flow

### Complete Development Workflow

Here's how everything works together:

### Local Development

```bash
# 1. Start all services + monitoring
docker compose up --build

# 2. Your services run on different ports:
# - user-service: http://localhost:3001
# - order-service: http://localhost:3002  
# - Grafana: http://localhost:3000
# - Prometheus: http://localhost:9090
```

### CI/CD Workflow

1. **Developer pushes code** to `main` branch
2. **GitHub Actions triggers**:
   - Runs all Jest tests
   - If tests pass → builds Docker images
   - Pushes images to Azure Container Registry
   - Deploys to Azure Container Apps
3. **Azure automatically updates** running containers
4. **Services are live** at their Azure Container Apps URLs

### Monitoring Flow

- **Local:** Prometheus scrapes metrics from local containers
- **Production:** Services still expose `/metrics` endpoints
- **Grafana dashboards** show service health, request rates, error rates
- **Alerts** can notify you of issues (configure in Grafana)

### Troubleshooting Common Issues

**Tests failing?**

```bash
# Run tests locally first
npx nx test user-service --verbose
```

**Docker build failing?**

```bash
# Test build locally
docker build -t user-service -f apps/user-service/Dockerfile .
```

**Azure deployment failing?**

- Check GitHub Actions logs
- Verify secrets are correctly set
- Ensure ACR has admin user enabled

---
