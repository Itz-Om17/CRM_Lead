# LeadFlow — Lead Management CRM

A full-stack sales pipeline CRM application to add, edit, delete, filter, sort, and search customer leads — with JWT authentication, per-user lead ownership, and a professional public landing page.

## Live Demo
[Add Live Demo Link here]

## Screenshots
[Add screenshots here]

## Features

### Core Features
- **Sales Pipeline Dashboard**: Real-time sales metrics showing total and stage-by-stage counts of leads in the pipeline.
- **Full Lead CRUD**: Add, retrieve, update, and delete lead data through clean and practical forms.
- **JWT Authentication**: Secure user registration and login using JSON Web Tokens with bcrypt password hashing.
- **Per-User Lead Ownership**: Every lead is bound to its creator — users can only see, edit, and delete their own leads.
- **Profile Management**: Update personal details, change passwords, and manage sessions from a dedicated profile page.
- **Backend Validation**: Robust server-side validation using `express-validator` to ensure data sanitation and correct structure.
- **Client-side Form Validation**: Real-time validation checks for name length, email format, and missing fields.
- **Conflict Handling**: Grabs duplicate database constraint errors (e.g. emails) and maps them cleanly to inline form messages.
- **Confirmation Modals**: Dialog-overlay confirms action before completing destructive actions (e.g., deleting a lead).

### Bonus Features
- **Public Landing Page**: An impressive, professionally-designed introduction page containing a Navbar, Hero section with a pure CSS CRM dashboard mockup, Stats strip, Feature cards, Timeline steps, CTA banner, and Footer, complete with smooth scroll and full responsive scaling.
- **Interactive Navbar Profile Dropdown**: Click-away dropdown menu in the app header showing user details, profile navigation, and sign-out actions.
- **Instant Debounced Search**: 400ms debounced searching across name, email, and company fields using a Mongoose text index.
- **Pipeline Statistics**: Aggregated database statistics using MongoDB aggregation pipelines to track conversions and stage counts.
- **Advanced Querying**: Client-side options to filter by pipeline stage, sort by alphabetical/date fields, and page through datasets.
- **Keyboard Access & Focus Trapping**: Modals trap focus automatically on open, close on backdrop clicks, close on `Escape` keypress, and return focus to the previous active element on close.
- **Custom Toast Notification System**: Zero-library custom popup alert notification system indicating success and error statuses.
- **Tablet & Mobile Responsive Pass**: Styled from scratch using pure CSS media queries for 768px (tablet) and 480px (mobile) screen sizes.

---

## Tech Stack & Dependencies

- **Frontend**: React.js (`^18.3.1`), React Router DOM v6 (`^6.23.1`), Axios (`^1.7.2`), Vanilla CSS
- **Backend**: Node.js, Express.js (`^4.19.2`), Mongoose ODM (`^8.4.1`), `express-validator` (`^7.1.0`), `dotenv` (`^16.4.5`), `cors` (`^2.8.5`), `bcryptjs` (`^2.4.3`), `jsonwebtoken` (`^9.0.2`)
- **Dev Tools**: `concurrently` (`^8.2.2`), `nodemon` (`^3.1.3`), Vite (`^5.2.11`)

---

## Prerequisites
- Node.js (v18.0.0 or higher)
- MongoDB Community Server (v6.0.0 or higher) installed locally and running

---

## Setup & Installation

Follow these steps to set up and run the application locally:

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Itz-Om17/CRM_Lead.git
   cd CRM_Lead
   ```

2. **Install Root Dependencies**:
   ```bash
   npm install
   ```

3. **Install Backend Dependencies**:
   ```bash
   cd server
   npm install
   ```

4. **Install Frontend Dependencies**:
   ```bash
   cd ../client
   npm install
   ```

5. **Configure Environment Variables**:
   Copy the example environment configuration file inside the server directory:
   ```bash
   cp ../server/.env.example ../server/.env
   ```
   Open `server/.env` and update the variables (such as the database URI) if necessary:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://127.0.0.1:27017/lead-crm
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
   JWT_EXPIRES_IN=7d
   ```

6. **Start MongoDB locally**:
   Ensure MongoDB service is running on your machine (usually starts automatically or run `mongod`).

7. **Start the Development Servers**:
   Navigate back to the root directory and run:
   ```bash
   cd ..
   npm run dev
   ```
   This command concurrently boots:
   - The Express Backend Server on: `http://localhost:5000`
   - The Vite Frontend Client on: `http://localhost:3000` (which proxies `/api` to the backend)

