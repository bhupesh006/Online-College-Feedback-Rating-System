# Online College Feedback Rating System

A modern, full-stack college feedback management system built with the MERN stack. This platform allows students to provide comprehensive feedback on various college departments and services while offering administrators powerful analytical tools to monitor performance and generate reports.

## Features

### Student Portal
- **Modern Dashboard**: A clean user interface with categorized feedback options (Academics, Facilities, Support).
- **Dynamic Feedback Forms**: A user-friendly submission process featuring star ratings and detailed comments.
- **Feedback History**: Students can view their previous submissions and check for administrative reviews.
- **Secure Authentication**: Ensured protection of routes and session management.

### Admin Portal
- **Analytical Dashboard**: A visual representation of feedback volume and category performance using Chart.js.
- **Performance Highlights**: Real-time identification of top-performing and low-rated categories.
- **Data Export**: Ability to generate and download detailed reports in PDF and Excel formats.
- **Real-time Updates**: Integrated with Socket.io for live feedback notifications.
- **Security**: Implemented rate limiting and robust input validation at the API level.

## 🛠️ Tech Stack
- **Frontend**: React.js, React Bootstrap, Lucide Icons, Chart.js, Axios.
- **Backend**: Node.js, Express.js.
- **Database**: MongoDB (with Mongoose ORM).
- **Security**: Express-Validator, Express-Rate-Limit, JWT.
- **Real-time**: Socket.io.

## 📦 Installation & Setup

### Prerequisites
- **Node.js** (v14+)
- **MongoDB** (Running locally or on MongoDB Atlas)

### Steps to Install

1. **Clone the repository**:
   ```bash
   git clone https://github.com/bhupesh006/Online-College-Feedback-Rating-System.git
   cd Online-College-Feedback-Rating-System
   ```

2. **Backend Setup**:
   ```bash
   cd server
   npm install
   ```
   Create a `.env` file in the server directory:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

   Start the server:
   ```bash
   npm start
   ```

3. **Frontend Setup (Client & Admin)**:
   Both the client and admin portals need their dependencies installed:

   - **Client Portal**:
   ```bash
   cd ../client
   npm install
   npm start
   ```

   - **Admin Portal**:
   ```bash
   cd ../admin
   npm install
   npm start
   ```

## 📄 License
Distributed under the MIT License.
