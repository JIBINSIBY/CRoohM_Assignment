# Todo App

A modern, responsive Todo application built with React that helps users manage their tasks efficiently. This application features user authentication, task creation, and task management capabilities.

## Features

- User authentication (Sign Up, Sign In)
- Create, read, update, and delete todos
- Mark todos as completed
- Filter todos by status
- Responsive design for all device sizes

## Technologies Used

### Frontend
- **React 19**: A JavaScript library for building user interfaces
- **React Router 7**: For navigation and routing within the application
- **Zustand**: State management solution
- **Axios**: HTTP client for API requests
- **Tailwind CSS**: Utility-first CSS framework for styling

### Development Tools
- **Vite**: Next-generation frontend tooling
- **ESLint**: Linting utility for JavaScript and JSX
- **PostCSS**: Tool for transforming CSS with JavaScript
- **Autoprefixer**: Plugin to parse CSS and add vendor prefixes

## Project Structure

```
todo-app/
├── public/               # Static files
├── src/
│   ├── assets/           # Images and other assets
│   ├── components/       # React components
│   │   ├── LandingPage.jsx
│   │   ├── SignIn.jsx
│   │   ├── SignUp.jsx
│   │   └── TodoList.jsx
│   ├── services/         # API services
│   │   └── todoService.js
│   ├── store/            # State management
│   │   └── todoStore.js
│   ├── App.css           # App-specific styles
│   ├── App.jsx           # Main app component
│   ├── index.css         # Global styles
│   └── main.jsx          # Entry point
├── .gitignore            # Git ignore file
├── eslint.config.js      # ESLint configuration
├── index.html            # HTML template
├── package.json          # Project dependencies
├── postcss.config.cjs    # PostCSS configuration
├── tailwind.config.cjs   # Tailwind CSS configuration
└── vite.config.js        # Vite configuration
```

## Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm or yarn

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/JIBINSIBY/CRoohM_Assignment/todo-app.git
   cd todo-app
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```
   The application will be available at http://localhost:5173

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Deployment

This project can be deployed on Vercel, Netlify, or any other static site hosting service.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
