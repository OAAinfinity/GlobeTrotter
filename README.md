# GlobeTrotter

GlobeTrotter is a multi-city travel planning application for discovering destinations, building itineraries, tracking budgets, recording experiences, and sharing trips.

The project contains:

- A React and Vite frontend for the travel-planning experience.
- A Python Flask backend with PostgreSQL persistence.
- REST APIs for authentication, trips, experiences, expenses, users, and trip sharing.

## Features

### Authentication

- User signup and login.
- Password hashing with Werkzeug.
- Case-insensitive email uniqueness in PostgreSQL.
- Demo users for development.
- User ownership checks for private data.

### Dashboard

- Personalized welcome message.
- Recent trips and empty states.
- Plan New Trip action.
- Recommended destinations.
- Budget highlights, including planned spend, estimated expenses, average spend, and next departure.

### Discovery

- Search destinations by city, country, or tag.
- Filter by Indian region and cost index.
- Sort by popularity, daily cost, or name.
- Destination cards with images, descriptions, tags, daily costs, popularity scores, and best travel seasons.
- City detail modal with curated activities.
- Start a new trip from a destination.

### Trip Planning

- Create multi-city trips.
- Set trip dates, title, description, cover image, and target budget.
- Add and reorder city legs.
- Set the number of days per city.
- Select activities for a trip.
- View itinerary and trip details.
- Track planned and estimated costs.
- Update and delete trips.

### Experiences

- Store experiences belonging to a specific user.
- Optionally associate an experience with a trip.
- Record title, description, city, category, cost, rating, image, and visit date.
- Create, list, view, update, and delete experiences.

### Expenses

- Store expenses for a specific user and trip.
- Record category, description, amount, and expense date.
- Create, list, view, update, and delete expenses.
- Validate positive expense amounts.

### Trip Sharing

- Share a trip with an email address.
- Support `view` and `edit` permissions.
- List and remove trip shares.
- Only the trip owner can manage sharing records.

## Technology

### Frontend

- React
- Vite
- React Router
- Tailwind CSS
- Lucide React
- Recharts

### Backend

- Python 3.13+
- Flask
- Flask-CORS
- Psycopg 3
- python-dotenv
- Werkzeug password hashing
- Railway PostgreSQL

## Project Structure

```text
GlobeTrotter/
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── data/
│   │   └── pages/
│   ├── package.json
│   ├── index.html
│   └── vite.config.js
├── backend/
│   ├── app.py
│   ├── db.py
│   ├── auth_routes.py
│   ├── user_routes.py
│   ├── trip_routes.py
│   ├── experience_routes.py
│   ├── expense_routes.py
│   ├── share_routes.py
│   ├── requirements.txt
│   ├── .env.example
│   └── .gitignore
└── README.md
```

## Database Design

The backend uses PostgreSQL. The schema is initialized automatically when `app.py` starts. Initialization is idempotent: existing tables and records are preserved.

### `users`

Stores account and authentication data.

| Column | Type | Description |
| --- | --- | --- |
| `id` | identity integer | Primary key |
| `name` | text | User's display name |
| `email` | text | Unique login email |
| `password_hash` | text | Securely hashed password |
| `created_at` | timestamp | Account creation time |

Passwords are never returned by the API and are never stored as plain text.

### `trips`

Stores the main trip record owned by a user.

| Column | Type | Description |
| --- | --- | --- |
| `id` | identity integer | Primary key |
| `user_id` | integer | Owner, references `users.id` |
| `title` | text | Trip name |
| `description` | text | Trip notes |
| `start_date` | text | Trip start date |
| `end_date` | text | Trip end date |
| `status` | text | For example, `Upcoming` or `Completed` |
| `cover_image` | text | Cover image URL or data reference |
| `total_budget` | double precision | Planned budget |
| `estimated_cost` | double precision | Estimated trip cost |
| `created_at` | timestamp | Creation time |
| `updated_at` | timestamp | Last update time |

### `trip_city_legs`

Stores the ordered cities that make up a trip.

| Column | Type | Description |
| --- | --- | --- |
| `id` | identity integer | Primary key |
| `trip_id` | integer | References `trips.id` |
| `city_id` | text | Application city identifier |
| `city_name` | text | City display name |
| `days` | integer | Number of days in the city |
| `position` | integer | Route order |

### `trip_activities`

Stores activities selected for a trip.

| Column | Type | Description |
| --- | --- | --- |
| `trip_id` | integer | References `trips.id` |
| `activity_id` | text | Application activity identifier |
| `selected_at` | timestamp | Selection time |

The pair `trip_id` and `activity_id` is unique.

### `experiences`

Stores experiences recorded by users, optionally associated with a trip.

| Column | Type | Description |
| --- | --- | --- |
| `id` | identity integer | Primary key |
| `user_id` | integer | Experience owner |
| `trip_id` | integer nullable | Optional related trip |
| `title` | text | Experience title |
| `description` | text | Notes or description |
| `city_id` | text nullable | Related city identifier |
| `city_name` | text nullable | City display name |
| `category` | text | Experience category |
| `cost` | double precision | Experience cost |
| `rating` | double precision nullable | Rating from 1 to 5 |
| `image` | text nullable | Image URL or reference |
| `visited_date` | text nullable | Date experienced |
| `created_at` | timestamp | Creation time |
| `updated_at` | timestamp | Last update time |

