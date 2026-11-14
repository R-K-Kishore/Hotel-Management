# Grand Stay - Hotel Management System

A full-stack, enterprise-grade Hotel Management web application built with **React**, **Redux Toolkit**, **Node.js/Express**, and **PostgreSQL**.

Developed as part of a technical assessment for **Namlatech**, the application delivers a complete hotel directory and administration platform with real database operations, server-side pagination, interactive maps, authentic photo galleries, and local image uploads.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture & Design](#architecture--design)
4. [Key Features](#key-features)
5. [Project Folder Structure](#project-folder-structure)
6. [Prerequisites](#prerequisites)
7. [PostgreSQL Database Setup](#postgresql-database-setup)
8. [Environment Variable Configuration](#environment-variable-configuration)
9. [Installation & Execution](#installation--execution)
10. [RESTful API Endpoints](#restful-api-endpoints)
11. [Image Upload Functionality](#image-upload-functionality)
12. [Leaflet Map Integration](#leaflet-map-integration)
13. [Security & Best Practices](#security--best-practices)

---

## Project Overview

Grand Stay is designed to manage hotel properties across India with precision and speed. The system avoids mock APIs, dummy backend files, or in-memory arrays; every hotel record, image URL, category gallery, and price is queried from an active PostgreSQL database using parameterized raw SQL via the native `pg` driver.

---

## Technology Stack

| Layer | Technologies & Libraries | Purpose |
|---|---|---|
| **Frontend** | React 18, Vite | Component-driven UI and build system |
| **State Management** | Redux Toolkit (`@reduxjs/toolkit`), `react-redux` | Centralized asynchronous application state |
| **Routing & SEO** | `react-router-dom` v7, `react-helmet-async` | Declarative client-side routing & dynamic document metadata |
| **Maps & Geo** | Leaflet 1.9, `react-leaflet` v4 | Interactive OpenStreetMap coordinate visualization |
| **Backend** | Node.js, Express.js | Modular RESTful API and static asset hosting |
| **Database** | PostgreSQL 14+ (tested on v18) | Relational database storage |
| **Database Driver** | `pg` (`Pool`) | Native SQL execution with parameterization (no ORM) |
| **File Handling** | Multer | Local multi-part file uploads with MIME & size validation |
| **Cross-Origin** | `cors` | Controlled cross-origin resource sharing |
| **Configuration** | `dotenv` | Environment variable isolation |

---

## Architecture & Design

### Frontend Architecture
* **Single Source of Truth:** Managed using Redux Toolkit slices (`hotelSlice.js`). Async actions are decoupled using `createAsyncThunk`.
* **Centralized API & URL Resolution:** The base URL and image path resolution helper (`getImageUrl`) are centralized in `src/utils/imageUrl.js` to ensure zero hardcoded duplication across components.
* **Component Modularity:** Reusable form components (`HotelForm.jsx`) handle both Creation and Updates with real-time client-side validation and blob preview URL management.
* **Horizontally Centered Pagination:** The `Pagination.jsx` component provides accessible, centered page navigation with dynamic ellipsis windowing.

### Backend Architecture
* **MVC Pattern:** Strict separation into `routes/`, `controllers/`, `middleware/`, and `config/`.
* **Zero ORM:** Uses native SQL queries via PostgreSQL connection pooling (`pg.Pool`) with `$1, $2, ...` positional parameters to eliminate SQL injection risks.
* **Atomic File Rollback:** If request validation fails or an SQL query aborts during hotel creation/update, newly uploaded images on disk are automatically deleted to prevent orphaned files.
* **Order-Preserving Middleware Stack:** CORS -> JSON Body Parser -> Static File Serving -> API Routes -> Multer & Global Error Handlers.

---

## Key Features

1. **Horizontally Centered Server-Side Pagination**
   - 5 hotels per page displayed using SQL `LIMIT` and `OFFSET`.
   - Centered controls with **Previous**, **Next**, and numbered buttons.
   - Disabled controls at boundary pages (page 1 and last page).
   - Dynamic page reset to page 1 upon searching or applying price filters.

2. **20 Real Indian Hotels & Categorized Galleries**
   - Pre-populated with 20 real, iconic hotels across 10 Indian states (e.g., The Taj Mahal Palace Mumbai, The Oberoi Grand Kolkata, The Leela Palace Bengaluru, ITC Grand Chola Chennai, Rambagh Palace Jaipur).
   - 99 categorized interior and exterior gallery images across 6 standard categories:
     * Reception & Lobby
     * Bedroom & Room Interior
     * Swimming Pool
     * Garden & Outdoor
     * Restaurant & Dining
     * Other Facilities

3. **Multi-Criteria Search & Filtering**
   - Case-insensitive search by hotel name (`ILIKE`).
   - Minimum and maximum price filtering with INR (`₹`) formatting.

4. **Interactive Leaflet Map**
   - Live OpenStreetMap integration centered on exact GPS coordinates (`latitude`, `longitude`).
   - Interactive popups with property title and location.

5. **Full CRUD Operations**
   - **Create:** Add hotel with name, description, coordinates, price, and image.
   - **Read:** Paginated directory list and full detail view with galleries.
   - **Update:** Edit hotel fields with optional image replacement (replaces old file safely).
   - **Delete:** Deletes hotel record, cascades gallery items in database, and unlinks main file from disk.

---

## Project Folder Structure

```
hotel-management/
├── .gitignore                          # Global Git ignore rules
├── README.md                           # Documentation
├── backend/
│   ├── .env.example                    # Environment variable template
│   ├── app.js                          # Express app entry & middleware pipeline
│   ├── package.json                    # Backend dependencies & npm scripts
│   ├── package-lock.json
│   ├── config/
│   │   └── db.js                       # PostgreSQL pg.Pool connection config
│   ├── controllers/
│   │   └── hotelController.js          # CRUD business logic, SQL queries & file rollback
│   ├── database/
│   │   ├── schema.sql                  # PostgreSQL table DDL schema
│   │   ├── seed_hotels.js              # Idempotent seed script for 20 real hotels
│   │   └── download_assets.py          # High-resolution asset downloader
│   ├── middleware/
│   │   └── upload.js                   # Multer storage & anchored regex filter
│   ├── routes/
│   │   └── hotelRoutes.js              # API route definitions
│   └── uploads/
│       ├── .gitkeep
│       └── hotels/                     # Seeded galleries for 20 real Indian hotels
└── frontend/
    ├── index.html                      # HTML template
    ├── package.json                    # Frontend dependencies & npm scripts
    ├── package-lock.json
    ├── vite.config.js                  # Vite configuration
    ├── eslint.config.js                # ESLint rules
    ├── public/
    └── src/
        ├── App.jsx                     # Application router & providers
        ├── main.jsx                    # React entry point
        ├── components/
        │   ├── HotelCard.jsx           # Listing card with price formatting
        │   ├── HotelForm.jsx           # Reusable Add/Edit form with validation
        │   ├── Navbar.jsx              # Responsive navigation header
        │   └── Pagination.jsx          # Horizontally centered pagination
        ├── pages/
        │   ├── AddHotel.jsx            # Hotel creation page
        │   ├── EditHotel.jsx           # Hotel modification page
        │   ├── HotelDetails.jsx        # Detail page with galleries and Leaflet map
        │   └── HotelList.jsx           # Main listing page with search & filter
        ├── redux/
        │   ├── hotelSlice.js           # Async thunks and Redux state slice
        │   └── store.js                # Redux store configuration
        ├── services/
        │   └── hotelApi.js             # Fetch abstraction for backend APIs
        ├── styles/
        │   ├── App.css                 # Base theme and navigation styles
        │   └── Hotel.css               # Card, pagination, details, and gallery styles
        └── utils/
            └── imageUrl.js             # Centralized API URL & image path builder
```

---

## Prerequisites

Ensure you have the following installed on your machine:

* **Node.js**: `v18.0.0` or higher (Node `v20.x` recommended)
* **npm**: `v8.0.0` or higher
* **PostgreSQL**: `v14.0` or higher (tested and verified on PostgreSQL 18)

---

## PostgreSQL Database Setup

1. **Start PostgreSQL Service** (if not already running):
   ```bash
   # macOS (Homebrew)
   brew services start postgresql@18

   # Linux (systemd)
   sudo systemctl start postgresql
   ```

2. **Create the Database:**
   ```bash
   psql -U postgres -c "CREATE DATABASE hotel_management;"
   ```

3. **Execute the Schema:**
   Run the schema script to create the `hotels` and `hotel_images` tables:
   ```bash
   psql -U postgres -d hotel_management -f backend/database/schema.sql
   ```

4. **(Optional) Seed 20 Real Indian Hotels:**
   The repository includes an idempotent seed script that populates 20 real Indian hotels with authentic GPS coordinates and categorized photo galleries:
   ```bash
   cd backend
   npm run seed
   ```

---

## Environment Variable Configuration

Navigate to the `backend/` directory, copy the template file, and populate your PostgreSQL credentials:

```bash
cd backend
cp .env.example .env
```

Edit `backend/.env`:

```env
# Server Port (Port 4000 recommended to prevent conflicts with macOS AirPlay/ControlCenter on 5000)
PORT=4000

# PostgreSQL Connection Settings
DB_HOST=localhost
DB_PORT=5432
DB_NAME=hotel_management
DB_USER=postgres
DB_PASSWORD=your_postgres_password
```

---

## Installation & Execution

### 1. Start the Express Backend

In your first terminal:

```bash
cd backend
npm install
npm start
```

* Backend server starts on: **`http://localhost:4000`**
* Test health endpoint: `curl http://localhost:4000/`

### 2. Start the React Frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

* Frontend application starts on: **`http://localhost:5173`**
* Open your browser and navigate to: **`http://localhost:5173`**

---

## RESTful API Endpoints

All endpoints are prefixed with `/api/hotels`:

| Method | Endpoint | Query / Body Params | Description | Success Status |
|---|---|---|---|---|
| `GET` | `/` | — | API server health check | `200 OK` |
| `GET` | `/api/hotels` | `page`, `limit`, `search`, `minPrice`, `maxPrice` | Fetch paginated hotels with search & filter | `200 OK` |
| `GET` | `/api/hotels/:id` | `id` (path param) | Fetch single hotel by ID with gallery images | `200 OK` |
| `POST` | `/api/hotels` | `FormData` (`title`, `description`, `latitude`, `longitude`, `price`, `image`) | Create new hotel record with image upload | `201 Created` |
| `PUT` | `/api/hotels/:id` | `FormData` (any updated hotel fields + optional `image`) | Update existing hotel (replaces old file safely) | `200 OK` |
| `DELETE` | `/api/hotels/:id` | `id` (path param) | Delete hotel, cascading gallery rows & file | `200 OK` |

---

## Image Upload Functionality

Image uploads are processed using **Multer**:

1. **Storage Location:** Uploads are stored in `backend/uploads/` with collision-safe filenames (`Date.now() + '-' + randomNonce + extension`).
2. **File Filtering:** Restricted strictly to image MIME types and anchored extensions (`.jpg`, `.jpeg`, `.png`, `.gif`, `.webp`) using:
   ```javascript
   const allowedMimeTypes = /^image\/(jpeg|jpg|png|gif|webp)$/i;
   const allowedExtensions = /^\.(jpe?g|png|gif|webp)$/i;
   ```
3. **Size Limit:** Capped at **5 MB**. Files exceeding this limit are rejected with HTTP `400 Bad Request`.
4. **Automated Cleanup:** If input validation fails or the SQL query encounters an error, any newly uploaded file is immediately unlinked from disk to prevent orphaned files.
5. **Static File Serving:** Static files are served via Express at `/uploads` (`http://localhost:4000/uploads/...`).

---

## Leaflet Map Integration

Located on the **Hotel Details** page (`frontend/src/pages/HotelDetails.jsx`):

* Uses `react-leaflet` (`MapContainer`, `TileLayer`, `Marker`, `Popup`) bound to OpenStreetMap.
* Dynamically centers the map on the hotel's latitude and longitude:
  ```jsx
  <MapContainer center={[parseFloat(hotel.latitude), parseFloat(hotel.longitude)]} zoom={14}>
    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
    <Marker position={[parseFloat(hotel.latitude), parseFloat(hotel.longitude)]}>
      <Popup><strong>{hotel.title}</strong><br />{hotel.city}</Popup>
    </Marker>
  </MapContainer>
  ```
* Resolves standard Vite Leaflet marker icon asset bundling using Leaflet's `L.Icon.Default.mergeOptions`.

---

## Security & Best Practices

* **No SQL Injection:** All database operations use PostgreSQL positional parameters (`$1`, `$2`, etc.). Zero raw string interpolation.
* **Credentials Protected:** `.env` is excluded in `.gitignore`. Only safe templates (`.env.example`) are version-controlled.
* **Double Validation:** Strict boundary validation on both frontend forms and backend controllers (Latitude: `-90` to `90`, Longitude: `-180` to `180`, Price: `> 0`, Title max length: `150`).
* **Error Sanitization:** All errors return structured JSON (`{ message: "..." }`) with appropriate HTTP status codes (400, 404, 500).

---

🎥 Project Demonstration

The complete demonstration video of GrandStay is available below.

▶️ Watch the Project Demo:

https://drive.google.com/file/d/1ybwlad79RS3P4yAYAtX-_th0xxt9fMgm/view?usp=drive_link

The video demonstrates the application’s features, hotel management operations, CRUD functionality, image uploads, map integration, and overall workflow.
