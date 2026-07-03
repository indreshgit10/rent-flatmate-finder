# Rent & Flatmate Finder

Finding a flatmate is harder than it looks. Price and location get you 80% of the way there, but the remaining 20% — lifestyle, habits, expectations — is where things fall apart. This project tries to close that gap using an AI-powered compatibility engine that matches tenants to listings based on their actual preferences, not just their budget.

## Demo Credentials

These accounts are pre-seeded on the hosted application for evaluation purposes.

| Role | Email | Password |
|---|---|---|
| **Admin** | admin@rentmatch.com | SuperSecurePassword123! |
| **Owner** | owner@demo.com | Demo@1234 |
| **Tenant** | tenant@demo.com | Demo@1234 |

> The Admin account has access to the full admin dashboard (user management, listing moderation, platform stats).


## What it does

There are three types of users on the platform:

- **Owners** post room listings with rent, location, availability, and photos. They review interest from tenants and decide who to talk to.
- **Tenants** build a profile with their preferred location, budget, and move-in date. They browse listings ranked by how well each one fits their profile.
- **Admins** keep the platform clean — managing users, hiding bad listings, and monitoring activity.

When a tenant finds a listing they like, they can send an interest request. If the owner accepts, both parties get access to a private real-time chat room. Email notifications keep everyone in the loop at key moments.

---

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | React + Vite, React Router, Axios, Context API, TailwindCSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcrypt |
| Real-time | Socket.io |
| Email | Nodemailer (Gmail App Password) |
| AI | Gemini API (rule-based fallback if AI is unavailable) |
| Deployment | Vercel (frontend), Railway (backend), MongoDB Atlas |

---

## Getting Started

### Prerequisites

- Node.js v18+
- A MongoDB Atlas connection string (or local MongoDB)
- A Google Gemini API key (optional — the app still works without it)

### Installation

```bash
# Clone the repo
git clone <your-repo-url>

# Install backend dependencies
cd server && npm install

# Install frontend dependencies
cd ../client && npm install
```

### Environment Setup

Create a `.env` file in the `server/` directory. Use `.env.example` as your template:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
NODE_ENV=development
GEMINI_API_KEY=your_gemini_api_key
EMAIL_USER=your_gmail@gmail.com
EMAIL_PASS=your_gmail_app_password
```

### Seed the Admin Account

```bash
cd server
npm run seed
```

This creates a default admin account:
- **Email:** admin@rentmatch.com
- **Password:** SuperSecurePassword123!

> Change this password immediately after first login.

### Run the App

```bash
# Start the backend (from /server)
npm run dev

# Start the frontend (from /client)
npm run dev
```

Frontend runs at `http://localhost:5173` and backend at `http://localhost:5000`.

---

## Database Schema

| Collection | Key Fields |
|---|---|
| `users` | `name`, `email`, `password` (hashed), `role` (tenant/owner/admin), `isDisabled` |
| `tenantprofiles` | `tenant` → User, `preferredLocation`, `budgetMin`, `budgetMax`, `moveInDate` |
| `listings` | `owner` → User, `location`, `rent`, `availableFrom`, `roomType`, `furnishing`, `photos`, `isFilled`, `isHidden` |
| `compatibilityscores` | `tenant` → User, `listing` → Listing, `score` (0–100), `explanation`, `source` (llm/rule-based) |
| `interestrequests` | `tenant` → User, `owner` → User, `listing` → Listing, `status` (pending/accepted/declined) |
| `chatmessages` | `interestRequest` → InterestRequest, `sender` → User, `content`, `createdAt` |

---

## API Reference

### Auth
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a new user |
| POST | `/api/auth/login` | Login and receive JWT |

### Listings
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/listings` | Browse all listings (with filters) |
| GET | `/api/listings/:id` | View a single listing |
| POST | `/api/listings` | Create a listing (owner only) |
| PUT | `/api/listings/:id` | Edit a listing (owner only) |
| PATCH | `/api/listings/:id/filled` | Mark listing as filled (owner only) |

### Tenant Profile
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/profile` | Get your tenant profile |
| POST | `/api/profile` | Create your tenant profile |
| PUT | `/api/profile` | Update your tenant profile |

### Compatibility
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/compatibility/:listingId` | Get AI compatibility score for a listing |

### Interest Requests
| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/interests` | Send an interest request |
| GET | `/api/interests/sent` | View your sent requests (tenant) |
| GET | `/api/interests/received` | View received requests (owner) |
| PATCH | `/api/interests/:id/accept` | Accept a request |
| PATCH | `/api/interests/:id/decline` | Decline a request |

### Chat
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/chat/:interestId` | Load chat history for an accepted request |

### Admin
| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/admin/users` | List all users |
| PATCH | `/api/admin/users/:id/toggle-status` | Disable or re-enable a user |
| GET | `/api/admin/listings` | List all listings |
| GET | `/api/admin/stats` | Platform statistics |

---

## AI Compatibility Scoring — Prompt & Example

The prompt sent to Google Gemini looks like this:

```
You are an AI assistant designed to evaluate the compatibility between a tenant and a room listing.

Given the room listing details and tenant profile below, compute a compatibility score from 0 to 100.

Consider:
1. Budget match: Does the tenant's budget cover the listing's rent?
2. Location match: Is the listing's location what the tenant wants? (case-insensitive)
3. Move-in date: Can the tenant move in on or after the listing's available date?
4. Room type and furnishing as secondary signals.

Listing:
- Location: Mumbai, Bandra
- Rent: ₹25,000/month
- Available From: 2025-08-01
- Room Type: Private Room
- Furnishing: Fully Furnished

Tenant Profile:
- Preferred Location: Bandra
- Budget Range: ₹20,000 – ₹30,000/month
- Move-in Date: 2025-08-10

Return ONLY a valid JSON object with no extra text:
{ "score": <0-100>, "explanation": "<1-2 sentences>" }
```

**Example response:**
```json
{
  "score": 88,
  "explanation": "The listing is in the tenant's preferred location and the rent falls comfortably within their budget. The tenant's move-in date aligns well with the listing's availability."
}
```

If the Gemini API is unavailable or returns something unexpected, the system automatically falls back to a deterministic rule-based scorer so the user never sees a broken experience.
