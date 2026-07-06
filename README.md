# PrimeCrop — Premium Mushroom E-Commerce Platform

**Malaysia's top-tier premium mushroom brand.**  
**Domain: [theprimecrop.com](https://theprimecrop.com) **

---

## Tech Stack

| Layer         | Technology                     |
|--------------|-------------------------------|
| Backend API   | FastAPI (Python 3.11)          |
| Database      | PostgreSQL 15                  |
| ORM/Migration | SQLAlchemy 2 + Alembic         |
| Auth          | JWT (python-jose + bcrypt)     |
| Frontend Web  | React 18 + Vite + TailwindCSS  |
| Admin Panel   | React 18 + Vite + TailwindCSS  |
| Containerize  | Docker + Docker Compose        |

---

## Project Structure

```
PrimeCrop/
├── backend/                  # FastAPI backend
│   ├── app/
│   │   ├── api/v1/endpoints/ # Auth, Products, Categories, Cart, Orders, Admin
│   │   ├── models/           # SQLAlchemy models
│   │   ├── schemas/          # Pydantic schemas
│   │   ├── core/             # Security, deps, admin bootstrap
│   │   ├── config.py         # Settings
│   │   ├── database.py       # DB connection
│   │   └── main.py           # App entry point
│   └── alembic/              # DB migrations
├── frontend/
│   ├── web/                  # Customer-facing storefront
│   └── admin/                # Admin management panel
├── docker-compose.yml        # Production
├── docker-compose.dev.yml    # Development
└── .env.example              # Environment variables template
```

---

## Quick Start (Local Development)

### 1. Prerequisites
- Docker & Docker Compose
- Node.js 20+

### 2. Start backend + database
```bash
cp .env.example .env
docker-compose -f docker-compose.dev.yml up -d
```

### 3. Start frontend (web storefront)
```bash
cd frontend/web
npm install
npm run dev
# Opens at http://localhost:5173
```

### 4. Start admin panel
```bash
cd frontend/admin
npm install
npm run dev
# Opens at http://localhost:5174
```

### 5. Access
| Service         | URL                         |
|-----------------|-----------------------------|
| Storefront      | http://localhost:5173       |
| Admin Panel     | http://localhost:5174       |
| API             | http://localhost:8000       |
| API Docs        | http://localhost:8000/docs  |

**Admin login:**
- Email: `admin@theprimecrop.com`
- Password: `PrimeCrop@Admin2026!`

---

## Production Deployment (Full Docker)

```bash
cp .env.example .env
# Edit .env with strong SECRET_KEY and passwords
docker-compose up -d --build
```

| Service     | Port |
|-------------|------|
| Storefront  | 3000 |
| Admin Panel | 3001 |
| API         | 8000 |

---

## API Endpoints

### Public
| Method | Endpoint                          | Description          |
|--------|-----------------------------------|----------------------|
| GET    | `/api/v1/products`                | List products        |
| GET    | `/api/v1/products/featured`       | Featured products    |
| GET    | `/api/v1/products/{slug}`         | Product detail       |
| GET    | `/api/v1/products/{slug}/reviews` | Product reviews      |
| GET    | `/api/v1/categories`              | List categories      |

### Authenticated (JWT)
| Method | Endpoint                    | Description          |
|--------|-----------------------------|----------------------|
| POST   | `/api/v1/auth/register`     | Register             |
| POST   | `/api/v1/auth/login`        | Login                |
| GET    | `/api/v1/auth/me`           | My profile           |
| PUT    | `/api/v1/auth/me`           | Update profile       |
| GET    | `/api/v1/cart`              | View cart            |
| POST   | `/api/v1/cart/items`        | Add to cart          |
| PUT    | `/api/v1/cart/items/{id}`   | Update cart item     |
| DELETE | `/api/v1/cart/items/{id}`   | Remove cart item     |
| POST   | `/api/v1/orders`            | Place order          |
| GET    | `/api/v1/orders`            | My orders            |
| GET    | `/api/v1/orders/{id}`       | Order detail         |
| PUT    | `/api/v1/orders/{id}/cancel`| Cancel order         |

### Admin Only
| Method | Endpoint                              | Description          |
|--------|---------------------------------------|----------------------|
| GET    | `/api/v1/admin/dashboard/stats`       | Dashboard stats      |
| GET    | `/api/v1/admin/orders`                | All orders           |
| PUT    | `/api/v1/admin/orders/{id}/status`    | Update order status  |
| GET    | `/api/v1/admin/users`                 | All users            |
| PUT    | `/api/v1/admin/users/{id}/toggle-status` | Suspend/activate  |
| POST   | `/api/v1/products`                    | Create product       |
| PUT    | `/api/v1/products/{id}`               | Update product       |
| DELETE | `/api/v1/products/{id}`               | Deactivate product   |
| POST   | `/api/v1/categories`                  | Create category      |
| PUT    | `/api/v1/categories/{id}`             | Update category      |

---

## Features

### Storefront
- Premium brand homepage with hero, featured products, benefits section
- Product catalog with filtering, sorting, search, and pagination
- Product detail with image gallery, reviews, health benefits
- Shopping cart with real-time stock validation
- Checkout with Malaysian state selector and payment methods
- User dashboard with order history and profile management
- Order tracking with status progress indicator

### Admin Panel
- Dashboard with revenue, order, and inventory stats
- Full product CRUD with image URLs, tags, and health benefits
- Category management
- Order management with status & payment updates
- Customer management with suspend/activate

### Business Logic
- Free shipping on orders above RM200
- Standard shipping RM10
- Stock validation on add-to-cart and checkout
- Stock auto-deduction on order placement
- Stock restoration on order cancellation
- Unique order numbers (PC-XXXXXXXX format)

---

## Brand Identity

- **Company:** PrimeCrop Sdn. Bhd.
- **Domain:** theprimecrop.com
- **Country:** Malaysia
- **Tagline:** "Nature's Finest, Cultivated to Perfection"
- **Currency:** Malaysian Ringgit (MYR / RM)
- **Colors:** Forest Green · Gold · Warm Cream

---

## Environment Variables

| Variable        | Description                          | Default                        |
|----------------|--------------------------------------|-------------------------------|
| `DB_HOST`      | PostgreSQL host                      | `db`                          |
| `DB_USER`      | PostgreSQL username                  | `primecrop`                   |
| `DB_PASS`      | PostgreSQL password                  | *(set in .env)*               |
| `DB_NAME`      | PostgreSQL database name             | `primecrop_db`                |
| `SECRET_KEY`   | JWT signing secret (change in prod!) | *(set in .env)*               |
| `ADMIN_EMAIL`  | Initial admin email                  | `admin@theprimecrop.com`      |
| `ADMIN_PASSWORD`| Initial admin password              | *(set in .env)*               |
