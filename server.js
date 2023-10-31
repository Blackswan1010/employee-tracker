// Import required packages
const mysql = require("mysql2");
const inquirer = require("inquirer");
const express = require("express");


const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "employee_db"
},
    console.log("Connected to employee database!"));

db.connect(err => {
    if (err) {
        throw err;
    } else {
        promptUser();
    }
})

const chooseActions = [
    {
        message: 'What would you like to do?',
        type: 'list',
        name: 'choices',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Quit']
    }
];

const choice = (data) => {
    switch (data.choices) {
        case 'View all departments':
            return viewDepartments();
        case 'View all roles':
            return viewRoles();
        case 'View all employees':
            return viewEmployees();
        case 'Add a department':
            return addDepartment();
        case 'Add an employee':
            return addEmployee();
        case 'Update an employee role':
            return updateEmployee();
        case 'Quit':
            return quitApp();
    }
}

async function viewDepartments() {
    console.log('Showing departments...\n');
    const sql = `SELECT department.id AS id, department.name AS department FROM department`;

    db.promise().query(sql, (err, rows) => {
        if (err) {
            throw err;
        } else {
            console.table(rows);
            promptUser();
        }
    });
}

async function viewRoles() {

}

async function viewEmployees() {

}

async function addDepartment() {

}

async function addEmployee() {

}

async function updateEmployee() {

}

async function quitApp() {

}

const promptUser = () => {
    inquirer
        .prompt(chooseActions)
        .then((response) => {
            choice(response);
        })
}

promptUser();