### Database Seeding
A seed script is provided to set up a default test account. To populate the database with the test user:
```bash
npm run seed
```
This script creates a user account with the username `test123` and password `test123`.

---

## Authentication & Lead Ownership

This CRM is equipped with full user authentication and lead ownership isolation:

- **Test Account Credentials** (two accounts to demonstrate multi-user experience):
  | Account | Username | Password | Role |
  | :--- | :--- | :--- | :--- |
  | Primary | `test123` | `test123` | Owns 4 sample leads |
  | Secondary | `demo456` | `demo456` | Owns 2 sample leads |

- **Multi-User Lead Visibility**: All authenticated users can see the full pipeline — every lead from every user is visible in the dashboard table. A **"Managed By"** column shows the creator's name (displayed as **"You"** for your own leads).
- **Ownership-Restricted Editing**: Only the creator of a lead can edit or delete it. Edit and Delete buttons are disabled (grayed out) for leads owned by other users.
- **Lead Detail Modal**: Clicking any row in the dashboard opens a slide-up detail dialog showing all lead fields:
  - **View-only** for leads owned by others (with a "View Only" badge)
  - **Fully editable** for your own leads — edit name, email, phone, company, status, and notes inline, or delete the lead from the modal footer.
- **JWT Protection**: Secured using JSON Web Tokens (JWT). All requests to protected endpoints must provide a valid `Bearer <token>` string in the `Authorization` header.
- **Profile Management**: Users can manage their account profile via `/profile`:
  - **Personal Details**: Update name and email address.
  - **Password Updates**: Securely change account passwords by validating the current password.
  - **Interactive Profile Dropdown**: Accessible from the main app header, presenting user metadata details and quick navigations.
  - **Danger Zone Sign Out**: Terminate user sessions and clear client-side authorization caches.
- **Token Configuration**: The token's signing key and expiration length are set in the server `.env` file (`JWT_SECRET` and `JWT_EXPIRES_IN`).


## Route Map

### Public Routes (no authentication required)
| Path | Page | Description |
| :--- | :--- | :--- |
| `/` | Landing Page | Public marketing page with hero, features, and CTA |
| `/login` | Login Page | User sign-in with test credential hints |
| `/register` | Register Page | New user registration with inline validations |

### Protected Routes (requires valid JWT)
| Path | Page | Description |
| :--- | :--- | :--- |
| `/dashboard` | Dashboard | Sales pipeline with stats, search, filter, sort, pagination |
| `/dashboard/add` | Add Lead | Create a new lead entry |
| `/dashboard/edit/:id` | Edit Lead | Modify an existing lead |
| `/profile` | Profile | Manage profile, change password, sign out |

### Auth Redirect Rules
- Unauthenticated user visits `/dashboard` → redirect to `/login`
- Authenticated user visits `/login` or `/register` → redirect to `/dashboard`
- After successful login → redirect to `/dashboard`
- After successful register → auto-login and redirect to `/dashboard`
- After logout → redirect to `/`

---

## API Reference

All successful responses envelope data inside a `data` parameter: `{ success: true, data: ... }`.
Errors return: `{ success: false, message: "...", errors?: { field: message } }`.

### Authentication Endpoints

| Method | Route | Request Body | Response Code | Description |
| :--- | :--- | :--- | :--- | :--- |
| **POST** | `/api/auth/register` | `{ name, username, password, email? }` | `201` / `400` / `409` | Register a new user account |
| **POST** | `/api/auth/login` | `{ username, password }` | `200` / `401` | Authenticate and receive JWT token |
| **GET** | `/api/auth/me` | None | `200` / `401` | Get current user profile (protected) |
| **PUT** | `/api/auth/profile` | `{ name?, email?, currentPassword?, newPassword? }` | `200` / `400` / `401` | Update profile or password (protected) |

### Lead Management Endpoints (all protected)

| Method | Route | Request Body | Query Params | Response Code | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | None | None | `200` | Verifies server connectivity |
| **POST** | `/api/leads` | `{ name, email, phone, company, status?, notes? }` | None | `201` | Inserts a new lead |
| **GET** | `/api/leads` | None | `search`, `status`, `sortBy`, `order`, `page`, `limit` | `200` | Lists user's leads with paging |
| **GET** | `/api/leads/stats` | None | None | `200` | User's lead statistics by status |
| **GET** | `/api/leads/:id` | None | None | `200` / `404` | Get a single lead (must be owner) |
| **PUT** | `/api/leads/:id` | `{ name?, email?, phone?, company?, status?, notes? }` | None | `200` / `403` / `404` | Update a lead (must be owner) |
| **DELETE** | `/api/leads/:id` | None | None | `200` / `403` / `404` | Delete a lead (must be owner) |

