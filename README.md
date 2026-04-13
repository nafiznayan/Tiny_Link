# 🔗 TinyLink

TinyLink is a fast, simple, and elegant URL shortener with built-in analytics. Built with Node.js, Express, PostgreSQL, Prisma, and EJS, it features a modern RESTful API and a server-side rendered frontend styled with a dark glassmorphism theme.

## ✨ Features

- **URL Shortening**: Converts long URLs into short, trackable links using Base62 encoding.
- **Redirection**: Seamlessly redirects short links to their original destinations.
- **Analytics Tracking**: Tracks total clicks and stores detailed metadata for recent clicks (Timestamp, IP Address, User Agent, Referer).
- **Link Management**: View a paginated list of all generated links, copy them to the clipboard, view their stats, or soft-delete them.
- **Modern UI**: A responsive, server-side rendered frontend built with EJS and Vanilla CSS, featuring a sleek dark theme, glassmorphism cards, and toast notifications.
- **Robust API**: RESTful JSON endpoints validated with Zod schemas.

## 🛠️ Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Validation**: Zod
- **Frontend**: EJS (Embedded JavaScript templates), Vanilla CSS & JS

## 📸 Screenshots

### Home Page
![Home Page](images/image.png)

### Shortened URL Result
![Shortened URL Result](images/image%20copy.png)

### My Links Dashboard
![My Links Dashboard](images/image%20copy%202.png)

### Link Analytics
![Link Analytics](images/image%20copy%203.png)

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- PostgreSQL running locally or remotely

### Installation

1. **Clone the repository** (if applicable) or navigate to the project directory:
   ```bash
   cd Tiny_Link
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Ensure you have a `.env` file in the root directory. It should contain at least:
   ```env
   PORT=3000
   NODE_ENV=development
   BASE_URL=http://localhost:3000
   DATABASE_URL="postgresql://username:password@localhost:5432/tinyLink?schema=public"
   ```
   *Replace the `DATABASE_URL` credentials with your actual PostgreSQL connection string.*

4. **Database Initialization**:
   Run the Prisma migrations to set up your database schema:
   ```bash
   npx prisma migrate dev
   ```
   Generate the Prisma client:
   ```bash
   npx prisma generate
   ```

5. **Start the Development Server**:
   ```bash
   npm run dev
   ```

6. **Open in Browser**:
   Visit `http://localhost:3000` to access the application.

## 📡 API Endpoints

The application exposes the following RESTful API endpoints under `/api/urls`:

| Method | Endpoint | Description |
|:---|:---|:---|
| `POST` | `/api/urls` | Create a new short URL. Expects `{"originalUrl": "..."}` in the body. |
| `GET` | `/api/urls` | List all URLs with pagination (e.g., `?page=1&limit=10`). |
| `GET` | `/api/urls/:shortCode/analytics` | Get link details and recent click analytics. |
| `DELETE`| `/api/urls/:shortCode` | Soft-delete a short URL. |

The root path handles UI and redirects:
- `GET /` - Renders the Home page.
- `GET /links` - Renders the My Links page.
- `GET /links/:shortCode` - Renders the Analytics page.
- `GET /:shortCode` - Handles the actual redirect for shortened URLs.

## 📂 Project Structure

- `src/`
  - `app.js` - Express application setup and middleware configuration.
  - `index.js` - Server entry point.
  - `db/` - Prisma client instantiation.
  - `middleware/` - Error handlers and request validation tools.
  - `routes/` - API and View router setups.
  - `utils/` - Utility functions (Base62 generator, JWT, etc.).
  - `validators/` - Zod schema definitions.
  - `views/` - EJS templates (pages, partials, layouts).
  - `public/` - Static assets (CSS, client-side JS).
- `prisma/`
  - `schema.prisma` - Database schema definition.

## 📄 License

This project is licensed under the ISC License.
