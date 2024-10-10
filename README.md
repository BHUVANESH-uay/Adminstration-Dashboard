# Adminstration-Dashboard
A  full-stack MERN application for user authentication, employee management, and image uploads. Features include CRUD operations, search functionality, modern UI, and protected routes for logged-in users. Built with React, Node.js, Express, and MongoDB. Responsive and secure.

# MERN App

This is a full-stack MERN (MongoDB, Express, React, and Node.js) application with user authentication, employee management (CRUD), and image upload functionality.

## Features

- User Authentication (Register/Login)
- CRUD operations for employees
- Image upload for employee profiles
- Search employees by name and email
- Responsive design with modern UI
- Protected routes for logged-in users

## Technologies Used

- **Frontend**: React.js
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (via Mongoose)
- **Styling**: CSS with modern features
- **File Upload**: Multer
- **Authentication**: JWT and bcrypt for password encryption

## Project Structure

```bash
mern-app/
├── backend/
│   ├── server.js          # Main server file (Express.js)
│   └── package.json       # Backend dependencies
│
├── frontend/
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components (Navbar, Forms, etc.)
│   │   ├── pages/         # Individual pages (Login, Register, Employees)
│   │   ├── App.js         # Main React app
│   │   └── index.js       # React entry point
│   └── package.json       # Frontend dependencies
│
├── README.md              # Project documentation
└── .env                   # Environment variables


