# Lead Management CRM

A full-stack sales pipeline CRM application to add, edit, delete, filter, sort, and search customer leads.

## Live Demo
[Add Live Demo Link here]

## Screenshots
[Add screenshots here]

## Features

### Core Features
- **Sales Pipeline Dashboard**: Real-time sales metrics showing total and stage-by-stage counts of leads in the pipeline.
- **Full Lead CRUD**: Add, retrieve, update, and delete lead data through clean and practical forms.
- **Backend Validation**: Robust server-side validation using `express-validator` to ensure data sanitation and correct structure.
- **Client-side Form Validation**: Real-time validation checks for name length, email format, and missing fields.
- **Conflict Handling**: Grabs duplicate database constraint errors (e.g. emails) and maps them cleanly to inline form messages.
- **Confirmation Modals**: Dialog-overlay confirms action before completing destructive actions (e.g., deleting a lead).

### Bonus Features
- **Instant Debounced Search**: 400ms debounced searching across name, email, and company fields using a Mongoose text index.
- **pipeline Statistics**: Aggregated database statistics using MongoDB aggregation pipelines to track conversions and stage counts.
- **Advanced Querying**: Client-side options to filter by pipeline stage, sort by alphabetical/date fields, and page through datasets.
- **Keyboard Access & Focus Trapping**: Modals trap focus automatically on open, close on backdrop clicks, close on `Escape` keypress, and return focus to the previous active element on close.
- **Custom Toast Notification System**: Zero-library custom popup alert notification system indicating success and error statuses.
- **Tablet & Mobile Responsive Pass**: Styled from scratch using pure CSS media queries for 768px (tablet) and 480px (mobile) screen sizes.

---

## Tech Stack & Dependencies

- **Frontend**: React.js (`^18.3.1`), React Router DOM v6 (`^6.23.1`), Axios (`^1.7.2`), Vanilla CSS
- **Backend**: Node.js, Express.js (`^4.19.2`), Mongoose ODM (`^8.4.1`), `express-validator` (`^7.1.0`), `dotenv` (`^16.4.5`), `cors` (`^2.8.5`)
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

## Authentication & Lead Ownership
This CRM is equipped with full user authentication and lead ownership isolation:
- **JWT Protection**: Secured using JSON Web Tokens (JWT). All requests to protected endpoints must provide a valid `Bearer <token>` string in the `Authorization` header.
- **Lead Ownership Isolation**: Leads are bound to the specific user account that created them (`createdBy` Mongoose schema reference). Users are only authorized to see, search, update, or delete their own leads.
- **Token Configuration**: The token's signing key and expiration length are set in the server `.env` file (`JWT_SECRET` and `JWT_EXPIRES_IN`).

---

## API Reference

All successful responses envelope data inside a `data` parameter: `{ success: true, data: ... }`.
Errors return: `{ success: false, message: "...", errors?: { field: message } }`.

| Method | Route | Request Body | Query Params | Response Code | Description |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | None | None | `200` | Verifies server connectivity |
| **POST** | `/api/leads` | `{ name, email, phone, company, status?, notes? }` | None | `210` (Created) | Inserts a new lead, checking format and duplicates |
| **GET** | `/api/leads` | None | `search`, `status`, `sortBy`, `order`, `page`, `limit` | `200` | Lists matching leads with paging info |
| **GET** | `/api/leads/stats` | None | None | `200` | Retrieves total count and stage aggregate statistics |
| **GET** | `/api/leads/:id` | None | None | `200` / `404` | Retrieves details for a single lead |
| **PUT** | `/api/leads/:id` | `{ name?, email?, phone?, company?, status?, notes? }` | None | `200` / `404` / `409` | Modifies details for an existing lead |
| **DELETE** | `/api/leads/:id` | None | None | `200` / `404` | Permanently deletes a lead from the registry |

---

## Folder Structure

