# Support Ticket SaaS

A small SaaS-style support ticket application built with **React, FastAPI, PostgreSQL, and Google Gemini**.

Users can register, log in, create support tickets, and view their own tickets. Admins can view all tickets and update ticket status. New tickets are automatically categorized by topic and urgency using Gemini.

## Features

* User registration and JWT login
* User and admin roles
* Users can only view their own tickets
* Admins can view all tickets
* Create support tickets
* AI-powered ticket categorization
* AI assigns:

  * Category: `billing`, `account`, `technical`, `feature_request`, `general`
  * Urgency: `low`, `medium`, `high`
* Ticket status updates
* Responsive React UI
* PostgreSQL database

---

## Tech Stack

### Backend

* Python
* FastAPI
* SQLAlchemy
* PostgreSQL
* JWT authentication
* Google Gemini API

### Frontend

* React
* Vite
* React Router
* CSS

### Key Decisions

* **FastAPI:** Lightweight REST API framework with automatic API documentation.
* **PostgreSQL:** Relational database suitable for users, tickets, and ticket ownership relationships.
* **JWT:** Used to authenticate API requests and identify the current user.
* **React:** Component-based frontend suitable for the small ticket management interface.
* **Gemini:** Used to provide the required LLM-powered ticket categorization.

---

## Project Structure

```text
support-ticket-saas/
├── BackendFastAPI/
│   ├── main.py
│   ├── auth.py
│   ├── ai_service.py
│   ├── database.py
│   ├── models.py
│   ├── schemas.py
│   └── requirements.txt
│
├── FrontendReact/
│   ├── src/
│   │   ├── components/
│   │   ├── api.js
│   │   ├── App.jsx
│   │   └── App.css
│   ├── package.json
│   └── package-lock.json
│
├── .gitignore
└── README.md
```

---

## Setup & Run

### Prerequisites

* Python 3
* pip3
* Node.js and npm
* PostgreSQL
* Google Gemini API key

### 1. Clone the Repository

```bash
git clone <YOUR_REPOSITORY_URL>
cd support-ticket-saas
```

### 2. Backend Setup

```bash
cd BackendFastAPI
pip3 install -r requirements.txt
```

Make sure PostgreSQL is running. Create a database named `ticket_db`, or use a different database name in the `DATABASE_URL` value below.

### 3. Configure Environment Variables

Create:

```text
BackendFastAPI/.env
```

Add:

```env
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/ticket_db
JWT_SECRET_KEY=replace_with_a_long_random_secret
GEMINI_API_KEY=your_gemini_api_key
```

All configuration values are loaded from the environment using `python-dotenv`.

The `.env` file is excluded from Git so credentials and API keys are not committed to the repository.

The application uses the **Google Gemini API's available free usage tier** for the AI feature. Free usage is subject to Google's current quotas and limits.

### 4. Run the Backend

From the `BackendFastAPI` directory:

```bash
uvicorn main:app --reload
```

Backend:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### 5. Frontend Setup

Open a second terminal:

```bash
cd support-ticket-saas/FrontendReact
npm install
npm run dev
```

Open the URL provided by Vite, normally:

```text
http://localhost:5173
```

The frontend communicates with the FastAPI backend running on port `8000`.

---

## Architecture

The application has three main components:

```text
React Frontend
      ↓
FastAPI REST API
      ↓
PostgreSQL Database
```

The ticket creation flow also uses Gemini:

```text
React
  ↓
POST /api/tickets
  ↓
FastAPI
  ↓
Gemini → category + urgency
  ↓
PostgreSQL
  ↓
Response to React
```

Authentication and authorization are handled by the FastAPI backend.

---

## AI Feature

When a user creates a ticket, the backend sends the ticket subject and message to Gemini.

Gemini returns structured data containing:

```json
{
  "category": "technical",
  "urgency": "high"
}
```

The response is validated using a Pydantic model before the ticket is stored in the database.

The AI integration is implemented in:

```text
BackendFastAPI/ai_service.py
```

This provides the required LLM-powered automatic ticket categorization and urgency detection.

---

## Multi-Tenant Data Scoping

Ticket access is enforced by the backend.

For a regular user:

```text
GET /api/tickets
        ↓
Authenticated user ID
        ↓
Return only tickets where
ticket.user_id == current_user.id
```

Admins can retrieve tickets belonging to all users.

The frontend is not responsible for enforcing this security rule. The backend determines which tickets the authenticated user is allowed to access.

This prevents User A from accessing User B's tickets even if they manually modify an API request.

---

## API Documentation

| Method | Endpoint                          | Purpose                         |
| ------ | --------------------------------- | ------------------------------- |
| POST   | `/api/auth/register`              | Register a new user             |
| POST   | `/api/auth/login`                 | Login and receive JWT           |
| GET    | `/api/auth/me`                    | Get current authenticated user  |
| GET    | `/api/tickets`                    | Get tickets based on user role  |
| POST   | `/api/tickets`                    | Create and AI-classify a ticket |
| PATCH  | `/api/tickets/{ticket_id}/status` | Update ticket status            |

### Create Ticket

**Request**

```json
{
  "subject": "Payment failed",
  "message": "My payment was declined."
}
```

**Response**

```json
{
  "id": 1,
  "subject": "Payment failed",
  "message": "My payment was declined.",
  "category": "billing",
  "urgency": "high",
  "status": "open",
  "user_id": 1
}
```

---

## Challenge & Solution

One challenge was integrating the LLM response into the ticket creation flow while ensuring that the returned category and urgency values matched the application's allowed values.

I solved this by using a Pydantic response schema with `Literal` values and requesting a structured JSON response from Gemini. This allows the application to validate the AI result before saving it to the database.

Another important part was implementing ticket data isolation. The backend uses the authenticated user's ID when retrieving tickets, ensuring that regular users cannot access tickets belonging to other users.

---

## Individual Contribution

I personally implemented:

* FastAPI REST API
* PostgreSQL database integration
* Authentication and authorization
* User/admin role handling
* Ticket creation and retrieval
* Backend ticket ownership/data isolation
* Ticket status updates
* React frontend
* Login and registration
* Ticket submission and listing
* Responsive UI
* Gemini ticket categorization
* Project configuration
* Documentation

### AI-Assisted Development

AI tools, including ChatGPT, were used for assistance with coding, debugging, code organization, and documentation.

I reviewed, adapted, and tested the suggestions during development. I understand the implemented code and can explain the architecture, authentication, data-scoping logic, API flow, and AI integration during the follow-up discussion.

---

## Code Comments

Comments are included around non-obvious logic, particularly:

* Gemini AI integration
* Structured AI response validation
* Authentication and role checks
* Ticket ownership and data-scoping logic
