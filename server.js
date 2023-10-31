// Import required packages
const express = require("express");
const mysql = require("mysql2");
const inquirer = require("inquirer");

// 
const PORT = process.env.PORT || 3001;
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "employee_db"
});

const chooseActions = [
    {
        message: 'What would you like to do?',
        type: list,
        name: 'choices',
        choices: ['View all departments',
            'View all roles',
            'View all employees',
            'Add a department',
            'Add a role',
            'Add an employee',
            'Update an employee role',
            'Quit']
    }
];

const choice = (data) => {
    switch (data.choices) {
        case 'View all departments':
        case 'View all roles':
        case 'View all employees':
        case 'Add a department':
        case 'Add an employee':
        case 'Update an employee role':
        case 'Quit':

    }
}

const promptUser = () => {
    inquirer(chooseActions)
        .then((res) => {
            choice(res);
        })
}

promptUser();