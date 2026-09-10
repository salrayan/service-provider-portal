# Service Provider Onboarding Portal

A MERN stack web application for onboarding and verifying service providers.

Service providers can create an account, complete their profile, add their skills and service location, upload verification documents, and submit their application.

Admins can review provider applications, view submitted details and documents, and approve or reject applications.

## Features

### Service Provider

- Register and login
- Complete and update profile
- Select service categories
- Add skills and experience
- Add service location
- Upload profile photo
- Upload ID and address proof
- Submit application for verification
- View application status
- View rejection remarks
- Edit profile before approval

### Admin

- Admin login
- Dashboard with application statistics
- View all service providers
- Search providers
- Filter providers by application status
- View provider details
- View uploaded documents
- Approve applications
- Reject applications with remarks

## Tech Stack

### Frontend

- React.js
- Vite
- React Router
- Axios
- HTML5
- CSS3

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs
- Multer

### Deployment

- Frontend: Vercel
- Backend: Render
- Database: MongoDB Atlas

## Project Structure

```text
service-provider-portal/
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── uploads/
│   ├── utils/
│   ├── .env.example
│   ├── package.json
│   └── server.js
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── services/
│   │   └── ...
│   ├── .env.example
│   ├── package.json
│   └── ...
│
├── .gitignore
└── README.md


How to Run Locally


1. Clone the Repository

git clone https://github.com/salrayan/service-provider-portal.git
cd service-provider-portal


2. Backend Setup

cd backend
npm install


Create a .env file inside the backend folder:

PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:5173


Start the backend:

npm run dev


The backend will run on:

http://localhost:5000


3. Frontend Setup

Open another terminal:

cd frontend
npm install


Create a .env file inside the frontend folder:

VITE_API_URL=http://localhost:5000/api


Start the frontend:

npm run dev

The frontend will normally run on:

http://localhost:5173



API Endpoints
Authentication
Method	Endpoint	Description
POST	/api/auth/register	Register a provider
POST	/api/auth/login	Login provider/admin
Provider
Method	Endpoint	Description
GET	/api/providers/profile	Get provider profile
PUT	/api/providers/profile	Update provider profile
POST	/api/providers/documents	Upload profile photo and documents
POST	/api/providers/submit	Submit application
GET	/api/providers/status	Get application status
Admin
Method	Endpoint	Description
GET	/api/admin/dashboard	Get dashboard statistics
GET	/api/admin/providers	Get providers with search/filter
GET	/api/admin/providers/:id	View provider details
PUT	/api/admin/providers/:id/status	Approve or reject application
Authentication

The application uses JWT-based authentication.

After login, the JWT token is stored on the client and sent with protected API requests using the Authorization header:

Authorization: Bearer <token>

The backend also checks the user's role to protect provider and admin routes.

Application Workflow
Provider Flow
Register
   ↓
Login
   ↓
Complete Profile
   ↓
Upload Documents
   ↓
Submit Application
   ↓
Pending
   ↓
Admin Review
   ↓
Approved / Rejected
Admin Flow
Admin Login
   ↓
Dashboard
   ↓
View Providers
   ↓
Search / Filter
   ↓
View Provider Details
   ↓
Approve / Reject
   ↓
Provider Status Updated
File Upload

The application supports:

JPG
JPEG
PNG
PDF

Maximum file size:

5 MB per file

Uploaded files are handled using Multer.

Validation and Error Handling

The backend validates required fields and application data before processing requests.

Validation includes:

Required registration fields
Minimum password length
Duplicate email checking
Provider profile information
Service categories
Skills
Service location
Rejection remarks
JWT authentication
Role-based authorization
File type and file size validation
Environment Variables

Environment-specific values are kept outside the source code.

Backend
PORT=
MONGO_URI=
JWT_SECRET=
FRONTEND_URL=
Frontend
VITE_API_URL=

Do not commit actual .env files or secret values to GitHub.

Live Demo
Frontend

https://service-provider-portal-beta.vercel.app

Backend

https://service-provider-portal-a9lc.onrender.com

GitHub Repository

https://github.com/salrayan/service-provider-portal

Testing

The main application flows were tested for:

Provider registration
Provider login
Admin login
Profile update
Document upload
Application submission
Application status
Admin provider listing
Provider search and filtering
Provider details
Application approval
Application rejection
Rejection remarks
Notes

This project was developed as part of a MERN Stack Intern technical assignment.

The frontend and backend are separated into different modules to keep the project organized and easier to maintain.

The backend uses MongoDB Atlas for data storage, while the frontend and backend are deployed separately.

Future Improvements

Some possible improvements for a production version include:

Email notifications for application status changes
Google authentication
Cloud storage for uploaded documents
Docker support
Swagger API documentation
More advanced admin analytics
Custom domain deployment



Author

S Al Rayan

MERN Stack Developer

GitHub: https://github.com/salrayan



**This is the version I recommend submitting.** It is enough for the assignment without making the README unnecessarily long. The sections also directly cover the requested source code setup, environment variables, API collection context, and project documentation. :contentReference[oaicite:0]{index=0}