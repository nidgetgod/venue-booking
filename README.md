# Venue Booking System

A venue booking management system built with Next.js, React, and PostgreSQL.

## Features

- ✅ Venue booking management (single/recurring bookings)
- ✅ Calendar-based time slot selection
- ✅ PostgreSQL database storage
- ✅ PWA support (offline installation)
- ✅ Responsive design
- ✅ Real-time booking status
- 🐳 Docker and Kubernetes deployment ready
- ☸️ Helm chart included for easy deployment

## Technology Stack

- **Framework**: Next.js 16.0.3
- **Runtime**: Node.js (LTS)
- **Database**: PostgreSQL 16
- **Styling**: Tailwind CSS 4
- **Testing**: Jest + React Testing Library
- **Container**: Docker with multi-stage builds
- **Orchestration**: Kubernetes with Helm charts
- **Database Operator**: CloudNativePG

## Requirements

- Node.js >= 20.9.0
- PostgreSQL >= 12
- npm or yarn
- Docker (for containerized deployment)
- Kubernetes cluster (for production deployment)
- Helm 3.x (for Kubernetes deployment)

## Installation

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Database

Create PostgreSQL database:

```bash
createdb venue_booking
```

Run database schema:

```bash
psql -d venue_booking -f database/schema.sql
```

### 3. Configure Environment Variables

Copy example file and fill in database connection information:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL=postgresql://username:password@localhost:5432/venue_booking
```

### 4. Start Development Server

```bash
npm run dev
```

Open browser and visit: http://localhost:3000

## Testing

### Run Unit Tests

```bash
npm test
```

### Run Tests with Coverage Report

```bash
npm run test:coverage
```

### Run Specific Test File

```bash
npm test src/components/__tests__/BookingForm.test.tsx
```

### Test Coverage

Project includes 23 test suites, 135 test cases with 82.78% coverage:

- **Components**: 81.59% coverage
- **Hooks**: 76.66% coverage  
- **Utils**: 100% coverage
- **API Routes**: Full test coverage

Test coverage includes:
- ✅ React component rendering and interactions
- ✅ Custom Hooks logic
- ✅ API route handling
- ✅ Utility functions
- ✅ Form validation
- ✅ Date and time handling

## Docker Deployment

### Local Development with Docker Compose

```bash
# Start all services (app + PostgreSQL)
docker-compose up

# Build and start in detached mode
docker-compose up -d --build

# Stop services
docker-compose down
```

### Build Docker Image

```bash
# Build image
make build

# Or manually
docker build -t venue-booking:1.0.0 .
```

### Run Container Locally

```bash
# Using Makefile
make run

# Or manually
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://user:pass@host:5432/venue_booking" \
  venue-booking:1.0.0
```

## Kubernetes Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

### Quick Start

```bash
# Add Helm repository
helm repo add venue-booking https://nidgetgod.github.io/venue-booking/
helm repo update

# Install with Helm
helm install venue-booking venue-booking/venue-booking \
  --namespace venue-booking \
  --create-namespace

# Or install from local directory
helm install venue-booking ./helm/venue-booking \
  --namespace venue-booking \
  --create-namespace

# Check deployment status
make k8s-status

# View logs
make k8s-logs
```

### Available Make Commands

```bash
make help                 # Show all available commands
make build               # Build Docker image
make push                # Push image to registry
make deploy              # Full deployment (build, push, upgrade)
make helm-install        # Install Helm chart
make helm-upgrade        # Upgrade Helm release
make k8s-status          # Check Kubernetes resources
make k8s-logs            # View application logs
```

## Database Schema

```sql
CREATE TABLE bookings (
  id SERIAL PRIMARY KEY,
  date DATE NOT NULL,
  time VARCHAR(20) NOT NULL,
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  people_count INTEGER NOT NULL,
  is_recurring BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(date, time)
);
```

## Project Structure

```
venue-booking/
├── src/
│   ├── app/              # Next.js app directory
│   │   ├── api/          # API routes
│   │   └── ...
│   ├── components/       # React components
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Libraries and utilities
│   └── utils/            # Utility functions
├── helm/                 # Helm charts
│   └── venue-booking/
├── database/             # Database schemas
├── .github/              # GitHub Actions workflows
├── Dockerfile            # Multi-stage Docker build
├── docker-compose.yml    # Local development setup
├── Makefile              # Convenient commands
└── DEPLOYMENT.md         # Detailed deployment guide
```

## CI/CD

The project includes GitHub Actions workflow for automated builds:

- Automatically builds and pushes Docker images on push to `main`/`develop`
- Creates tagged images for version releases
- Supports multi-platform builds (amd64/arm64)
- Integrates with GitHub Container Registry

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT

