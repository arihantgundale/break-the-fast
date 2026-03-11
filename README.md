# 🍛 Break The Fast — Authentic Indian Cuisine Online Ordering Platform

> A full-stack web application for a US-based 100% Pure Vegetarian Indian restaurant, transitioning from manual phone/callback ordering to a modern digital self-service pickup ordering system.

![Java](https://img.shields.io/badge/Java-17+-orange?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.3-green?logo=springboot)
![React](https://img.shields.io/badge/React-18-blue?logo=react)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-38bdf8?logo=tailwindcss)
![License](https://img.shields.io/badge/License-MIT-yellow)

---

## 📑 Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Tech Stack](#tech-stack)
4. [Architecture](#architecture)
5. [Project Structure](#project-structure)
6. [Prerequisites](#prerequisites)
7. [Getting Started](#getting-started)
   - [Clone the Repository](#1-clone-the-repository)
   - [Backend Setup](#2-backend-setup)
   - [Frontend Setup](#3-frontend-setup)
8. [Running the Application](#running-the-application)
9. [Environment Variables](#environment-variables)
10. [API Reference](#api-reference)
11. [Database](#database)
12. [Default Credentials](#default-credentials)
13. [Design System](#design-system)
14. [Production Deployment](#production-deployment)
15. [Troubleshooting](#troubleshooting)

---

## Overview

**Break The Fast** is a pickup-only online ordering platform for an Indian vegetarian restaurant. It replaces the traditional phone/callback ordering workflow with a streamlined digital experience:

- **Customers** browse the menu, build a cart, and place pickup orders via phone OTP authentication.
- **Admins** manage incoming orders in real-time, update statuses, toggle menu availability, and enter phone-based orders through a quick-entry interface.
- **Notifications** are sent automatically at 4 phases (Received → Preparing → Ready → Completed) via WhatsApp and Email with a 3× retry mechanism.

---

## Features

### Customer-Facing
| Feature | Description |
|---------|-------------|
| 🍽️ Browse Menu | 6 categories: South Indian, North Indian, Beverages, Snacks & Chaats, Sweets, Combo Meals |
| 🔍 Search | Real-time menu search by name, description, or tag |
| 🛒 Cart | Add/remove items, adjust quantities, persistent via localStorage |
| 📱 OTP Login | Phone-based authentication via Twilio SMS (US E.164 format: `+1XXXXXXXXXX`) |
| 📝 Place Order | Review cart, add special instructions, pay-at-pickup |
| 📊 Dashboard | View order history with pagination |
| 🔔 Notifications | 4-phase order updates via WhatsApp + Email |
| 👤 Profile | Manage name, email, notification preferences |
| 🎉 Catering | Event platter catalog with inquiry form |

### Admin-Facing
| Feature | Description |
|---------|-------------|
| 📋 Order Queue | Live order dashboard with status summary bar |
| 🔄 Status Management | Advance orders: Received → Preparing → Ready → Completed |
| ❌ Cancel Orders | Cancel with reason, triggers customer notification |
| 📞 Quick Entry | Enter phone/walk-in orders on behalf of customers |
| 🍛 Menu Management | Toggle item availability (in-stock / out-of-stock) |
| 📡 Real-Time Updates | WebSocket (STOMP/SockJS) live order feed |
| 🔁 Resend Notifications | Re-trigger any order notification manually |

---

## Tech Stack

### Backend
| Technology | Version | Purpose |
|-----------|---------|---------|
| Java | 17+ | Language runtime |
| Spring Boot | 3.2.3 | Application framework |
| Spring Security | 6.x | Authentication & authorization |
| Spring Data JPA | 3.x | ORM / database access |
| Spring WebSocket | 3.x | Real-time STOMP messaging |
| H2 Database | 2.x | In-memory dev database |
| MySQL | 8.x | Production database |
| JWT (jjwt) | 0.12.5 | Token-based authentication |
| Twilio SDK | 10.1.0 | SMS + WhatsApp notifications |
| SendGrid SDK | 4.10.2 | Transactional email |
| Lombok | 1.18.38 | Boilerplate reduction |
| Maven | 3.9+ | Build tool (wrapper included) |

### Frontend
| Technology | Version | Purpose |
|-----------|---------|---------|
| React | 18.3 | UI library |
| Vite | 5.2 | Build tool & dev server |
| Tailwind CSS | 3.4 | Utility-first CSS framework |
| React Router | 6.22 | Client-side routing |
| Axios | 1.6 | HTTP client |
| STOMP.js | 7.0 | WebSocket client |
| SockJS | 1.6 | WebSocket fallback |
| react-hot-toast | 2.4 | Toast notifications |
| react-icons | 5.0 | Icon library |

---

## Architecture

```
┌───────────────────────────────────────────────────────────────┐
│                      Client Browser                           │
│  React 18 + Tailwind CSS (SPA on port 5173)                  │
│  ┌─────────┐ ┌──────┐ ┌────────┐ ┌───────┐ ┌──────────────┐ │
│  │ Pages   │ │ Cart │ │ Auth   │ │ API   │ │ WebSocket    │ │
│  │ (13)    │ │ Ctx  │ │ Ctx    │ │ Layer │ │ (STOMP)      │ │
│  └─────────┘ └──────┘ └────────┘ └───┬───┘ └──────┬───────┘ │
└───────────────────────────────────────┼────────────┼─────────┘
                                        │ REST       │ WS
                                        ▼            ▼
┌───────────────────────────────────────────────────────────────┐
│                Spring Boot Backend (port 8080)                │
│  ┌────────────┐ ┌────────────┐ ┌─────────────┐ ┌───────────┐│
│  │ Controllers│ │ Services   │ │ Security    │ │ WebSocket ││
│  │ (5 REST)   │ │ (6 svc)    │ │ JWT + OTP   │ │ STOMP Cfg ││
│  └─────┬──────┘ └─────┬──────┘ └──────┬──────┘ └───────────┘│
│        │              │               │                       │
│  ┌─────▼──────┐ ┌─────▼──────┐ ┌─────▼───────────────┐      │
│  │ JPA Repos  │ │ Twilio     │ │ Notification Engine │      │
│  │ (6 repos)  │ │ SendGrid   │ │ Async + 3× Retry    │      │
│  └─────┬──────┘ └────────────┘ └─────────────────────┘      │
└────────┼────────────────────────────────────────────────────┘
         │
         ▼
┌─────────────────┐
│ H2 (dev)        │
│ MySQL (prod)    │
│ 7 entities      │
└─────────────────┘
```

---

## Project Structure

```
break-the-fast/
├── README.md
├── backend/                              # Spring Boot Application
│   ├── pom.xml                           # Maven dependencies
│   ├── mvnw / mvnw.cmd                  # Maven wrapper
│   └── src/main/
│       ├── java/com/breakthefast/
│       │   ├── BreakTheFastApplication.java
│       │   ├── config/
│       │   │   ├── AsyncConfig.java      # Thread pool for notifications
│       │   │   ├── DataSeeder.java       # Seeds admin + 23 menu items
│       │   │   ├── SecurityConfig.java   # Endpoint authorization rules
│       │   │   └── WebSocketConfig.java  # STOMP over SockJS
│       │   ├── controller/
│       │   │   ├── AdminController.java  # /api/v1/admin/*
│       │   │   ├── AuthController.java   # /api/v1/auth/*
│       │   │   ├── CustomerController.java # /api/v1/customer/*
│       │   │   ├── MenuController.java   # /api/v1/menu/*
│       │   │   └── OrderController.java  # /api/v1/orders/*
│       │   ├── dto/
│       │   │   ├── request/  (10 DTOs)   # Validated request bodies
│       │   │   └── response/ (8 DTOs)    # API response shapes
│       │   ├── entity/       (7 files)   # JPA entities
│       │   ├── enums/        (7 files)   # Business enumerations
│       │   ├── exception/    (4 files)   # Global error handling
│       │   ├── repository/   (6 files)   # Spring Data JPA repos
│       │   ├── security/
│       │   │   ├── JwtUtil.java          # Token generation/validation
│       │   │   └── JwtAuthFilter.java    # Request filter
│       │   └── service/
│       │       ├── AuthService.java      # OTP + admin login flows
│       │       ├── MenuService.java      # CRUD + search + availability
│       │       ├── OrderService.java     # Place/manage/cancel orders
│       │       ├── NotificationService.java # Async dispatch engine
│       │       ├── TwilioService.java    # SMS + WhatsApp
│       │       └── EmailService.java     # SendGrid transactional email
│       └── resources/
│           └── application.yml           # All configuration
│
└── frontend/                             # React SPA
    ├── package.json
    ├── vite.config.js                    # Dev server + API proxy
    ├── tailwind.config.js                # Custom design tokens
    ├── postcss.config.js
    ├── index.html                        # Entry HTML + Google Fonts
    └── src/
        ├── main.jsx                      # React root
        ├── App.jsx                       # Router + guards + layout
        ├── index.css                     # Tailwind + component classes
        ├── context/
        │   ├── AuthContext.jsx           # Auth state (OTP + admin)
        │   └── CartContext.jsx           # Cart state (localStorage)
        ├── services/
        │   ├── api.js                    # Axios instance + interceptors
        │   └── endpoints.js             # All API call functions
        ├── components/
        │   ├── layout/
        │   │   ├── Navbar.jsx            # Responsive nav + cart badge
        │   │   └── Footer.jsx            # 3-column footer
        │   ├── menu/
        │   │   └── MenuItemCard.jsx      # Menu card with badges
        │   └── orders/
        │       └── OrderStatusStepper.jsx # 4-phase progress indicator
        └── pages/
            ├── HomePage.jsx              # Hero + heritage + featured
            ├── MenuPage.jsx              # Categories + search + grid
            ├── CartPage.jsx              # Cart management
            ├── CheckoutPage.jsx          # Order review + placement
            ├── OrderConfirmationPage.jsx # Success + stepper
            ├── LoginPage.jsx             # Dual OTP / admin login
            ├── DashboardPage.jsx         # Customer order history
            ├── ProfilePage.jsx           # Customer profile editor
            ├── AboutPage.jsx             # Brand story
            ├── CateringPage.jsx          # Platter catalog + inquiry
            ├── AdminOrdersPage.jsx       # Admin command center
            ├── AdminQuickEntryPage.jsx   # Phone order entry
            └── AdminMenuPage.jsx         # Menu availability toggles
```

---

## Prerequisites

Before running the application, ensure you have the following installed:

| Requirement | Minimum Version | Check Command | Install |
|------------|----------------|---------------|---------|
| **Java JDK** | 17+ | `java -version` | [Adoptium](https://adoptium.net/) or `brew install openjdk@17` |
| **Node.js** | 18+ | `node -v` | [nodejs.org](https://nodejs.org/) or `brew install node` |
| **npm** | 9+ | `npm -v` | Comes with Node.js |
| **Git** | 2.x | `git --version` | `brew install git` |
| **MySQL** _(optional, prod only)_ | 8.0+ | `mysql --version` | `brew install mysql` |

> **Note:** Maven is **not** required globally — the included `mvnw` wrapper handles it automatically.

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/break-the-fast.git
cd break-the-fast
```

Or if you already have the project:

```bash
cd /path/to/break-the-fast
```

### 2. Backend Setup

```bash
# Navigate to the backend directory
cd backend

# Make the Maven wrapper executable (macOS/Linux)
chmod +x mvnw

# Compile the project (downloads dependencies on first run)
./mvnw compile

# Expected output: BUILD SUCCESS
```

**No database setup needed** for development — the app uses an in-memory H2 database by default that auto-creates all tables and seeds sample data on startup.

### 3. Frontend Setup

```bash
# Navigate to the frontend directory
cd ../frontend

# Install all npm dependencies
npm install

# Expected output: added ~170 packages
```

---

## Running the Application

### Quick Start (Development Mode)

Open **two terminal windows/tabs**:

**Terminal 1 — Backend (Spring Boot):**
```bash
cd break-the-fast/backend
./mvnw spring-boot:run
```
Wait for:
```
Started BreakTheFastApplication in X.XX seconds
```
Backend runs on **http://localhost:8080**

**Terminal 2 — Frontend (Vite):**
```bash
cd break-the-fast/frontend
npm run dev
```
Wait for:
```
VITE v5.x.x ready in XXX ms
➜ Local: http://localhost:5173/
```
Frontend runs on **http://localhost:5173**

### Access the Application

| URL | Description |
|-----|-------------|
| http://localhost:5173 | 🌐 Main application (customer-facing) |
| http://localhost:5173/login | 🔐 Customer OTP login |
| http://localhost:5173/login?mode=admin | 🔑 Admin login page |
| http://localhost:5173/admin/orders | 📋 Admin order dashboard |
| http://localhost:5173/admin/quick-entry | 📞 Admin phone-order entry |
| http://localhost:5173/admin/menu | 🍛 Admin menu management |
| http://localhost:8080/h2-console | 🗄️ H2 Database Console (dev only) |

### H2 Console Access (Development)

1. Open http://localhost:8080/h2-console
2. Use these settings:
   - **JDBC URL:** `jdbc:h2:mem:breakthefast`
   - **Username:** `sa`
   - **Password:** _(leave empty)_
3. Click **Connect**

---

## Environment Variables

All configuration uses **sensible defaults** for development. For production or to enable external services, set these environment variables:

### Required for Production

| Variable | Description | Default |
|----------|-------------|---------|
| `JWT_SECRET` | JWT signing key (min 256-bit) | Dev key (⚠️ change in prod!) |
| `DB_HOST` | MySQL host | `localhost` |
| `DB_PORT` | MySQL port | `3306` |
| `DB_NAME` | MySQL database name | `breakthefast` |
| `DB_USERNAME` | MySQL username | `root` |
| `DB_PASSWORD` | MySQL password | _(empty)_ |
| `ADMIN_EMAIL` | Default admin email | `admin@breakthefast.com` |
| `ADMIN_PASSWORD` | Default admin password | `BreakTheFast@2026` |

### Optional — Notification Services

| Variable | Description | Default |
|----------|-------------|---------|
| `TWILIO_ACCOUNT_SID` | Twilio Account SID | _(empty — logs to console)_ |
| `TWILIO_AUTH_TOKEN` | Twilio Auth Token | _(empty)_ |
| `TWILIO_PHONE_NUMBER` | Twilio SMS sender number | _(empty)_ |
| `TWILIO_WHATSAPP_NUMBER` | Twilio WhatsApp sender | _(empty)_ |
| `SENDGRID_API_KEY` | SendGrid API key | _(empty — logs to console)_ |
| `SENDGRID_FROM_EMAIL` | SendGrid sender email | `noreply@breakthefast.com` |
| `CORS_ORIGINS` | Allowed CORS origins | `http://localhost:5173,http://localhost:3000` |

> 💡 **Dev mode:** When Twilio/SendGrid keys are empty, the app gracefully falls back to logging OTPs and notifications to the console — perfect for development.

### Setting Environment Variables

**macOS/Linux (terminal):**
```bash
export JWT_SECRET="your-super-secret-key-at-least-256-bits-long"
export TWILIO_ACCOUNT_SID="ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

**Or create a `.env` file** (not committed to Git):
```bash
# backend/.env (use with your IDE or a launcher script)
JWT_SECRET=your-production-secret-key
TWILIO_ACCOUNT_SID=ACxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
TWILIO_AUTH_TOKEN=your-auth-token
```

---

## API Reference

Base URL: `http://localhost:8080/api/v1`

### Authentication (`/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/auth/otp/send` | Public | Send OTP to phone number |
| POST | `/auth/otp/verify` | Public | Verify OTP → get JWT tokens |
| POST | `/auth/admin/login` | Public | Admin email+password login |
| POST | `/auth/token/refresh` | Public | Refresh access token |
| POST | `/auth/logout` | Auth | Invalidate session |

### Menu (`/menu`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/menu/items` | Public | List all items (filter by `?category=`) |
| GET | `/menu/items/{id}` | Public | Get single menu item |
| GET | `/menu/categories` | Public | List all categories |
| GET | `/menu/search?q=` | Public | Search menu items |

### Orders (`/orders`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/orders` | Customer | Place a new order |
| GET | `/orders/my?page=0&size=10` | Customer | Get my order history |
| GET | `/orders/my/{orderId}` | Customer | Get specific order |

### Customer (`/customer`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/customer/profile` | Customer | Get profile |
| PUT | `/customer/profile` | Customer | Update profile |

### Admin (`/admin`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/admin/orders` | Admin | List orders (with filters) |
| GET | `/admin/orders/{id}` | Admin | Get order details |
| PATCH | `/admin/orders/{id}/status` | Admin | Update order status |
| PATCH | `/admin/orders/{id}/cancel` | Admin | Cancel order with reason |
| POST | `/admin/orders/quick-entry` | Admin | Create phone order |
| POST | `/admin/orders/{id}/notify/resend` | Admin | Resend notification |
| GET | `/admin/orders/summary` | Admin | Order status counts |
| POST | `/admin/menu/items` | Admin | Create menu item |
| PUT | `/admin/menu/items/{id}` | Admin | Update menu item |
| PUT | `/admin/menu/items/{id}/availability` | Admin | Toggle availability |
| PUT | `/admin/menu/items/bulk-availability` | Admin | Bulk toggle |
| DELETE | `/admin/menu/items/{id}` | Admin | Delete menu item |

### WebSocket

| Endpoint | Protocol | Description |
|----------|----------|-------------|
| `/ws` | SockJS + STOMP | WebSocket connection endpoint |
| `/topic/orders` | STOMP subscribe | Real-time order updates (admin dashboard) |

---

## Database

### Entity Relationship

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Customer   │     │    Order     │     │  OrderItem   │
├──────────────┤     ├──────────────┤     ├──────────────┤
│ id (UUID)    │◄────│ customer_id  │     │ id (UUID)    │
│ phoneNumber  │     │ id (UUID)    │◄────│ order_id     │
│ name         │     │ orderNumber  │     │ menuItemId   │
│ email        │     │ customerName │     │ menuItemName │
│ notifyWhatsApp│    │ customerPhone│     │ quantity     │
│ notifyEmail  │     │ orderType    │     │ unitPrice    │
│ createdAt    │     │ orderSource  │     │ subtotal     │
└──────────────┘     │ status       │     └──────────────┘
                     │ totalAmount  │
┌──────────────┐     │ specialInstr │     ┌──────────────┐
│  AdminUser   │     │ eventDate    │     │  MenuItem    │
├──────────────┤     │ guestCount   │     ├──────────────┤
│ id (UUID)    │     │ estimatedTime│     │ id (UUID)    │
│ email        │     │ cancelReason │     │ name         │
│ passwordHash │     │ createdAt    │     │ description  │
│ name         │     │ updatedAt    │     │ price        │
│ createdAt    │     └──────────────┘     │ category     │
└──────────────┘                          │ imageUrl     │
                     ┌──────────────┐     │ isAvailable  │
┌──────────────┐     │NotificationLog│    │ isSpicy      │
│  OtpRecord   │     ├──────────────┤     │ portionSize  │
├──────────────┤     │ id (UUID)    │     │ heritageNote │
│ id (UUID)    │     │ order_id     │     │ tags         │
│ phoneNumber  │     │ channel      │     │ createdAt    │
│ otpCode      │     │ phase        │     └──────────────┘
│ attempts     │     │ status       │
│ expiresAt    │     │ retryCount   │
│ lockedUntil  │     │ sentAt       │
│ createdAt    │     └──────────────┘
└──────────────┘
```

### Seeded Data (Development)

On startup, `DataSeeder` automatically creates:
- **1 Admin User** — `admin@breakthefast.com` / `BreakTheFast@2026`
- **23 Menu Items** across 6 categories:
  - 🥘 South Indian: Masala Dosa, Idli Sambar, Medu Vada, Rava Dosa, Pongal, Uttapam
  - 🍛 North Indian: Chole Bhature, Aloo Paratha, Poha, Upma, Pav Bhaji
  - ☕ Beverages: Masala Chai, Filter Coffee, Mango Lassi, Buttermilk
  - 🥡 Snacks & Chaats: Samosa, Kachori Chaat, Pani Puri
  - 🍮 Sweets: Rava Kesari, Gulab Jamun, Jalebi
  - 🍱 Combo Meals: Breakfast Thali, South Indian Combo

---

## Default Credentials

### Admin Login
| Field | Value |
|-------|-------|
| Email | `admin@breakthefast.com` |
| Password | `BreakTheFast@2026` |

Access at: http://localhost:5173/login?mode=admin

### Customer Login (Dev Mode)
Since Twilio credentials are empty in dev mode, the OTP is **logged to the backend console**:
1. Go to http://localhost:5173/login
2. Enter any US phone number (e.g., `+12025551234`)
3. Check the backend terminal for: `[DEV] OTP for +12025551234: XXXXXX`
4. Enter that 6-digit code

---

## Design System

The UI follows a carefully crafted Indian cultural design language:

### Colors
| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#C0392B` | Crimson — buttons, CTAs, branding |
| `secondary` | `#E67E22` | Saffron/turmeric — accents, highlights |
| `cream` | `#FFFDF7` | Warm background |
| `charcoal` | `#1A1A1A` | Headings, dark sections |
| `slate` | `#555555` | Body text |
| `pure-veg` | `#27AE60` | Pure Vegetarian badge |

### Typography
| Font | Usage |
|------|-------|
| **Playfair Display** | Headings, brand name (serif, heritage feel) |
| **Inter** | Body text, UI elements (clean sans-serif) |

### Component Classes (defined in `index.css`)
- `.btn-primary` / `.btn-secondary` / `.btn-outline` — Button variants
- `.card` — Rounded card with shadow
- `.input-field` — Styled form inputs
- `.pure-veg-badge` / `.spicy-badge` — Menu item badges
- `.section-title` — Consistent heading style

---

## Production Deployment

### Using MySQL (Production Profile)

1. **Create the MySQL database:**
   ```sql
   CREATE DATABASE breakthefast CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. **Set environment variables:**
   ```bash
   export SPRING_PROFILES_ACTIVE=mysql
   export DB_HOST=your-mysql-host
   export DB_PORT=3306
   export DB_NAME=breakthefast
   export DB_USERNAME=your-username
   export DB_PASSWORD=your-secure-password
   export JWT_SECRET=your-256-bit-production-secret-key
   ```

3. **Run with MySQL profile:**
   ```bash
   cd backend
   ./mvnw spring-boot:run -Dspring-boot.run.profiles=mysql
   ```

### Building for Production

**Backend JAR:**
```bash
cd backend
./mvnw clean package -DskipTests
# Output: target/break-the-fast-1.0.0.jar

java -jar target/break-the-fast-1.0.0.jar --spring.profiles.active=mysql
```

**Frontend Static Build:**
```bash
cd frontend
npm run build
# Output: dist/ folder — serve with Nginx, Caddy, or any static host
```

### Recommended Production Stack
```
                Nginx (443/80)
                ├── /            → frontend dist/ (static files)
                └── /api, /ws   → proxy to Spring Boot (8080)
                                        │
                                        ▼
                                   MySQL 8.x
```

**Sample Nginx config:**
```nginx
server {
    listen 80;
    server_name breakthefast.com;

    # Frontend static files
    location / {
        root /var/www/break-the-fast/frontend/dist;
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # WebSocket proxy
    location /ws {
        proxy_pass http://127.0.0.1:8080;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

---

## Troubleshooting

### Common Issues

| Problem | Solution |
|---------|----------|
| `mvnw: Permission denied` | Run `chmod +x mvnw` |
| `BUILD FAILURE: TypeTag :: UNKNOWN` | Lombok version incompatible with your JDK — ensure Lombok 1.18.38+ in `pom.xml` |
| `Port 8080 already in use` | Kill the process: `lsof -ti:8080 \| xargs kill` or change port in `application.yml` |
| `Port 5173 already in use` | Kill the process: `lsof -ti:5173 \| xargs kill` |
| `OTP not received` | Check backend console logs — in dev mode OTP is logged, not sent via SMS |
| `CORS errors in browser` | Ensure backend is running and `CORS_ORIGINS` includes your frontend URL |
| `H2 console blank` | Verify JDBC URL is exactly `jdbc:h2:mem:breakthefast` |
| `npm install fails` | Delete `node_modules` and `package-lock.json`, then re-run `npm install` |
| `Admin login fails` | Ensure backend started successfully (DataSeeder creates admin on first run) |
| `WebSocket not connecting` | Check that Vite proxy config includes `/ws` and backend is running |

### Checking Logs

```bash
# Backend logs (watch mode)
cd backend
./mvnw spring-boot:run | tee backend.log

# Frontend logs
cd frontend
npm run dev
# Check browser DevTools → Console + Network tabs
```

---

## Order Number Format

Orders follow the pattern: **`BTF-YYYY-XXXX`**

Example: `BTF-2026-0001`, `BTF-2026-0042`

---

## Notification Flow

```
Order Placed ──► Phase 1: RECEIVED
                    │  "Your order BTF-2026-0001 has been received!"
                    ▼
               Phase 2: PREPARING
                    │  "Your order is being prepared..."
                    ▼
               Phase 3: READY
                    │  "Your order is ready for pickup!"
                    ▼
               Phase 4: COMPLETED
                    │  "Thank you for dining with us!"

     ❌ CANCELLED ──► "Your order has been cancelled. Reason: ..."
```

Each notification:
- Dispatched **asynchronously** (non-blocking)
- Sent via **WhatsApp + Email** simultaneously
- **3× retry** with exponential backoff on failure
- Logged in `NotificationLog` table for audit

---

## License

This project was built as part of a software engineering exercise based on a detailed SRS document for "Break The Fast — Authentic Indian Cuisine Online Ordering Platform."

---

<p align="center">
  <strong>🪷 Break The Fast</strong><br>
  <em>100% Pure Vegetarian · Authentic Indian Cuisine · Freshly Yours to Pick Up</em>
</p>