```
lead-crm/
├── server/                    # Backend Node.js / Express Server code
│   ├── config/                # Database configurations (Mongoose)
│   │   └── db.js
│   ├── controllers/           # Route handler controllers (CRUD logic)
│   │   └── leadController.js
│   ├── models/                # Database schemas (Lead model, text search index)
│   │   └── Lead.js
│   ├── routes/                # Express Routing with validation rules
│   │   └── leadRoutes.js
│   ├── middleware/            # Global custom error-handler
│   │   └── errorHandler.js
│   ├── .env                   # Configuration file (ignored by git)
│   └── server.js              # Entrypoint server configuration
│
├── client/                    # Frontend React code
│   ├── public/                # Static assets and index.html font mappings
│   │   └── index.html
│   ├── src/
│   │   ├── api/               # API layer utilizing Axios instances
│   │   │   └── leadsApi.js
│   │   ├── components/        # Reusable UI widgets and custom overlays
│   │   │   ├── Navbar.jsx
│   │   │   ├── LeadTable.jsx
│   │   │   ├── LeadForm.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   ├── StatCard.jsx
│   │   │   ├── Pagination.jsx
│   │   │   ├── ConfirmModal.jsx
│   │   │   └── Loader.jsx
│   │   ├── pages/             # Dashboard and creation/edit screens
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AddLead.jsx
│   │   │   └── EditLead.jsx
│   │   ├── styles/            # Modular style sheets using plain CSS variables
│   │   │   ├── global.css
│   │   │   ├── navbar.css
│   │   │   ├── dashboard.css
│   │   │   ├── form.css
│   │   │   ├── table.css
│   │   │   ├── stats.css
│   │   │   ├── badge.css
│   │   │   ├── modal.css
│   │   │   └── pagination.css
│   │   ├── App.jsx            # Routing mappings and global Toast context hooks
│   │   └── main.jsx           # DOM mounting
│   ├── package.json
│   └── vite.config.js         # Port and backend proxy configuration
│
├── .gitignore
├── README.md
└── package.json               # Root scripts mapping
```

---

## Deployment Guide

### Deploying the Backend on Render
1. Create a free account on [Render](https://render.com).
2. Connect your GitHub repository.
3. Select **New** > **Web Service**.
4. Configure the service settings:
   - **Environment**: `Node`
   - **Root Directory**: `server`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. In the **Environment** tab, add the environment variables:
   - `PORT`: `10000` (Render's default)
   - `MONGODB_URI`: `mongodb+srv://<username>:<password>@cluster.mongodb.net/lead-crm?retryWrites=true&w=majority` (your MongoDB Atlas connection string)
6. Click **Deploy Web Service**. Render will assign a public URL (e.g., `https://crm-api.onrender.com`).

### Deploying the Frontend on Vercel
1. Create a free account on [Vercel](https://vercel.com).
2. Connect your GitHub repository.
3. Click **Add New** > **Project** and select your repository.
4. Configure the project settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `client`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. Set the Vite proxy or API base URL. *Note: Since Vite proxies `/api` during local dev, we configure Axios to point directly to Render in production.*
   - You can update `client/src/api/leadsApi.js` to dynamically choose the API base URL:
     ```javascript
     const API_BASE = import.meta.env.PROD
       ? 'https://your-backend.onrender.com/api/leads'
       : '/api/leads';
     ```
6. Click **Deploy**. Vercel will publish the frontend site (e.g., `https://crm-client.vercel.app`).

---

## Git Commit History Overview
Here is the progression checklist representing how the system was structured step-by-step:
1. `chore: initialize project structure and root configuration`
2. `feat: setup Express server with MongoDB connection and Lead model`
3. `feat: implement core CRUD REST API for leads`
4. `feat: add search, filter, sort, pagination and stats to leads API`
5. `feat: initialize React app with routing, API layer and global styles`
6. `feat: add Navbar, Loader, StatusBadge and ConfirmModal components`
7. `feat: build full Dashboard with stats, search, filter, sort and pagination`
8. `feat: implement Add Lead and Edit Lead pages with validation`
9. `feat: add toast notifications and polish all UI interactions`
10. `feat: complete responsive design for mobile and tablet`
11. `docs: complete README with full setup guide and API reference`

---

**Author**: Internship Assignment Submission
