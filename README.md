# Krishi Sangam

Krishi Sangam is a comprehensive agricultural platform designed to bridge the gap between farmers and companies through contract farming. It facilitates secure agreements, transparent payments, and efficient dispute resolution, empowering the agricultural ecosystem with technology.

## Features

- **Role-Based Access**: Dedicated portals for Farmers, Companies, and Administrators.
- **Contract Management**: rigorous lifecycle management for farming contracts and transactions.
- **Payment Processing**: Integrated system for tracking payments and financial records.
- **Dispute Resolution**: Mechanisms to handle and resolve conflicts between parties.
- **Feedback System**: Built-in feedback loops for continuous improvement.
- **Secure Authentication**: Robust user authentication and session management.

## Tech Stack

### Frontend
- **Framework**: React 19 (Vite)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State & Routing**: React Router DOM, React Hook Form
- **HTTP Client**: Axios
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT, Bcrypt
- **Security**: CORS, Rate Limiting, Cookie Parser

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (Local or Atlas connection string)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd krishi-sangam
   ```

2. **Backend Setup**
   Navigate to the backend directory and install dependencies:
   ```bash
   cd backend
   npm install
   ```
   
   Create a `.env` file in the `backend` directory with your configuration (port, database URI, JWT secret, etc.).
   
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   Open a new terminal, navigate to the frontend directory, and install dependencies:
   ```bash
   cd frontend
   npm install
   ```
   
   Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

- **`backend/`**: Contains the Node.js/Express API, database models, controllers, and routes.
- **`frontend/`**: Contains the React/TypeScript client application, pages, and components.

## License

This project is licensed under the ISC License.
