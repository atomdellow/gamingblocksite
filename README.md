# Console Gaming Blog

A full-stack blog application dedicated to console gaming, built with Node.js, Express, Vue 3, and MongoDB.

## Features

- User registration and authentication
- Blog post creation, reading, updating, and deletion
- Comment system
- Post categorization and tagging
- Like/unlike functionality
- Admin dashboard for managing posts, categories, and users
- Responsive design for all devices

## Tech Stack

### Backend
- Node.js
- Express
- MongoDB with Mongoose
- JWT Authentication
- bcrypt for password hashing

### Frontend
- Vue 3
- Pinia for state management
- Vue Router
- Axios for API requests

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd games
```

2. Install server dependencies
```bash
npm install
```

3. Install client dependencies
```bash
cd client
npm install
cd ..
```

4. Create a `.env` file in the root directory and add:
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/console_gaming_blog
JWT_SECRET=your_jwt_secret_key
NODE_ENV=development
```

### Running the Application

#### Development Mode
Run both the server and client concurrently:
```bash
npm run dev
```

Or run them separately:
```bash
# Server only
npm run server

# Client only
npm run client
```

#### Production Mode
Build the client and start the server:
```bash
npm run build
npm start
```

## Project Structure

```
/
├── client/                # Vue frontend
│   ├── public/            # Static files
│   └── src/
│       ├── api/           # API service methods
│       ├── assets/        # Images and styles
│       ├── components/    # Vue components
│       ├── router/        # Vue Router
│       ├── stores/        # Pinia stores
│       ├── views/         # Vue views
│       ├── App.vue        # Root component
│       └── main.js        # Entry point
├── config/                # Backend configuration
├── controllers/           # Express route controllers
├── middleware/            # Express middleware
├── models/                # Mongoose models
├── routes/                # Express routes
├── .env                   # Environment variables
├── package.json           # Project dependencies
└── server.js              # Server entry point
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `GET /api/auth/logout` - Logout user

### Posts
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get single post
- `POST /api/posts` - Create post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `PUT /api/posts/:id/like` - Like/unlike post

### Comments
- `GET /api/posts/:postId/comments` - Get comments for a post
- `POST /api/posts/:postId/comments` - Add comment to post
- `PUT /api/comments/:id` - Update comment
- `DELETE /api/comments/:id` - Delete comment

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get single category
- `POST /api/categories` - Create category
- `PUT /api/categories/:id` - Update category
- `DELETE /api/categories/:id` - Delete category

## License

MIT License
