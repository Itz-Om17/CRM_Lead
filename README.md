# Lead Management CRM

A Lead Management CRM built using the MERN stack (MongoDB, Express.js, React.js, Node.js) for small businesses to manage, track, search, filter, and monitor their sales pipeline.

## Features
- **Sales Pipeline Dashboard**: Real-time sales statistics (Total Leads, New, Contacted, Qualified, Converted, Lost) with custom indicators.
- **Advanced Searching**: Instant, debounced text search across lead name, email, and company fields.
- **Dynamic Filtering**: Filter leads instantly by sales pipeline stage.
- **Flexible Sorting**: Sort leads dynamically by creation date, alphabetical name, and company name.
- **Pagination**: Efficient server-side pagination with adjustable pages.
- **Standard CRUD APIs**: Robust backend REST API for creating, reading, updating, and deleting leads.

## Tech Stack
- **Frontend**: React.js with React Router DOM v6, Axios, Vanilla CSS
- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose ODM
- **Packages**: `dotenv`, `cors`, `express-validator`, `mongoose`, `concurrently`, `nodemon`

## Prerequisites
- Node.js (v18 or higher)
- MongoDB installed locally and running

## Setup & Installation

### Backend Setup
1. Navigate to the server folder:
   ```bash
   cd server
   ```
2. Install server dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables. Copy `.env.example` to `.env` and update variables as needed:
   ```bash
   cp .env.example .env
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   The backend server will start on `http://localhost:5000` by default.

### Frontend Setup
1. Navigate to the client folder:
   ```bash
   cd client
   ```
2. Install client dependencies:
   ```bash
   npm install
   ```
3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   The frontend app will start on `http://localhost:3000` by default.

### Run Full Stack (Recommended)
You can run both the backend and frontend concurrently from the root directory:
1. Ensure dependencies are installed in all directories (root, server, and client):
   ```bash
   npm install
   cd server && npm install
   cd ../client && npm install
   ```
2. Start the full MERN application concurrently:
   ```bash
   cd ..
   npm run dev
   ```
   This command starts the backend at `http://localhost:5000` and proxy-routes the frontend at `http://localhost:3000`.


## API Endpoints

All responses follow the standard envelope format:
- **Success**: `{ success: true, data: ... }`
- **Error**: `{ success: false, message: "..." }`

| Method | Path | Request Body | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | None | Verify the server is running |
| **POST** | `/api/leads` | `{ name, email, phone, company, status, notes }` | Create a new lead (returns 201) |
| **GET** | `/api/leads` | None | Get all leads (supports query parameters; returns 200) |
| **GET** | `/api/leads/stats` | None | Get statistics of leads grouped by status (returns 200) |
| **GET** | `/api/leads/:id` | None | Get a lead by ID (returns 200) |
| **PUT** | `/api/leads/:id` | `{ name?, email?, phone?, company?, status?, notes? }` | Update a lead by ID (returns 200) |
| **DELETE** | `/api/leads/:id` | None | Delete a lead by ID (returns 200) |

### GET /api/leads Query Parameters

You can customize the lead list using the following optional query parameters:

- `search`: Searches across `name`, `email`, and `company` fields using the text index (e.g., `?search=google`).
- `status`: Filters leads by status (e.g., `?status=New`). Allowed values: `New`, `Contacted`, `Qualified`, `Converted`, `Lost`.
- `sortBy`: Fields to sort by (e.g., `?sortBy=name`). Default is `createdAt`.
- `order`: Sorting order, either `asc` or `desc`. Default is `desc`.
- `page`: Page number for pagination (e.g., `?page=2`). Default is `1`.
- `limit`: Number of leads to return per page (e.g., `?limit=15`). Default is `10`.


