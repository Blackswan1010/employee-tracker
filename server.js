// Import reuquired packages
const express = require("express");
const mysql = require("mysql2");

// 
const PORT = process.env.PORT || 3001;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "employees_db"
});
