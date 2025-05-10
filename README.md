# 🍴 LocalBytes

[![🍃 MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
[![⚡ Express](https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
[![🌳 Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
[![🅰️ Angular](https://img.shields.io/badge/Angular-DD0031?style=for-the-badge&logo=angular&logoColor=white)](https://angular.io/)

## 🌟 Project Overview

LocalBytes is a web application designed to help users discover local restaurants in Columbia. The platform allows users to filter restaurants based on price range and rating to find dining options that match their needs. Users can leave comments and share their experiences, making it easier for others to find the perfect local dining spot without visiting multiple restaurant websites.

**🌐 Hosted Application**: [https://localbytes.vercel.app](https://localbytes.vercel.app)
**📽️ Presentation Slides**: [View our presentation slides here](https://www.canva.com/design/DAGm6xRlECE/8pYN6mtrSEjr1RPw4OtWdQ/edit?utm_content=DAGm6xRlECE&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)


## ✨ Features

- **📋 Details Page**: Find restaurant details including address, average rating, and user comments
- **🔍 Advanced Filtering**: Filter by price range and restaurant rating
- **🗺️ Mapbox Integration**: View restaurant locations on a map
- **💬 User Comments**: Create, edit, and delete comments and view comments left by other users

## 🏗️ Project Structure

- **Frontend**: Angular application
- **Backend**: Express/Node.js API
- **Database**: MongoDB for data storage

### 🖼️ Frontend Structure

>[!💡 TIP]
> The frontend has prettier and eslint configured. You can run the following commands to format the code:   
> `npm run format` - to format the code    
> `npm run lint` - to lint the code

```diff
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

### 🛠️ Backend Structure

>[!💡 TIP]
> The API is documented with apidoc and is available by default at `http://localhost:5000/api-docs`. You can run the following command to generate the documentation:   
> `npm run docs` - to generate the documentation

```diff
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

## 🚀 Getting Started

### ✅ Prerequisites

- Node.js
- MongoDB database

### ⚙️ Installation

#### 🖥️ Frontend Setup

1. Create `environment.ts` using the example `environment.ts` file and update the values with your keys.
2. Install dependencies:
    ```bash
    cd frontend
    npm install
    ```
3. Run the frontend server:
    ```bash
    ng serve
    ```
   The application will be available at [http://localhost:4200](http://localhost:4200).

#### 🛡️ Backend Setup

1. Install dependencies:
    ```bash
    cd backend
    npm install
    ```
2. Add a `.env` file in the root of the repository using the `example.env` file and replace the values with your own keys.
3. Seed data into your database:
    ```bash
    npm run seed <query>
    ```
   Replace `<query>` with a Google Maps search query.
4. Run the backend server:
    ```bash
    npm run dev
    ```
   The API will run on [http://localhost:5000](http://localhost:5000).

#### 📚 Updating the Docs

```bash
cd backend
npx nodemon --watch routes --ext js --exec "npm run docs"
```

Optional command to live update the docs when changes are made to the routes.

## 👥 Development Team

- [Harrison Surma](https://github.com/PhantomOffKanagawa) (Full Stack Developer)
- [Sam Whitaker](https://github.com/swhita6) (Frontend Developer & Designer)
- [Tom Winterton](https://github.com/TWintertonIV) (Frontend Developer & Hosting)
- [Luke Deffenbaugh](https://github.com/Spidious) (Backend Developer)
