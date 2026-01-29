# Pastebin-Lite

**Pastebin-Lite** is a lightweight Pastebin-like application where users can create text pastes, get a shareable link, and view them. It supports optional **time-based expiry (TTL)** and **maximum view limits**.

---

## Table of Contents

1. [Running Locally](#running-locally)  
2. [Scripts](#scripts)  
3. [Deployment on Vercel](#deployment-on-vercel)  
4. [API Example Requests](#api-example-requests)  
5. [Persistence Layer](#persistence-layer)  
6. [Important Design Decisions](#important-design-decisions)  
7. [Repository Notes](#repository-notes)  
8. [Automated Tests](#automated-tests)  
9. [Summary](#summary)

---

## Running Locally

1. **Clone the repository**
```bash
git clone https://github.com/Prabha08-Kaash/my-pastebin-app.git
cd my-pastebin-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Create a .env file in the root directory**
```bash
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/<dbname>
PORT=3000
TEST_MODE=1
```

4. **Start the server**
```bash
npm start
```

5. **Open the application in your browser**
http://localhost:3000/

6. **Testing with Postman:**

   POST /api/pastes → Create a new paste

   GET /api/pastes/:id → Fetch paste data (JSON)

   GET /p/:id → View paste in HTML

*For TTL testing, include header:
x-test-now-ms: <timestamp in milliseconds> when TEST_MODE=1*

---

## Scripts

### Local development
```bash
npm start
```

### Vercel deployment
```bash
npm run vercel-start
```

application URL - https://my-pastebin-app-three.vercel.app

---

## API Example Requests

### 1. Create Paste
```http
POST /api/pastes
Content-Type: application/json

{
  "content": "Hello world",
  "ttl_seconds": 60,
  "max_views": 5
}
```
### 2. Fetch Paste
```http
GET /api/pastes/<paste_id>
```

### 3. View Paste 
```http
GET /p/<paste_id>
```
---

## Persistence Layer

Database: MongoDB

Purpose: Store pastes permanently so that they survive server restarts.

Structure of each paste:

content (string) → The actual text of the paste

ttl_seconds (optional) → Time-to-live in seconds

max_views (optional) → Maximum view limit

created_at → Timestamp of creation

views_count → Counter for how many times the paste has been accessed

All constraints are checked before serving the paste to ensure TTL and max views are enforced.

---

## Important Design Decisions

TEST_MODE=1 allows deterministic TTL testing via x-test-now-ms header.

views_count is incremented after max_views check to avoid negative counts.

Paste content is rendered safely using EJS templates to prevent script execution (XSS).

TTL and max_views constraints are enforced consistently across both API and HTML routes.

Inline CSS is used; no external build files required.

.env file is ignored in Git for security purposes.

---

## Repository Notes

All source code is included:

server.js → Main server entry point

index.js → Local development server

models/ → Database models

routes/ → API and view routes

views/ → EJS templates

No build artifacts or compiled files are committed.


---

## Automated Tests

/api/healthz returns 200 and valid JSON

Paste creation returns valid ID and URL

TTL and max_views constraints are enforced

HTML route /p/:id renders safely with no XSS

Supports deterministic testing via TEST_MODE and x-test-now-ms

---

## Summary

Fully functional Pastebin-Lite app

Users can create, share, and view pastes

Optional TTL and max view constraints supported

MongoDB used for persistence

Safe rendering with EJS

Works locally and on Vercel

Fully ready for deployment and automated grading tests

