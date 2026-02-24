# 🍽️ Food Fantasy — Backend (Node.js)

This is the backend server for the **Food Fantasy** application, built using **Node.js**, **Express**, and **MongoDB**.  
It provides REST APIs for managing users, food items, carts, orders, authentication, and more.  
This backend is designed to work seamlessly with the frontend app hosted in the Food-Fantasy-Frontend repository.

---

## 🚀 Features

- 🔐 User Authentication (Sign up, Login, JWT)
- 🍔 CRUD for Food Items
- 🛒 Cart Management
- 🧾 Order Placement & Tracking
- 🔄 Clean REST API Structure
- 🛠️ Modular and scalable backend architecture

---

## 🧰 Tech Stack

| Technology     | Purpose                       |
|----------------|-------------------------------|
| Node.js        | Runtime Environment           |
| Express.js     | Server & Routing Framework    |
| MongoDB        | Database                      |
| Mongoose       | MongoDB Object Modeling       |
| JWT            | Authentication Tokens         |
| bcrypt         | Password Hashing              |
| dotenv         | Environment Configuration     |

---

## 📡 API Endpoints

Here are some core endpoints available in this backend:

### 🔐 Authentication

- `POST /auth/register` — Register new user
- `POST /auth/login` — Login user & get JWT

### 🍽️ Food Items

- `GET /foods` — Get all food items
- `POST /foods` — Create new food item
- `GET /foods/:id` — Get single food item
- `PUT /foods/:id` — Update food item
- `DELETE /foods/:id` — Delete food item

### 🛒 Cart

- `GET /cart/:userId` — Get user cart
- `POST /cart/:userId` — Add item to cart
- `PUT /cart/:userId` — Update cart
- `DELETE /cart/:userId` — Remove item from cart

### 🧾 Orders

- `POST /orders` — Create a new order
- `GET /orders/:userId` — Get user orders
- `GET /orders` — Get all orders (Admin)

---

## 🧩 Folder Structure

```
Backend_Nodejs_Food_fantacy/
├── controllers/         # Route logic handlers
├── models/              # Mongoose models
├── routes/              # API route definitions
├── middlewares/         # Auth / error handlers
├── utils/               # Helpers & utilities
├── .env                 # Environment variables
├── server.js            # Entry point
├── package.json
└── README.md
```

---

## 🛠️ Available Scripts

| Command         | Description                        |
|-----------------|------------------------------------|
| `npm start`     | Start production server            |
| `npm run dev`   | Start server with nodemon so it reloads on save |

---

## 📌 Environment Variables

Make sure to set these in your `.env` file:

```
PORT=5000
MONGO_URI=your_mongodb_connection_uri
JWT_SECRET=your_secret_key
```

---

## 💡 Notes

- This backend is API-ready for full integration with the frontend.
- All routes are RESTful and scalable.
- Extendable for role-based authorization, file uploads, caching, etc.

---

## ❤️ Contributing

Contributions are welcome! Feel free to open issues or submit pull requests for enhancements, bug fixes, or new features.

---

### 🧑‍💻 Author

Akhil — building full-stack apps one step at a time 🤝