---

## Folder Structure

```
lead-crm/
├── server/                    # Backend Node.js / Express Server code
│   ├── config/                # Database & seed configurations
│   │   ├── db.js              # Mongoose connection
│   │   └── seed.js            # Default test user seeder
│   ├── controllers/           # Route handler controllers
│   │   ├── authController.js  # Register, login, profile endpoints
│   │   └── leadController.js  # Lead CRUD with ownership checks
│   ├── models/                # Mongoose schemas
│   │   ├── User.js            # User model with bcrypt hashing
│   │   └── Lead.js            # Lead model with createdBy reference
│   ├── routes/                # Express routing
│   │   ├── authRoutes.js      # Auth endpoints
│   │   └── leadRoutes.js      # Lead endpoints (protected)
│   ├── middleware/            # Express middleware
│   │   ├── authMiddleware.js  # JWT protect middleware
│   │   └── errorHandler.js    # Global error handler
│   ├── .env                   # Environment config (git-ignored)
│   ├── .env.example           # Environment template
│   └── server.js              # Entrypoint server configuration
│
├── client/                    # Frontend React code
│   ├── public/                # Static assets
│   │   └── index.html         # HTML template with Inter font
│   ├── src/
│   │   ├── api/               # API layer
│   │   │   └── leadsApi.js    # Axios client with JWT interceptor
│   │   ├── context/           # React Context providers
│   │   │   └── AuthContext.jsx # Auth state, token sync, login/logout
│   │   ├── components/        # Reusable UI widgets
│   │   │   ├── Navbar.jsx     # App header with profile dropdown
│   │   │   ├── LeadTable.jsx  # Lead data table with ownership guards
│   │   │   ├── LeadForm.jsx   # Reusable add/edit form component
│   │   │   ├── SearchBar.jsx  # Debounced search input
│   │   │   ├── StatusBadge.jsx # Color-coded pipeline status badges
│   │   │   ├── StatCard.jsx   # Dashboard metric card
│   │   │   ├── Pagination.jsx # Page navigation controls
│   │   │   ├── ConfirmModal.jsx # Focus-trapped deletion dialog
│   │   │   ├── Loader.jsx     # Loading spinner
│   │   │   ├── Toast.jsx      # Custom toast notification system
│   │   │   └── ProtectedRoute.jsx # Auth route guard
│   │   ├── pages/             # Page-level components
│   │   │   ├── LandingPage.jsx  # Public home page
│   │   │   ├── LoginPage.jsx    # User sign-in
│   │   │   ├── RegisterPage.jsx # User registration
│   │   │   ├── Dashboard.jsx    # Sales pipeline dashboard
│   │   │   ├── AddLead.jsx      # Create lead form
│   │   │   ├── EditLead.jsx     # Edit lead form
│   │   │   └── ProfilePage.jsx  # Profile management & settings
│   │   ├── styles/            # Modular CSS stylesheets
│   │   │   ├── global.css     # Design tokens, resets, base styles
│   │   │   ├── navbar.css     # Navbar + profile dropdown styles
│   │   │   ├── landing.css    # Public landing page styles
│   │   │   ├── auth.css       # Login/register page styles
│   │   │   ├── profile.css    # Profile page styles
│   │   │   ├── dashboard.css  # Dashboard layout styles
│   │   │   ├── form.css       # Lead form styles
│   │   │   ├── table.css      # Lead table styles
│   │   │   ├── stats.css      # Stat card styles
│   │   │   ├── badge.css      # Status badge styles
│   │   │   ├── modal.css      # Confirm modal styles
│   │   │   └── pagination.css # Pagination styles
│   │   ├── App.jsx            # Routing, AuthProvider, layout
│   │   └── main.jsx           # DOM mounting
│   ├── package.json
│   └── vite.config.js         # Port and backend proxy configuration
│
├── .gitignore
├── README.md
└── package.json               # Root scripts (dev, seed)
```

---

## Git Commit History Overview
Here is the progression checklist representing how the system was structured step-by-step:
1. `setupped root structure`
2. `backend setup and db model`
3. `added rest implementation`
4. `added endpoints`
5. `created react app with routing`
6. `added ui components`
7. `dashboard improvements`
8. `added forms`
9. `added notifications features`
10.`added responsive design`
11. `added jwt authentication`
12. `done with frontend abd and backend`
13. `deployment changes`
14.`deployment changes`

---

**Author**: Om Deshpande
