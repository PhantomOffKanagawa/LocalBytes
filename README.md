# LocalBytes

[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)

## Project Overview


LocalBytes is a web application designed to help users discover local restaurants in Columbia. The platform allows users to filter restaurants based on cuisine, price range, and other preferences to find dining options that match their needs. Users can leave comments and share their experiences, making it easier for others to find the perfect local dining spot without visiting multiple restaurant websites.

## Features

- **Details Page**: Find restaurant details including address, phone number, and hours of operation
- **Advanced Filtering**: Filter by cuisine type, price range, and other preferences
- **Google Maps Integration**: View restaurant locations on a map
- **User Comments**: Share experiences and read reviews from other diners

## Project Structure

- **Frontend**: Angular application
- **Backend**: Express/Node.js API
- **Database**: MongoDB for data storage

### Frontend Structure

>[!TIP]
> The frontend has prettier and eslint configured. You can run the following commands to format the code:   
> `npm run format` - to format the code    
> `npm run lint` - to lint the code

```
frontend/
├── src/
│   ├── app/
│   │   ├── components/  # Reusable components (@components)
│   │   ├── models/      # Data models (interfaces) (@models)
│   │   ├── pages/       # Application pages (components) (@pages)
│   │   ├── services/    # API services (@services)
│   │   ├── app.config.ts # Main configuration file
│   │   ├── app.module.ts # Main module
│   │   └── app.routes.ts # Main routing file (define routes here)
│   ├── environments/    # Environment configuration (@environment)
│   │   └── environment.ts # Main environment file (define environment variables here)
│   ├── index.html       # Index html file
├── angular.json         # Angular configuration file
├── package.json         # Frontend package file
└── tsconfig.json        # TypeScript configuration file
```

### Backend Structure


>[!TIP]
> The frontend has prettier configured. You can run the following commands to format the code:   
> `npm run format` - to format the code    

>[!TIP]
> The api is documented with apidoc and is available by default at `http://localhost:5000/api-docs`. You can run the following command to generate the documentation:   
> `npm run docs` - to generate the documentation

```
backend/
├── controllers/         # Methods for handling API requests from the frontend
├── docs/                # Automatically generated API documentation
├── models/              # Mongoose models for MongoDB collections
├── routes/              # Definitions for API routes
├── services/            # Services for handling API requests to the outside
├── utils/               # Utility functions
│   ├── config.js        # Handles environment variables
|   ├── db.js            # Handles database connection
│   ├── helpers.js       # General helper functions
│   ├── serverUtils.js   # Handles port normalization
│   └── components/      # Reusable components (@components)
├── index.js             # Backend entry point
└── package.json         # Backend package file
```

## Getting Started

### Prerequisites

- Node.js
- MongoDB database

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/PhantomOffKanagawa/LocalBytes.git
    cd LocalBytes
    ```

2. Set up environment variables:
    ```bash
    cp .env.example .env
    # Edit the .env file with your MongoDB connection string
    ```

3. Install dependencies for both frontend and backend:
    ```bash
    # Install backend dependencies
    cd backend
    npm install

    # Install frontend dependencies
    cd ../frontend
    npm install
    ```

### Running the Application

#### Backend Server
```bash
cd backend
ng serve
```
The API will run on http://localhost:5000

#### Frontend Development Server
```bash
cd frontend
npm run dev
```
The application will be available at http://localhost:4200

#### Updating the Docs

```bash
cd backend
npx nodemon --watch routes --ext js --exec "npm run docs"
```

Optional command to live update the docs when changes are made to the routes.

## Development Team

- [Harrison Surma](https://github.com/PhantomOffKanagawa)
- [Sam Whitaker](https://github.com/swhita6)
- [Tom Winterton](https://github.com/TWintertonIV)
- [Luke Deffenbaugh](https://github.com/Spidious)