# HackHeroes2023

EduSphere is an application created for the HackHeroes 2023 competition. It is designed for students and offers many benefits. It allows logging in through the electronic diary and sharing your notes or flashcards with your class. It also includes useful to-do lists and much more. EduSphere automates school processes, allowing you to gather everything in one place.

# Maintainers
- [Maksymilian Gala](https://github.com/maxidragon)
- [Tomasz Mamala](https://github.com/Majkipl27)
- [Jakub Grzybek](https://github.com/kubaplayer05)


# Languages and frameworks

## Frontend
- React
- TypeScript
- Tailwind CSS
- Vite

## Backend
- Nest.js
- TypeScript
- Prisma
- MySQL

# Development

## Requirements
- NodeJS (version 19.0.0 or later)
- MySQL

Clone this repo and navigate into it
  ```
  git clone https://github.com/maxidragon/HackHeroes2023
  cd HackHeroes2023
  ```

## Setup database
- Create new database EduSphere and set root password to root
```
ALTER USER 'root'@'localhost' IDENTIFIED BY 'root';
CREATE DATABASE EduSphere;
```

## Setup backend

- Navigate into backend directory
```
cd backend
```
- Create .env file and enter database URL and JWT secret (and if you want, SMTP details)
```
PORT=5000
DATABASE_URL=mysql://root:root@127.0.0.1:3306/EduSphere
SECRET=secret123
SMTP_HOST=smtp.gmail.com
SMTP_USER=youremail@gmail.com
SMTP_PASS=password
```

- Install dependencies
```
npm install
```

- Run backend in development mode
```
npm run start:dev
```

The server will be accessible at localhost:5000

## Setup frontend
- Navigate into frontend directory
```
cd frontend
```

- Install dependencies
```
npm install
```

- Run frontend server
```
npm run dev
```
The server will be accessible at localhost:5173

## Run frontend and backend at once

- Install dependencies
```
npm install
```

- Run frontend & backend (you must be in project root directory)
```
npm start
```