### `expenses`

Stores actual expenses associated with a user's trip.

| Column | Type | Description |
| --- | --- | --- |
| `id` | identity integer | Primary key |
| `user_id` | integer | Expense owner |
| `trip_id` | integer | Related trip |
| `category` | text | Expense category |
| `description` | text | Expense details |
| `amount` | double precision | Positive expense amount |
| `expense_date` | text | Date of expense |
| `created_at` | timestamp | Creation time |

### `trip_shares`

Stores trip sharing permissions.

| Column | Type | Description |
| --- | --- | --- |
| `id` | identity integer | Primary key |
| `trip_id` | integer | Shared trip |
| `owner_id` | integer | User who owns the trip |
| `shared_with_email` | text | Recipient email |
| `permission` | text | `view` or `edit` |
| `created_at` | timestamp | Share creation time |

The pair `trip_id` and `shared_with_email` is unique.

### Relationships

```mermaid
erDiagram
    USERS ||--o{ TRIPS : owns
    USERS ||--o{ EXPERIENCES : records
    USERS ||--o{ EXPENSES : tracks
    USERS ||--o{ TRIP_SHARES : owns
    TRIPS ||--o{ TRIP_CITY_LEGS : contains
    TRIPS ||--o{ TRIP_ACTIVITIES : includes
    TRIPS ||--o{ EXPERIENCES : includes
    TRIPS ||--o{ EXPENSES : contains
    TRIPS ||--o{ TRIP_SHARES : shares
```

Trip child records use foreign keys with cascading deletes. User and trip ownership is checked in the API before private records are returned or changed.

## Backend API

### Authentication

```text
POST /api/auth/signup
POST /api/auth/login
```

### Users

```text
GET /api/users/{user_id}
```

### Trips

```text
GET    /api/users/{user_id}/trips
POST   /api/users/{user_id}/trips
GET    /api/users/{user_id}/trips/{trip_id}
PUT    /api/users/{user_id}/trips/{trip_id}
DELETE /api/users/{user_id}/trips/{trip_id}
```

### Experiences

```text
GET    /api/users/{user_id}/experiences
POST   /api/users/{user_id}/experiences
GET    /api/users/{user_id}/experiences/{experience_id}
PUT    /api/users/{user_id}/experiences/{experience_id}
DELETE /api/users/{user_id}/experiences/{experience_id}
```

Use `?tripId={trip_id}` when listing experiences for one trip.

### Expenses

```text
GET    /api/users/{user_id}/expenses
POST   /api/users/{user_id}/expenses
GET    /api/users/{user_id}/expenses/{expense_id}
PUT    /api/users/{user_id}/expenses/{expense_id}
DELETE /api/users/{user_id}/expenses/{expense_id}
```

Use `?tripId={trip_id}` when listing expenses for one trip.

### Trip Sharing

```text
GET    /api/users/{user_id}/trips/{trip_id}/shares
POST   /api/users/{user_id}/trips/{trip_id}/shares
DELETE /api/users/{user_id}/trips/{trip_id}/shares/{share_id}
```

## Local Setup

### Backend

1. Install Python 3.13 or newer.
2. Create and activate a virtual environment:

   ```powershell
   cd backend
   python -m venv .venv
   .\.venv\Scripts\Activate.ps1
   ```

3. Install dependencies:

   ```powershell
   pip install -r requirements.txt
   ```

4. Create `backend/.env` from `.env.example`:

   ```env
   DATABASE_URL=postgresql://username:password@host:5432/database_name
   ```

5. Start the API:

   ```powershell
   python app.py
   ```

The backend runs at `http://127.0.0.1:5000`.

### Frontend

1. Install Node.js.
2. Install dependencies:

   ```powershell
   cd frontend
   npm install
   ```

3. Start Vite:

   ```powershell
   npm run dev
   ```

The frontend normally runs at `http://localhost:5173`.

## Railway Deployment

1. Create a Railway project.
2. Add a PostgreSQL service.
3. Add the backend as a service from the repository.
4. Set the backend service root directory to `backend`.
5. Add this Railway variable to the backend service:

   ```text
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   ```

   Alternatively, copy the PostgreSQL service's generated `DATABASE_URL` into the backend service variables.

6. Use this start command:

   ```text
   python app.py
   ```

Railway's `*.railway.internal` hostname is private to Railway services. Use the Railway-provided internal URL in deployment, and use the public PostgreSQL connection URL for local development if Railway provides one.

Never commit `.env` or expose a database password. Rotate credentials if they have been shared publicly.

## Current Frontend/API Boundary

The frontend currently uses its local application context and mock data for the interactive demo. The backend API and PostgreSQL schema are implemented separately and are ready to be connected. Connecting the frontend requires replacing local `localStorage` operations in the application context with requests to the backend API.

## Validation

Backend validation:

```powershell
cd backend
python -m py_compile app.py db.py auth_routes.py trip_routes.py experience_routes.py expense_routes.py share_routes.py user_routes.py
```

Frontend validation:

```powershell
cd frontend
npm run build
```

The backend should also be tested against a reachable PostgreSQL instance for database initialization and API integration. A Railway internal hostname will not resolve from a local computer.
