# NeoConnect

NeoConnect is a premium enterprise platform designed for transparent case management, staff sentiment analysis, and operational clarity. It features a state-of-the-art **Black Theme** UI, high-fidelity analytics, and a public impact ledger to foster a culture of transparency and accountability within organizations.
live link-https://neo-connect-hackathon-kexq.vercel.app/
## 🚀 Features

- **Case Management**: A streamlined system to securely submit, track, and manage operational cases (Safety, HR, Facilities, etc.).
- **Premium Black Theme**: A sleek, high-end dark mode interface implemented across all modules for a superior user experience.
- **Public Impact Ledger**: A transparent hub showcasing verified case resolutions and their positive impact on the workspace.
- **Command Analytics**: High-fidelity data visualization using Recharts to monitor departmental health and identify critical hotspots.
- **Staff Referendums**: A polling system to gather staff consensus on organizational decisions.
- **Automated Escalation**: Intelligent backend cron jobs that automatically escalate urgent or stale cases.

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js (App Router)
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express
- **Database**: MongoDB (via Mongoose)
- **Authentication**: JWT (JSON Web Tokens)
- **Scheduling**: Node-cron

## 🚥 Getting Started

### Prerequisites
- Node.js (v18.x or later)
- MongoDB Atlas account or local MongoDB instance

### Environment Setup

1.  **Backend Configuration**: 
    Create a `.env` file in the `server` directory and add the following:
    ```env
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_secure_jwt_secret
    ```

2.  **Frontend Configuration**:
    (Optional) Create a `.env.local` in the `client` directory if custom API endpoints are needed.

### Installation

Install dependencies for both the server and the client:

```bash
# Install Server dependencies
cd server
npm install

# Install Client dependencies
cd ../client
npm install
```

### Running the Application

1.  **Start the Backend**:
    ```bash
    cd server
    npm run dev
    ```

2.  **Start the Frontend**:
    ```bash
    cd client
    npm run dev
    ```

The application will be available at `http://localhost:3000`.

### Database Seeding

To populate the database with initial demo data (users, cases, and polls):
```bash
cd server
npm run seed
```

## 📂 Project Structure

- `/client`: Next.js frontend application.
- `/server`: Node.js/Express backend API.
- `/server/models`: Mongoose schemas for Users, Cases, and Polls.
- `/server/routes`: API endpoints for authentication and business logic.
- `/client/src/app`: Page components and routing.
- `/client/src/components`: Reusable UI components.

## 🔐 Security
The platform uses JWT for secure authentication. User roles (Staff, Case Manager, Secretariat) are enforced across the application to ensure data integrity and privacy.

---
*Built with precision and transparency in mind.*
