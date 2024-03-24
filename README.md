# Intakt Events

Show the current and upcomming Events in in:takt.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

This project requires **Node.js version 16**. You can check your current Node.js version using:

```bash
node -v
```


If you need to install or switch to Node.js version 16, you can use nvm (Node Version Manager) by running:
```bash
nvm install 16
nvm use 16
```

## Installing
A step-by-step series of examples that tell you how to get a development environment running.

1. First clone the repository to your local machine:
```bash
git clone https://github.com/shadikiwan/intakt-events.git
cd intakt-events
```
2. Then, install the dependencies for both the backend and the frontend:
```bash
# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ..
npm install
```
## Installing
To run the application, you need to start both the backend server and the frontend application. Here's how you can do it:

Start the Backend Server
```bash
# Navigate to the backend directory if you're not already there
cd backend

# Start the server
npm run start-server
```
Leave the backend server running and open a new terminal window or tab for the next steps.

Start the Frontend Application
From the root directory of your project:
```bash
npm start
```
The frontend application should now be running and accessible in your web browser at http://localhost:3000.


## Built With
- React - The web framework used
- Node.js - JavaScript runtime
- Express - Web application framework for Node.js