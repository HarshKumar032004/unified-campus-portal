# 🎓 Unified Campus Helpdesk & Portal

![MERN Stack](https://img.shields.io/badge/Stack-MERN-blue) ![License](https://img.shields.io/badge/License-MIT-green) ![Status](https://img.shields.io/badge/Status-Production_Ready-success)

## 📌 Project Overview
The **Unified Campus Helpdesk & Portal** is a comprehensive, enterprise-grade web application designed to bridge the gap between campus administration and the student body. Built entirely on the MERN stack (MongoDB, Express.js, React.js, Node.js), this platform replaces fragmented, paper-based administrative systems with a centralized, secure digital hub.

It solves three major campus operational bottlenecks: tracking and escalating student grievances, handling high-volume digital outpass requests, and maintaining a centralized registry for lost and found items. 

---

## ✨ Key Features

### 👨‍🎓 Student Features
- **Anonymous Reporting:** Submit grievances with total anonymity. The system aggressively strips user metadata before rendering on public boards to prevent retaliation.
- **Digital Outpass System:** Apply for hostel leaves by specifying destinations and dates. Track approval status in real-time.
- **Public Grievance Board & Upvoting:** View community issues and upvote shared grievances (with backend strict unique-upvote array checking).
- **Lost & Found Registry:** Report lost/found items with contact details to facilitate fast retrieval.

### 🛡️ Admin Features
- **Secret-Key Registration:** Access to the admin portal is protected by a cryptographic Environmental Secret Key, preventing privilege escalation.
- **Centralized Dashboard:** A birds-eye view of all pending, in-progress, and resolved tickets across all modules.
- **Auto-Escalation Engine:** Grievances pending for more than 3 days are automatically escalated to highlight SLA breaches.
- **Status & Remark System:** Approve/Reject outpasses or resolve grievances with official timestamped administrative remarks.

---

## 🛠️ Technology Stack

**Frontend**
- **React.js** (Bootstrapped with Vite for optimized builds)
- **Tailwind CSS** (Utility-first styling, Glassmorphism & Dark SaaS theme)
- **React Router DOM** (Role-based protected routing)
- **React-Hot-Toast** (Global non-intrusive notifications)
- **Lucide React** (Consistent iconography)

**Backend**
- **Node.js & Express.js** (REST API framework)
- **MongoDB & Mongoose** (Database & ODM)

**Security**
- **JSON Web Tokens (JWT)** (Stateless session management)
- **bcryptjs** (Password hashing)
- **Helmet** (HTTP Header hardening)
- **express-mongo-sanitize** (NoSQL injection prevention)
- **express-rate-limit** (DDoS and brute-force prevention)

---

## 🚀 Prerequisites & Installation

### 1. Clone the repository
```bash
git clone https://github.com/your-username/unified-campus-portal.git
cd unified-campus-portal
```

### 2. Setup the Backend
```bash
cd backend
npm install
```

### 3. Setup the Frontend
```bash
cd ../frontend
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the `backend/` directory based on the template below.

### 5. Run the Application
Run the backend server (runs on `http://localhost:5000`):
```bash
cd backend
npm run dev
```

Run the frontend client (runs on `http://localhost:5173`):
```bash
cd frontend
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file in the `/backend` directory.

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/campusDB?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_signature_key_here
ADMIN_SECRET=your_hardcoded_admin_registration_secret_key
```

---

## 📂 Folder Structure

```text
📦 unified-campus-portal
 ┣ 📂 backend
 ┃ ┣ 📂 controllers       # Route logic (auth, grievance, outpass, lostItem)
 ┃ ┣ 📂 middleware        # Security (authMiddleware, adminMiddleware, rateLimiters)
 ┃ ┣ 📂 models            # Mongoose Schemas (User, Grievance, Outpass, LostItem)
 ┃ ┣ 📂 routes            # Express routers
 ┃ ┗ 📜 server.js         # Backend entry point
 ┗ 📂 frontend
   ┣ 📂 src
   ┃ ┣ 📂 components      # Reusable UI (Navbar)
   ┃ ┣ 📂 pages           # Page Views (Landing, Login, StudentDashboard, AdminDashboard)
   ┃ ┣ 📜 App.jsx         # React Router configuration
   ┃ ┗ 📜 index.css       # Tailwind entry point
   ┗ 📜 vite.config.js    # Vite configuration
```

---

## 📡 API Endpoints Reference

| Route Prefix | Endpoint | Method | Access | Description |
| :--- | :--- | :---: | :---: | :--- |
| `/api/auth` | `/register` | POST | Public | Register student/admin |
| `/api/auth` | `/login` | POST | Public | Authenticate user & get JWT |
| `/api/grievances`| `/` | POST | Student | Submit a new grievance |
| `/api/grievances`| `/public` | GET | Student | View anonymized public board |
| `/api/grievances`| `/` | GET | Admin | View all grievances |
| `/api/grievances`| `/:id/upvote`| PUT | Student | Upvote a grievance |
| `/api/grievances`| `/:id` | PUT | Admin | Update status & add remark |
| `/api/outpasses` | `/` | POST | Student | Apply for a leave outpass |
| `/api/outpasses` | `/:id` | PUT | Admin | Approve/Reject outpass |
| `/api/lost-items`| `/` | POST | Student | Report lost/found item |
| `/api/lost-items`| `/:id/resolve`| PUT | Admin | Mark item as returned |

---

## 🧠 Core Logic & Technical Deep-Dive

To showcase the technical depth of this project, below are actual snippets from the core backend logic demonstrating advanced Node.js and MongoDB capabilities.

### 1. Auto-Escalation Logic
If a grievance sits in the `Pending` state for over 3 days, it automatically flags itself as `isEscalated` for administrative review. This is processed efficiently using `Promise.all` during the database fetch cycle.

```javascript
// backend/controllers/grievanceController.js
export const getAllGrievances = async (req, res) => {
  try {
    const rawGrievances = await Grievance.find()
      .populate('studentId', 'name email')
      .sort({ createdAt: -1 });

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    // Process auto-escalation
    const processedGrievances = await Promise.all(
      rawGrievances.map(async (g) => {
        // 1. Auto-Escalation Check
        if (g.status === 'Pending' && new Date(g.createdAt) < threeDaysAgo && !g.isEscalated) {
          g.isEscalated = true;
          await g.save(); // Save the escalated status to the DB
        }
        return g;
      })
    );

    res.status(200).json({ count: processedGrievances.length, grievances: processedGrievances });
  } catch (error) {
    res.status(500).json({ message: 'Server error.' });
  }
};
```

### 2. Security & Rate Limiting Pipeline
The application leverages industry-standard Express security middleware. Note the custom `Object.defineProperty` implementation designed to make `express-mongo-sanitize` compatible with the latest Express 5 getters.

```javascript
// backend/server.js
import express from 'express';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import rateLimit from 'express-rate-limit';

const app = express();

// Global Rate Limiting: Max 100 requests per 15 mins per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: 'Too many requests from this IP, please try again after 15 minutes.'
});

// Set Security HTTP Headers against XSS & Clickjacking
app.use(helmet());

// Parse incoming JSON request bodies
app.use(express.json());

// Security Patch: Redefine req.query as writable for Express 5 compatibility
app.use((req, res, next) => {
  const query = req.query;
  Object.defineProperty(req, 'query', {
    value: query, writable: true, enumerable: true, configurable: true
  });
  next();
});

// Data sanitization against NoSQL query injection payloads
app.use(mongoSanitize());

// Mount the limiter globally
app.use('/api', globalLimiter);
```

### 3. Admin Role Protection Middleware (IDOR Prevention)
Prevents Insecure Direct Object Reference (IDOR) attacks by strictly ensuring only cryptographic tokens containing the `admin` payload can access sensitive mutation routes.

```javascript
// backend/middleware/adminMiddleware.js
const isAdmin = (req, res, next) => {
  // req.user is attached by the preceding authMiddleware
  // after cryptographically verifying the JWT signature
  if (req.user && req.user.role === 'admin') {
    next(); 
  } else {
    res.status(403).json({
      message: 'Access Denied. Only admins can perform this action.',
    });
  }
};

export default isAdmin;
```
