# Flipr - Full Stack Application

A full-stack web application with a landing page and admin panel for managing projects, clients, contact forms, and newsletter subscriptions.

## Features

### Landing Page
- **Our Projects Section**: Displays all projects with image, name, description, and a "Read More" button
- **Happy Clients Section**: Shows all clients with image, name, description, and designation
- **Contact Form**: Allows users to submit their contact information (Full Name, Email, Mobile Number, City)
- **Newsletter Subscription**: Users can subscribe to the newsletter by entering their email address

### Admin Panel
- **Project Management**: Add new projects with image, name, and description
- **Client Management**: Add new clients with image, name, description, and designation
- **Contact Form Details**: View all contact form submissions in a table format
- **Newsletter Subscriptions**: View all subscribed email addresses

## Technology Stack

### Backend
- Node.js
- Express.js
- SQLite (better-sqlite3)
- Multer (for file uploads)

### Frontend
- React
- React Router
- Axios (for API calls)
- CSS3

## Project Structure

```
flipr/
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── uploads/ (created automatically)
│   └── flipr.db (created automatically)
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LandingPage.js
│   │   │   ├── LandingPage.css
│   │   │   ├── AdminPanel.js
│   │   │   └── AdminPanel.css
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── App.css
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
└── README.md
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the backend server:
```bash
npm start
```

The backend server will run on `http://localhost:5001`

For development with auto-reload:
```bash
npm run dev
```

To seed the database with sample projects:
```bash
npm run seed
```

This will add 5 sample projects to the database with images from Unsplash.

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The frontend will run on `http://localhost:3000` and automatically open in your browser.

## API Endpoints

### Projects
- `GET /api/projects` - Get all projects
- `POST /api/projects` - Add a new project (multipart/form-data)

### Clients
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Add a new client (multipart/form-data)

### Contacts
- `GET /api/contacts` - Get all contact form submissions
- `POST /api/contacts` - Submit a contact form

### Newsletter
- `GET /api/newsletter` - Get all newsletter subscriptions
- `POST /api/newsletter` - Subscribe to newsletter

## Usage

### Accessing the Application

1. **Landing Page**: Open `http://localhost:3000` in your browser
2. **Admin Panel**: Navigate to `http://localhost:3000/admin` or click "Admin Panel" in the header

### Adding Projects (Admin Panel)

1. Go to Admin Panel → Projects tab
2. Fill in the form:
   - Project Name
   - Description
   - Upload an image
3. Click "Add Project"
4. The project will appear in the "All Projects" section below

### Adding Clients (Admin Panel)

1. Go to Admin Panel → Clients tab
2. Fill in the form:
   - Client Name
   - Description
   - Designation (e.g., CEO, Web Developer, Designer)
   - Upload an image
3. Click "Add Client"
4. The client will appear in the "All Clients" section below

### Viewing Contact Forms (Admin Panel)

1. Go to Admin Panel → Contact Forms tab
2. View all submitted contact forms in a table format
3. Information includes: Full Name, Email, Mobile Number, City, and Submission Date

### Viewing Newsletter Subscriptions (Admin Panel)

1. Go to Admin Panel → Newsletter Subscriptions tab
2. View all subscribed email addresses in a table format
3. Information includes: Email Address and Subscription Date

## Database

The application uses SQLite database (`flipr.db`) which is automatically created when you first run the backend server. The database contains the following tables:

- `projects` - Stores project information
- `clients` - Stores client information
- `contacts` - Stores contact form submissions
- `newsletter_subscriptions` - Stores newsletter email subscriptions

## File Uploads

Uploaded images are stored in the `backend/uploads/` directory. Images are automatically renamed with a unique identifier to prevent naming conflicts.

## Notes

- The "Read More" button on the landing page is a placeholder and doesn't perform any action
- Email addresses in the newsletter subscription must be unique
- Image uploads are limited to 5MB per file
- Supported image formats: JPEG, JPG, PNG, GIF, WebP

## Development

To modify the API base URL in the frontend, you can:

1. Create a `.env` file in the `frontend` directory
2. Add: `REACT_APP_API_URL=http://localhost:5001`
3. Restart the React development server

## License

This project is open source and available for use.

