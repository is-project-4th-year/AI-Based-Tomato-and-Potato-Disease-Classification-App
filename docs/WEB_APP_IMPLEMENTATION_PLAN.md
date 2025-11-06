# Web Application Implementation Plan
## AI-Based Tomato and Potato Disease Classification

**Branch:** `RemoteDesk/web-app`
**Architecture:** Option 1 - Laravel + React + FastAPI Microservice
**Deployment:** Hostinger Shared Hosting (Laravel/React) + Railway/Render (FastAPI)

---

## 📋 Table of Contents

1. [Architecture Overview](#architecture-overview)
2. [Technology Stack](#technology-stack)
3. [System Components](#system-components)
4. [Project Structure](#project-structure)
5. [Implementation Phases](#implementation-phases)
6. [Detailed Task Breakdown](#detailed-task-breakdown)
7. [API Specifications](#api-specifications)
8. [Database Schema](#database-schema)
9. [Deployment Strategy](#deployment-strategy)
10. [Testing Strategy](#testing-strategy)

---

## 🏗️ Architecture Overview

```
┌──────────────────────────────────────────────────────────────────┐
│                    USER BROWSER                                  │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │           React SPA (Vite + TypeScript)                │    │
│  │  • Image upload UI                                     │    │
│  │  • Disease prediction display                          │    │
│  │  • Treatment recommendations                           │    │
│  │  • User dashboard & history                            │    │
│  │  • Analytics & charts                                  │    │
│  └─────────────────────┬──────────────────────────────────┘    │
└────────────────────────┼───────────────────────────────────────┘
                         │ HTTPS (API Calls)
                         │
┌────────────────────────▼───────────────────────────────────────┐
│          HOSTINGER SHARED HOSTING                              │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐    │
│  │         Laravel 11 Backend (PHP 8.2+)                │    │
│  │                                                       │    │
│  │  ┌─────────────────────────────────────────────┐    │    │
│  │  │         API Layer (Sanctum Auth)            │    │    │
│  │  │  • /api/auth/register                       │    │    │
│  │  │  • /api/auth/login                          │    │    │
│  │  │  • /api/predictions                         │    │    │
│  │  │  • /api/predictions/{id}                    │    │    │
│  │  │  • /api/dashboard/stats                     │    │    │
│  │  └─────────────────────────────────────────────┘    │    │
│  │                                                       │    │
│  │  ┌─────────────────────────────────────────────┐    │    │
│  │  │         Business Logic Layer                │    │    │
│  │  │  • User management                          │    │    │
│  │  │  • Image validation & storage               │    │    │
│  │  │  • Prediction orchestration                 │    │    │
│  │  │  • Treatment recommendations                │    │    │
│  │  │  • History & analytics                      │    │    │
│  │  └─────────────────────────────────────────────┘    │    │
│  │                                                       │    │
│  │  ┌─────────────────────────────────────────────┐    │    │
│  │  │         Data Layer (Eloquent ORM)           │    │    │
│  │  │  • Users model                              │    │    │
│  │  │  • Predictions model                        │    │    │
│  │  │  • Images model                             │    │    │
│  │  └─────────────────┬───────────────────────────┘    │    │
│  └────────────────────┼────────────────────────────────┘    │
│                       │                                       │
│  ┌────────────────────▼───────────────────────────────┐      │
│  │              MySQL 8.0 Database                    │      │
│  │  • users                                           │      │
│  │  • predictions                                     │      │
│  │  • images                                          │      │
│  │  • personal_access_tokens (Sanctum)               │      │
│  └────────────────────────────────────────────────────┘      │
│                       │                                       │
└───────────────────────┼───────────────────────────────────────┘
                        │ HTTP POST (image forwarding)
                        │
┌───────────────────────▼────────────────────────────────────────┐
│   FREE CLOUD SERVICE (Railway/Render/Fly.io)                   │
│                                                                │
│  ┌──────────────────────────────────────────────────────┐    │
│  │      FastAPI Python Microservice (Docker)            │    │
│  │                                                       │    │
│  │  ┌─────────────────────────────────────────────┐    │    │
│  │  │         Inference API                       │    │    │
│  │  │  • POST /predict                            │    │    │
│  │  │  • GET /health                              │    │    │
│  │  │  • GET /model-info                          │    │    │
│  │  └─────────────────────────────────────────────┘    │    │
│  │                                                       │    │
│  │  ┌─────────────────────────────────────────────┐    │    │
│  │  │         ML Inference Engine                 │    │    │
│  │  │  • Image preprocessing                      │    │    │
│  │  │  • TensorFlow model loading                 │    │    │
│  │  │  • MobileNetV2 inference                    │    │    │
│  │  │  • Prediction post-processing               │    │    │
│  │  └─────────────────────────────────────────────┘    │    │
│  │                                                       │    │
│  │  ┌─────────────────────────────────────────────┐    │    │
│  │  │         Model Storage                       │    │    │
│  │  │  • MobileNetV2_final.h5 (~25 MB)           │    │    │
│  │  │  • Class labels mapping                     │    │    │
│  │  └─────────────────────────────────────────────┘    │    │
│  └──────────────────────────────────────────────────────┘    │
└────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend (React SPA)
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.2+ | UI library |
| TypeScript | 5.0+ | Type safety |
| Vite | 5.0+ | Build tool & dev server |
| TailwindCSS | 3.4+ | Utility-first CSS |
| shadcn/ui | Latest | Pre-built components |
| React Query (TanStack Query) | 5.0+ | Server state management |
| Axios | 1.6+ | HTTP client |
| React Router v6 | 6.20+ | Client-side routing |
| React Hook Form | 7.48+ | Form management |
| Zod | 3.22+ | Schema validation |
| Recharts | 2.10+ | Data visualization |
| React Dropzone | 14.2+ | File upload |
| date-fns | 3.0+ | Date formatting |

### Backend (Laravel - Hostinger)
| Technology | Version | Purpose |
|-----------|---------|---------|
| Laravel | 11.x | PHP framework |
| PHP | 8.2+ | Programming language |
| Laravel Sanctum | 4.x | API authentication |
| MySQL | 8.0 | Relational database |
| Laravel Storage | - | File management |
| Guzzle HTTP | 7.x | HTTP client (to ML service) |
| Laravel API Resources | - | API response formatting |
| PHPUnit | 10.x | Testing framework |

### ML Microservice (Python - Railway/Render)
| Technology | Version | Purpose |
|-----------|---------|---------|
| FastAPI | 0.104+ | Python web framework |
| Python | 3.10+ | Programming language |
| TensorFlow | 2.13+ | ML inference |
| Pillow (PIL) | 10.0+ | Image processing |
| Pydantic | 2.0+ | Data validation |
| Uvicorn | 0.24+ | ASGI server |
| NumPy | 1.24+ | Numerical operations |
| Docker | Latest | Containerization |

### DevOps & Deployment
| Tool | Purpose |
|------|---------|
| Git | Version control |
| GitHub Actions | CI/CD (optional) |
| Docker | ML service containerization |
| Railway/Render | ML service hosting |
| Hostinger cPanel | Laravel deployment |
| Composer | PHP dependency management |
| npm/yarn | Node.js package management |

---

## 🔧 System Components

### 1. Frontend (React SPA)

**Location:** `/webapp/frontend/`

**Key Features:**
- Responsive design (mobile-first)
- User authentication (login/register)
- Image upload with drag-and-drop
- Real-time prediction display
- Disease information & treatment recommendations
- User dashboard with prediction history
- Analytics charts (predictions over time, disease distribution)
- Profile management

**Pages:**
1. **Landing Page** (`/`) - Public homepage with CTA
2. **Login** (`/login`) - User authentication
3. **Register** (`/register`) - User registration
4. **Dashboard** (`/dashboard`) - Main user dashboard
5. **New Prediction** (`/predict`) - Image upload & prediction
6. **Prediction Details** (`/predictions/:id`) - Individual prediction view
7. **History** (`/history`) - All user predictions
8. **Profile** (`/profile`) - User profile management
9. **About** (`/about`) - Project information
10. **Disease Library** (`/diseases`) - Disease catalog

### 2. Backend (Laravel)

**Location:** `/webapp/backend/`

**Key Modules:**

#### Authentication Module
- User registration with email verification (optional)
- Login with email/password
- Token-based authentication (Sanctum)
- Password reset functionality
- Profile management

#### Prediction Module
- Image upload validation
- Image storage (Laravel Storage)
- Prediction orchestration
  1. Validate image
  2. Store image
  3. Forward to ML service
  4. Store prediction result
  5. Return response
- Prediction history retrieval
- Prediction details retrieval

#### Dashboard Module
- User statistics
  - Total predictions
  - Diseases detected
  - Recent activity
- Analytics data
  - Predictions over time
  - Disease distribution
  - Prediction accuracy trends

#### Treatment Module
- Disease information database
- Treatment recommendations
- Prevention tips
- Related resources

### 3. ML Microservice (FastAPI)

**Location:** `/webapp/ml-service/`

**Key Features:**
- Lightweight FastAPI application
- TensorFlow model loading (singleton pattern)
- Image preprocessing
- Inference endpoint
- Health check endpoint
- Model info endpoint
- Error handling & logging

**API Endpoints:**

1. **POST /predict**
   - Input: Image file (multipart/form-data)
   - Output: Prediction result with confidence scores

2. **GET /health**
   - Output: Service health status

3. **GET /model-info**
   - Output: Model version, classes, metadata

---

## 📁 Project Structure

```
webapp/
│
├── frontend/                      # React SPA
│   ├── public/
│   │   ├── favicon.ico
│   │   └── assets/
│   │
│   ├── src/
│   │   ├── components/           # Reusable components
│   │   │   ├── ui/               # shadcn/ui components
│   │   │   ├── layout/
│   │   │   │   ├── Header.tsx
│   │   │   │   ├── Footer.tsx
│   │   │   │   ├── Sidebar.tsx
│   │   │   │   └── Layout.tsx
│   │   │   ├── auth/
│   │   │   │   ├── LoginForm.tsx
│   │   │   │   ├── RegisterForm.tsx
│   │   │   │   └── ProtectedRoute.tsx
│   │   │   ├── prediction/
│   │   │   │   ├── ImageUpload.tsx
│   │   │   │   ├── PredictionResult.tsx
│   │   │   │   ├── PredictionCard.tsx
│   │   │   │   └── TreatmentInfo.tsx
│   │   │   ├── dashboard/
│   │   │   │   ├── StatsCard.tsx
│   │   │   │   ├── RecentPredictions.tsx
│   │   │   │   ├── AnalyticsChart.tsx
│   │   │   │   └── DiseaseDistribution.tsx
│   │   │   └── common/
│   │   │       ├── LoadingSpinner.tsx
│   │   │       ├── ErrorBoundary.tsx
│   │   │       └── ImagePreview.tsx
│   │   │
│   │   ├── pages/                # Page components
│   │   │   ├── Landing.tsx
│   │   │   ├── Login.tsx
│   │   │   ├── Register.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── Predict.tsx
│   │   │   ├── PredictionDetails.tsx
│   │   │   ├── History.tsx
│   │   │   ├── Profile.tsx
│   │   │   ├── About.tsx
│   │   │   └── DiseaseLibrary.tsx
│   │   │
│   │   ├── hooks/                # Custom React hooks
│   │   │   ├── useAuth.ts
│   │   │   ├── usePrediction.ts
│   │   │   ├── useDashboard.ts
│   │   │   └── useAnalytics.ts
│   │   │
│   │   ├── services/             # API services
│   │   │   ├── api.ts            # Axios instance
│   │   │   ├── authService.ts
│   │   │   ├── predictionService.ts
│   │   │   └── dashboardService.ts
│   │   │
│   │   ├── types/                # TypeScript types
│   │   │   ├── auth.types.ts
│   │   │   ├── prediction.types.ts
│   │   │   └── dashboard.types.ts
│   │   │
│   │   ├── utils/                # Utility functions
│   │   │   ├── formatters.ts
│   │   │   ├── validators.ts
│   │   │   └── constants.ts
│   │   │
│   │   ├── contexts/             # React contexts
│   │   │   └── AuthContext.tsx
│   │   │
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   │
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── .env.example
│
├── backend/                       # Laravel Backend
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/
│   │   │   │   ├── AuthController.php
│   │   │   │   ├── PredictionController.php
│   │   │   │   ├── DashboardController.php
│   │   │   │   └── TreatmentController.php
│   │   │   ├── Requests/
│   │   │   │   ├── LoginRequest.php
│   │   │   │   ├── RegisterRequest.php
│   │   │   │   └── PredictionRequest.php
│   │   │   ├── Resources/
│   │   │   │   ├── UserResource.php
│   │   │   │   ├── PredictionResource.php
│   │   │   │   └── PredictionCollection.php
│   │   │   └── Middleware/
│   │   │       └── EnsureEmailIsVerified.php (optional)
│   │   │
│   │   ├── Models/
│   │   │   ├── User.php
│   │   │   ├── Prediction.php
│   │   │   └── Disease.php
│   │   │
│   │   ├── Services/
│   │   │   ├── PredictionService.php
│   │   │   ├── MLService.php
│   │   │   └── TreatmentService.php
│   │   │
│   │   └── Exceptions/
│   │       └── MLServiceException.php
│   │
│   ├── database/
│   │   ├── migrations/
│   │   │   ├── 2024_01_01_000000_create_users_table.php
│   │   │   ├── 2024_01_02_000000_create_predictions_table.php
│   │   │   └── 2024_01_03_000000_create_diseases_table.php
│   │   ├── seeders/
│   │   │   └── DiseaseSeeder.php
│   │   └── factories/
│   │       └── PredictionFactory.php
│   │
│   ├── routes/
│   │   ├── api.php
│   │   └── web.php
│   │
│   ├── config/
│   │   ├── ml.php               # ML service configuration
│   │   └── sanctum.php
│   │
│   ├── tests/
│   │   ├── Feature/
│   │   │   ├── AuthTest.php
│   │   │   ├── PredictionTest.php
│   │   │   └── DashboardTest.php
│   │   └── Unit/
│   │       ├── PredictionServiceTest.php
│   │       └── MLServiceTest.php
│   │
│   ├── storage/
│   │   └── app/
│   │       └── public/
│   │           └── predictions/   # User uploaded images
│   │
│   ├── .env.example
│   ├── composer.json
│   └── artisan
│
├── ml-service/                    # FastAPI Microservice
│   ├── app/
│   │   ├── main.py               # FastAPI application
│   │   ├── config.py             # Configuration
│   │   ├── models/
│   │   │   └── prediction.py     # Pydantic models
│   │   ├── services/
│   │   │   ├── model_loader.py   # TensorFlow model loader
│   │   │   ├── preprocessor.py   # Image preprocessing
│   │   │   └── predictor.py      # Inference logic
│   │   └── utils/
│   │       ├── logger.py
│   │       └── constants.py
│   │
│   ├── models/                    # Trained models
│   │   ├── MobileNetV2_final.h5
│   │   └── class_labels.json
│   │
│   ├── tests/
│   │   ├── test_main.py
│   │   └── test_predictor.py
│   │
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── .env.example
│   └── railway.json / render.yaml
│
└── docs/
    ├── WEB_APP_IMPLEMENTATION_PLAN.md (this file)
    ├── API_DOCUMENTATION.md
    └── DEPLOYMENT_GUIDE.md
```

---

## 📅 Implementation Phases

### Phase 1: Project Setup & Infrastructure (Week 1)

**Duration:** 5-7 days

**Tasks:**

1. **Frontend Setup**
   - Initialize Vite + React + TypeScript project
   - Configure TailwindCSS and shadcn/ui
   - Set up folder structure
   - Configure React Router
   - Set up Axios instance with interceptors
   - Configure environment variables

2. **Backend Setup**
   - Initialize Laravel 11 project
   - Configure database connection (MySQL)
   - Install and configure Laravel Sanctum
   - Set up API routes structure
   - Configure CORS
   - Set up storage for images
   - Configure environment variables

3. **ML Service Setup**
   - Initialize FastAPI project
   - Set up project structure
   - Configure TensorFlow environment
   - Implement model loader
   - Create Dockerfile
   - Test local inference
   - Configure environment variables

4. **DevOps Setup**
   - Set up Git branching strategy
   - Configure .gitignore files
   - Create Docker Compose for local development (optional)
   - Document setup instructions

**Deliverables:**
- Working development environment for all three components
- Basic "Hello World" endpoints
- Documentation for local setup

---

### Phase 2: Authentication & User Management (Week 2)

**Duration:** 5-7 days

**Tasks:**

1. **Backend - Authentication**
   - Create User model and migration
   - Implement registration endpoint
   - Implement login endpoint
   - Implement logout endpoint
   - Implement password reset (optional)
   - Set up Sanctum token authentication
   - Write authentication tests

2. **Frontend - Authentication**
   - Create login page UI
   - Create registration page UI
   - Implement login form with validation
   - Implement registration form with validation
   - Create authentication context
   - Implement protected routes
   - Add token management
   - Handle authentication errors

3. **Integration**
   - Connect frontend to backend auth endpoints
   - Test login/logout flow
   - Test token refresh
   - Test error handling

**Deliverables:**
- Fully functional authentication system
- Protected routes
- Token-based session management

---

### Phase 3: ML Service Development (Week 3)

**Duration:** 5-7 days

**Tasks:**

1. **Model Integration**
   - Download MobileNetV2 model from Google Drive
   - Implement model loading with caching
   - Create image preprocessing pipeline
   - Implement inference function
   - Add error handling for model operations
   - Create class labels mapping

2. **API Development**
   - Implement POST /predict endpoint
   - Implement GET /health endpoint
   - Implement GET /model-info endpoint
   - Add request validation (Pydantic)
   - Add response formatting
   - Implement error handling
   - Add logging

3. **Testing**
   - Write unit tests for preprocessing
   - Write unit tests for inference
   - Write integration tests for API endpoints
   - Test with sample images
   - Performance testing

4. **Containerization**
   - Create optimized Dockerfile
   - Test Docker build
   - Test local Docker run
   - Optimize image size

**Deliverables:**
- Fully functional ML inference API
- Dockerized application
- API documentation
- Test coverage report

---

### Phase 4: Prediction Module (Week 4)

**Duration:** 5-7 days

**Tasks:**

1. **Backend - Prediction System**
   - Create Prediction model and migration
   - Create Disease model and migration (for treatments)
   - Implement image upload handler
   - Implement image storage
   - Create PredictionService class
   - Create MLService client (Guzzle)
   - Implement prediction orchestration:
     - Validate image
     - Store image
     - Call ML service
     - Store prediction
     - Fetch treatment info
     - Return formatted response
   - Implement prediction retrieval endpoints
   - Add pagination for history
   - Write tests

2. **Frontend - Prediction UI**
   - Create prediction page layout
   - Implement image upload component (drag-and-drop)
   - Add image preview
   - Implement loading states
   - Create prediction result display
   - Add treatment recommendations section
   - Add error handling
   - Create prediction card component for history

3. **Integration**
   - Connect frontend to backend prediction endpoints
   - Test end-to-end prediction flow
   - Test error scenarios
   - Performance optimization

**Deliverables:**
- Fully functional prediction system
- Image upload and storage
- ML inference integration
- Treatment recommendations

---

### Phase 5: Dashboard & Analytics (Week 5)

**Duration:** 5-7 days

**Tasks:**

1. **Backend - Dashboard Data**
   - Implement dashboard statistics endpoint
   - Create analytics queries (Eloquent)
   - Implement history endpoint with filters
   - Add pagination
   - Optimize database queries
   - Write tests

2. **Frontend - Dashboard UI**
   - Create dashboard layout
   - Implement stats cards
   - Create recent predictions list
   - Implement analytics charts (Recharts)
     - Predictions over time (line chart)
     - Disease distribution (pie chart)
     - Monthly trends (bar chart)
   - Add filtering options
   - Add date range selector

3. **Frontend - History Page**
   - Create history page layout
   - Implement prediction list with pagination
   - Add filtering by disease, date
   - Add sorting options
   - Implement search functionality
   - Create prediction details modal

**Deliverables:**
- User dashboard with statistics
- Analytics visualization
- Comprehensive prediction history

---

### Phase 6: Disease Library & Additional Features (Week 6)

**Duration:** 5-7 days

**Tasks:**

1. **Backend - Disease Information**
   - Seed diseases table with information
   - Create treatment retrieval endpoint
   - Add search functionality
   - Write tests

2. **Frontend - Disease Library**
   - Create disease library page
   - Implement disease cards
   - Add disease detail view
   - Add search and filter
   - Create treatment information display

3. **Frontend - Profile Management**
   - Create profile page
   - Implement profile edit form
   - Add password change functionality
   - Add avatar upload (optional)

4. **Additional Features**
   - Implement loading skeletons
   - Add toast notifications
   - Improve error messages
   - Add keyboard shortcuts (optional)
   - Implement dark mode (optional)

**Deliverables:**
- Disease information library
- Profile management
- Enhanced UX features

---

### Phase 7: Testing & Quality Assurance (Week 7)

**Duration:** 5-7 days

**Tasks:**

1. **Backend Testing**
   - Increase test coverage (target: 80%+)
   - Test all API endpoints
   - Test error scenarios
   - Performance testing
   - Security testing

2. **Frontend Testing**
   - Component testing
   - Integration testing
   - E2E testing (Playwright/Cypress - optional)
   - Cross-browser testing
   - Responsive design testing

3. **ML Service Testing**
   - Load testing
   - Stress testing
   - Accuracy validation
   - Error handling testing

4. **Bug Fixes**
   - Fix identified bugs
   - Optimize performance
   - Improve error handling

**Deliverables:**
- Comprehensive test suite
- Bug fixes
- Performance optimizations
- Quality assurance report

---

### Phase 8: Deployment (Week 8)

**Duration:** 5-7 days

**Tasks:**

1. **ML Service Deployment**
   - Create Railway/Render account
   - Configure deployment settings
   - Deploy ML service to Railway/Render
   - Test deployed service
   - Configure custom domain (optional)
   - Set up monitoring

2. **Backend Deployment (Hostinger)**
   - Prepare production build
   - Configure production environment
   - Set up MySQL database
   - Upload files via cPanel/FTP
   - Run migrations
   - Seed database
   - Configure storage permissions
   - Set up SSL certificate
   - Configure domain

3. **Frontend Deployment (Hostinger)**
   - Build production bundle
   - Upload to Hostinger
   - Configure environment variables
   - Test deployment
   - Configure routing (SPA support)

4. **Integration Testing**
   - Test all features in production
   - Test performance
   - Monitor errors
   - Fix deployment issues

5. **Documentation**
   - Write deployment documentation
   - Create user guide
   - Create admin guide
   - Document API endpoints

**Deliverables:**
- Fully deployed web application
- Deployment documentation
- User and admin guides

---

## ✅ Detailed Task Breakdown

### Phase 1 Tasks

#### 1.1 Frontend Setup

```bash
# Initialize project
npm create vite@latest frontend -- --template react-ts
cd frontend
npm install

# Install dependencies
npm install react-router-dom @tanstack/react-query axios
npm install react-hook-form zod @hookform/resolvers
npm install recharts date-fns react-dropzone
npm install -D tailwindcss postcss autoprefixer
npm install -D @types/node

# Initialize TailwindCSS
npx tailwindcss init -p

# Install shadcn/ui
npx shadcn-ui@latest init

# Add shadcn/ui components
npx shadcn-ui@latest add button
npx shadcn-ui@latest add card
npx shadcn-ui@latest add input
npx shadcn-ui@latest add form
npx shadcn-ui@latest add table
npx shadcn-ui@latest add dialog
npx shadcn-ui@latest add dropdown-menu
npx shadcn-ui@latest add toast
```

**Files to create:**
- `src/services/api.ts` - Axios instance configuration
- `src/types/*.types.ts` - TypeScript type definitions
- `src/contexts/AuthContext.tsx` - Authentication context
- `.env.example` - Environment variable template

#### 1.2 Backend Setup

```bash
# Create Laravel project
composer create-project laravel/laravel backend
cd backend

# Install Sanctum
php artisan install:api

# Install additional packages
composer require guzzlehttp/guzzle

# Create directories
mkdir -p app/Services
mkdir -p app/Exceptions

# Generate key
php artisan key:generate
```

**Files to create:**
- `config/ml.php` - ML service configuration
- `.env.example` - Environment variable template
- `routes/api.php` - API routes

**Migrations to create:**
```bash
php artisan make:migration create_predictions_table
php artisan make:migration create_diseases_table
```

#### 1.3 ML Service Setup

```bash
# Create project directory
mkdir ml-service
cd ml-service

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install fastapi uvicorn tensorflow pillow pydantic python-multipart

# Create requirements.txt
pip freeze > requirements.txt
```

**Files to create:**
- `app/main.py` - FastAPI application
- `app/config.py` - Configuration
- `app/services/model_loader.py` - Model loader
- `app/services/predictor.py` - Inference logic
- `Dockerfile` - Docker configuration
- `.env.example` - Environment variable template

---

## 🔌 API Specifications

### Laravel Backend API

**Base URL:** `https://yourdomain.com/api`

#### Authentication Endpoints

##### 1. Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}

Response: 201 Created
{
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00.000000Z"
  },
  "token": "1|abc123...",
  "message": "Registration successful"
}
```

##### 2. Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}

Response: 200 OK
{
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "1|abc123...",
  "message": "Login successful"
}
```

##### 3. Logout
```http
POST /api/auth/logout
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "Logout successful"
}
```

##### 4. Get Current User
```http
GET /api/auth/user
Authorization: Bearer {token}

Response: 200 OK
{
  "data": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

#### Prediction Endpoints

##### 5. Create Prediction
```http
POST /api/predictions
Authorization: Bearer {token}
Content-Type: multipart/form-data

image: [file]
plant_type: "tomato" | "potato" (optional)

Response: 201 Created
{
  "data": {
    "id": 1,
    "user_id": 1,
    "image_path": "predictions/abc123.jpg",
    "predicted_class": "Tomato___Late_blight",
    "confidence": 0.9823,
    "plant_type": "tomato",
    "disease_info": {
      "name": "Late Blight",
      "description": "...",
      "treatment": "...",
      "prevention": "..."
    },
    "created_at": "2024-01-01T00:00:00.000000Z"
  },
  "message": "Prediction completed successfully"
}
```

##### 6. Get All Predictions
```http
GET /api/predictions?page=1&per_page=10&disease=tomato&sort=desc
Authorization: Bearer {token}

Response: 200 OK
{
  "data": [
    {
      "id": 1,
      "image_path": "predictions/abc123.jpg",
      "predicted_class": "Tomato___Late_blight",
      "confidence": 0.9823,
      "created_at": "2024-01-01T00:00:00.000000Z"
    }
  ],
  "meta": {
    "current_page": 1,
    "last_page": 5,
    "per_page": 10,
    "total": 50
  }
}
```

##### 7. Get Prediction Details
```http
GET /api/predictions/{id}
Authorization: Bearer {token}

Response: 200 OK
{
  "data": {
    "id": 1,
    "user_id": 1,
    "image_path": "predictions/abc123.jpg",
    "predicted_class": "Tomato___Late_blight",
    "confidence": 0.9823,
    "disease_info": { ... },
    "created_at": "2024-01-01T00:00:00.000000Z"
  }
}
```

##### 8. Delete Prediction
```http
DELETE /api/predictions/{id}
Authorization: Bearer {token}

Response: 200 OK
{
  "message": "Prediction deleted successfully"
}
```

#### Dashboard Endpoints

##### 9. Get Dashboard Statistics
```http
GET /api/dashboard/stats
Authorization: Bearer {token}

Response: 200 OK
{
  "data": {
    "total_predictions": 150,
    "diseases_detected": 8,
    "most_common_disease": "Tomato___Late_blight",
    "recent_predictions": 5,
    "accuracy_rate": 0.94
  }
}
```

##### 10. Get Analytics Data
```http
GET /api/dashboard/analytics?period=30days
Authorization: Bearer {token}

Response: 200 OK
{
  "data": {
    "predictions_over_time": [
      { "date": "2024-01-01", "count": 5 },
      { "date": "2024-01-02", "count": 8 }
    ],
    "disease_distribution": [
      { "disease": "Tomato___Late_blight", "count": 45 },
      { "disease": "Potato___Early_blight", "count": 32 }
    ]
  }
}
```

#### Disease Endpoints

##### 11. Get All Diseases
```http
GET /api/diseases?search=blight
Authorization: Bearer {token}

Response: 200 OK
{
  "data": [
    {
      "id": 1,
      "name": "Late Blight",
      "scientific_name": "Phytophthora infestans",
      "plant_type": "tomato",
      "description": "...",
      "symptoms": "...",
      "treatment": "...",
      "prevention": "..."
    }
  ]
}
```

##### 12. Get Disease Details
```http
GET /api/diseases/{id}
Authorization: Bearer {token}

Response: 200 OK
{
  "data": {
    "id": 1,
    "name": "Late Blight",
    "description": "...",
    "symptoms": "...",
    "treatment": "...",
    "prevention": "..."
  }
}
```

---

### FastAPI ML Service API

**Base URL:** `https://your-ml-service.railway.app`

#### ML Endpoints

##### 1. Predict
```http
POST /predict
Content-Type: multipart/form-data

file: [image file]

Response: 200 OK
{
  "predicted_class": "Tomato___Late_blight",
  "confidence": 0.9823,
  "all_predictions": [
    { "class": "Tomato___Late_blight", "confidence": 0.9823 },
    { "class": "Tomato___Healthy", "confidence": 0.0122 },
    { "class": "Tomato___Early_blight", "confidence": 0.0055 }
  ],
  "inference_time": 0.234
}
```

##### 2. Health Check
```http
GET /health

Response: 200 OK
{
  "status": "healthy",
  "model_loaded": true,
  "version": "1.0.0"
}
```

##### 3. Model Info
```http
GET /model-info

Response: 200 OK
{
  "model_name": "MobileNetV2",
  "model_version": "final_20251027",
  "num_classes": 10,
  "classes": [
    "Tomato___Late_blight",
    "Tomato___Healthy",
    ...
  ],
  "input_shape": [224, 224, 3]
}
```

---

## 🗄️ Database Schema

### Users Table
```sql
CREATE TABLE users (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    remember_token VARCHAR(100) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL
);
```

### Predictions Table
```sql
CREATE TABLE predictions (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT UNSIGNED NOT NULL,
    image_path VARCHAR(255) NOT NULL,
    predicted_class VARCHAR(255) NOT NULL,
    confidence DECIMAL(5, 4) NOT NULL,
    plant_type ENUM('tomato', 'potato') NOT NULL,
    disease_id BIGINT UNSIGNED NULL,
    all_predictions JSON NULL,
    inference_time DECIMAL(8, 3) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (disease_id) REFERENCES diseases(id) ON DELETE SET NULL,
    INDEX idx_user_id (user_id),
    INDEX idx_created_at (created_at)
);
```

### Diseases Table
```sql
CREATE TABLE diseases (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    scientific_name VARCHAR(255) NULL,
    plant_type ENUM('tomato', 'potato') NOT NULL,
    description TEXT NOT NULL,
    symptoms TEXT NOT NULL,
    treatment TEXT NOT NULL,
    prevention TEXT NOT NULL,
    severity ENUM('low', 'medium', 'high') DEFAULT 'medium',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    INDEX idx_plant_type (plant_type),
    INDEX idx_name (name)
);
```

### Personal Access Tokens Table (Sanctum)
```sql
CREATE TABLE personal_access_tokens (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    abilities TEXT NULL,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,

    INDEX idx_tokenable (tokenable_type, tokenable_id)
);
```

---

## 🚀 Deployment Strategy

### ML Service Deployment (Railway)

**Platform:** Railway (Recommended) or Render

**Steps:**

1. **Prepare Docker Image**
   ```dockerfile
   FROM python:3.10-slim

   WORKDIR /app

   # Install system dependencies
   RUN apt-get update && apt-get install -y \
       libgomp1 \
       && rm -rf /var/lib/apt/lists/*

   # Copy requirements
   COPY requirements.txt .
   RUN pip install --no-cache-dir -r requirements.txt

   # Copy application
   COPY app/ app/
   COPY models/ models/

   # Expose port
   EXPOSE 8000

   # Run application
   CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
   ```

2. **Deploy to Railway**
   - Connect GitHub repository
   - Add environment variables
   - Deploy from main branch
   - Configure custom domain (optional)

3. **Environment Variables**
   ```
   MODEL_PATH=/app/models/MobileNetV2_final.h5
   CLASS_LABELS_PATH=/app/models/class_labels.json
   MAX_IMAGE_SIZE=10485760
   ALLOWED_EXTENSIONS=jpg,jpeg,png
   ```

### Backend Deployment (Hostinger)

**Platform:** Hostinger Shared Hosting

**Steps:**

1. **Prepare Production Build**
   ```bash
   composer install --optimize-autoloader --no-dev
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

2. **Upload Files**
   - Upload via cPanel File Manager or FTP
   - Place Laravel files in `/public_html/api/` or similar
   - Ensure public folder is accessible

3. **Configure Database**
   - Create MySQL database via cPanel
   - Update `.env` with database credentials
   - Run migrations: `php artisan migrate --force`
   - Seed data: `php artisan db:seed --force`

4. **Configure Storage**
   ```bash
   php artisan storage:link
   chmod -R 775 storage
   chmod -R 775 bootstrap/cache
   ```

5. **Environment Variables**
   ```
   APP_ENV=production
   APP_DEBUG=false
   APP_URL=https://yourdomain.com

   DB_CONNECTION=mysql
   DB_HOST=localhost
   DB_PORT=3306
   DB_DATABASE=your_database
   DB_USERNAME=your_username
   DB_PASSWORD=your_password

   ML_SERVICE_URL=https://your-ml-service.railway.app
   ML_SERVICE_TIMEOUT=30

   SANCTUM_STATEFUL_DOMAINS=yourdomain.com
   SESSION_DOMAIN=.yourdomain.com
   ```

### Frontend Deployment (Hostinger)

**Platform:** Hostinger Shared Hosting

**Steps:**

1. **Build Production Bundle**
   ```bash
   npm run build
   ```

2. **Configure Environment**
   Create `.env.production`:
   ```
   VITE_API_BASE_URL=https://yourdomain.com/api
   ```

3. **Upload Build**
   - Upload `dist/` contents to `/public_html/`
   - Configure `.htaccess` for SPA routing:

   ```apache
   <IfModule mod_rewrite.c>
     RewriteEngine On
     RewriteBase /
     RewriteRule ^index\.html$ - [L]
     RewriteCond %{REQUEST_FILENAME} !-f
     RewriteCond %{REQUEST_FILENAME} !-d
     RewriteRule . /index.html [L]
   </IfModule>
   ```

---

## 🧪 Testing Strategy

### Backend Testing (Laravel)

**Framework:** PHPUnit

**Test Types:**
1. **Unit Tests** - Test individual classes and methods
2. **Feature Tests** - Test API endpoints
3. **Integration Tests** - Test service integrations

**Coverage Goal:** 80%+

**Example Test:**
```php
public function test_user_can_create_prediction()
{
    $user = User::factory()->create();
    $file = UploadedFile::fake()->image('tomato.jpg');

    $response = $this->actingAs($user)
        ->postJson('/api/predictions', [
            'image' => $file,
            'plant_type' => 'tomato'
        ]);

    $response->assertStatus(201)
        ->assertJsonStructure([
            'data' => ['id', 'predicted_class', 'confidence']
        ]);
}
```

### Frontend Testing (React)

**Framework:** Vitest + React Testing Library

**Test Types:**
1. **Component Tests** - Test individual components
2. **Integration Tests** - Test component interactions
3. **E2E Tests** - Test user flows (optional - Playwright)

**Coverage Goal:** 70%+

### ML Service Testing (FastAPI)

**Framework:** pytest

**Test Types:**
1. **Unit Tests** - Test preprocessing and inference
2. **API Tests** - Test endpoints
3. **Load Tests** - Test performance

**Example Test:**
```python
def test_predict_endpoint():
    with open("test_image.jpg", "rb") as f:
        response = client.post(
            "/predict",
            files={"file": ("test.jpg", f, "image/jpeg")}
        )

    assert response.status_code == 200
    assert "predicted_class" in response.json()
    assert "confidence" in response.json()
```

---

## 📊 Success Metrics

### Performance Metrics
- Page load time: < 3 seconds
- API response time: < 500ms (excluding ML inference)
- ML inference time: < 2 seconds
- Uptime: > 99.5%

### Quality Metrics
- Test coverage: > 80% (backend), > 70% (frontend)
- Zero critical security vulnerabilities
- Lighthouse score: > 90

### User Experience
- Mobile responsiveness: All devices
- Accessibility: WCAG 2.1 AA compliance
- Browser support: Chrome, Firefox, Safari, Edge (latest 2 versions)

---

## 🔐 Security Considerations

1. **Authentication**
   - Secure password hashing (bcrypt)
   - Token-based authentication (Sanctum)
   - Rate limiting on login attempts
   - HTTPS only

2. **File Upload**
   - File type validation
   - File size limits (max 10MB)
   - Malware scanning (optional)
   - Secure storage

3. **API Security**
   - CORS configuration
   - CSRF protection
   - Input validation
   - SQL injection prevention (Eloquent ORM)
   - XSS prevention

4. **Data Privacy**
   - User data encryption
   - GDPR compliance (optional)
   - Data retention policies

---

## 📝 Next Steps

1. **Review this implementation plan**
2. **Set up development environment** (Phase 1)
3. **Begin Phase 2** (Authentication)
4. **Regular progress updates**
5. **Iterate based on feedback**

---

## 🤝 Team Collaboration

- **Code Reviews:** Required for all PRs
- **Branch Naming:** `RemoteDesk/feature-name`
- **Commit Messages:** Conventional Commits format
- **Documentation:** Update as you build

---

## 📚 Resources

- [Laravel 11 Documentation](https://laravel.com/docs/11.x)
- [React Documentation](https://react.dev)
- [FastAPI Documentation](https://fastapi.tiangolo.com)
- [TensorFlow Documentation](https://www.tensorflow.org/api_docs/python/tf)
- [Railway Documentation](https://docs.railway.app)
- [Hostinger Knowledge Base](https://support.hostinger.com)

---

**Last Updated:** 2025-11-06
**Version:** 1.0
**Status:** Ready for Implementation
