# Lead Management CRM

A Lead Management CRM built using the MERN stack (MongoDB, Express.js, React.js, Node.js) for small businesses to manage, track, search, filter, and monitor their sales pipeline.

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

## API Endpoints

All responses follow the standard envelope format:
- **Success**: `{ success: true, data: ... }`
- **Error**: `{ success: false, message: "..." }`

| Method | Path | Request Body | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/health` | None | Verify the server is running |
| **POST** | `/api/leads` | `{ name, email, phone, company, status, notes }` | Create a new lead (returns 201) |
| **GET** | `/api/leads` | None | Get all leads (returns 200) |
| **GET** | `/api/leads/:id` | None | Get a lead by ID (returns 200) |
| **PUT** | `/api/leads/:id` | `{ name?, email?, phone?, company?, status?, notes? }` | Update a lead by ID (returns 200) |
| **DELETE** | `/api/leads/:id` | None | Delete a lead by ID (returns 200) |

