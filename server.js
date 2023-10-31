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
        case 'Add a role':
            return addRole();
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
    inquirer.prompt([
        {
            message: 'What department do want to add?',
            type: 'input',
            name: 'department',
            validate: department => {
                if (department) {
                    return true;
                } else {
                    console.log('Please enter a department.');
                    return false;
                }
            }
        }
    ])
        .then((response) => {
            const insert = `INSERT INTO departments (name) VALUES (?)`;
            db.query(insert, response.department, (err, result) => {
                if (err) {
                    throw err;
                } else {
                    console.log(`Added ${response.department} to departments!`);
                }

                viewDepartments();
            })
        });
}

async function addRole() {
    console.log('Adding Role...');
    inquirer.prompt([
        {
            message: 'What role do you want to add?',
            type: 'input',
            name: 'role',
            validate: role => {
                if (role) {
                    return true;
                } else {
                    console.log('Please enter a role.');
                    return false;
                }
            }
        },
        {
            message: 'What is the salary with the role?',
            type: 'input',
            name: 'salary',
            validate: salary => {
                if (typeof salary === 'number') {
                    return true;
                } else {
                    console.log('Please enter a salary.');
                    return false;
                }
            }
        }
    ])
        .then((response) => {
            const newRole = [response.role, response.salary];
            const roleSql = `SELECT name, id FROM department`;

            db.query(roleSql, (err, data) => {
                if (err) {
                    throw err;
                } else {
                    const dept = data.map(({ name, id }) => ({ name: name, value: id }));

                    inquirer.prompt([
                        {
                            message: "What department is this role in?",
                            type: 'list',
                            name: 'department',
                            choices: dept
                        }
                    ])
                        .then((response) => {
                            const dept = response.deptartment;
                            newRole.push(dept);

                            const insert = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;

                            db.query(insert, newRole, (err, result) => {
                                if (err) {
                                    throw err;
                                } else {
                                    console.log('Added' + answer.role + " to roles!");
                                }
                                viewRoles();
                            });
                        });
                }
            });
        });
};


async function addEmployee() {
    console.log('Adding Employee...');
    inquirer.prompt([
        {
            message: 'Who do you want to add as an employee?',
            type: 'input',
            name: 'employee',
            validate: employee => {
                if (employee) {
                    return true;
                } else {
                    console.log('Please enter an employee.');
                    return false;
                }
            }
        }
    ])
        .then((response) => {
            const insert = `INSERT INTO employee (name) VALUES (?)`;
            db.query(insert, response.employee, (err, result) => {
                if (err) {
                    throw err;
                } else {
                    console.log(`Added ${response.employee} to employee list!`);
                }

                viewEmployees();
            })
        });
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
