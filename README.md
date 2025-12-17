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
- ![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB) **React 19 (Vite)**
- ![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white) **TypeScript**
- ![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white) **Tailwind CSS**
- ![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white) **React Router DOM**
- ![Axios](https://img.shields.io/badge/axios-671ddf?&style=for-the-badge&logo=axios&logoColor=white) **Axios**
- ![Lucide](https://img.shields.io/badge/Lucide-F7931A?style=for-the-badge&logo=lucide&logoColor=white) **Lucide React**

### Backend
- ![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white) **Node.js**
- ![Express.js](https://img.shields.io/badge/express.js-%23404d59.svg?style=for-the-badge&logo=express&logoColor=%2361DAFB) **Express.js**
- ![MongoDB](https://img.shields.io/badge/MongoDB-%234ea94b.svg?style=for-the-badge&logo=mongodb&logoColor=white) **MongoDB (Mongoose)**
- ![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens) **JWT**
- ![Security](https://img.shields.io/badge/Security-CORS%20%7C%20Rate%20Limiting-blue?style=for-the-badge) **CORS, Rate Limiting**

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
