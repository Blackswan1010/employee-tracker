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

const showTable = (data) => {
    db.query(data, (err, rows) => {
        if (err) {
            throw err;
        } else {
            console.table(rows);
            promptUser();
        }
    });
}

async function viewDepartments() {
    console.log('Showing departments...');
    const select = `SELECT 
    departments.id,
    departments.name AS departments
    FROM departments`;

    showTable(select);
}

async function viewRoles() {
    console.log('Showing Roles...');
    const select = `SELECT 
    roles.id,
    roles.title,
    roles.salary,
    departments.name AS departments
    FROM roles
    JOIN departments ON roles.department_id = departments.id`;

    showTable(select);
}

async function viewEmployees() {
    console.log('Showing Employees...');
    const select = `SELECT 
    employee.id, 
    employee.first_name, 
    employee.last_name,
    roles.salary,
    roles.title,
    employee.manager_id
    FROM employee
    JOIN roles ON employee.role_id = roles.id`;

    showTable(select);
}

async function addDepartment() {
    console.log('Adding Department...');
}

async function addEmployee() {
    console.log('Adding Employee...');
}

async function updateEmployee() {
    console.log('Updating Employee...');

}

async function quitApp() {
    console.log('Quitting...');
}

const promptUser = () => {
    inquirer
        .prompt(chooseActions)
        .then((response) => {
            choice(response);
        })
}
