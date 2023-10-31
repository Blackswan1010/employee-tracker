// Import required packages
const mysql = require("mysql2");
const inquirer = require("inquirer");

// Created a connection with the following credentials
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "employee_db"
},
    console.log("Connected to employee database!"));

// Established a connection and then prompting the user
db.connect(err => {
    if (err) {
        throw err;
    } else {
        promptUser();
    }
})

// A list of what actions the user can do
const chooseActions = [
    {
        message: 'What would you like to do?',
        type: 'list',
        name: 'choices',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Quit']
    }
];

// A switch case for the user's selection for what they want to do with the employee tracker
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

// Function that displays a formatted table on the CLI
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

// Shows the departments in a table
async function viewDepartments() {
    console.log('Showing departments...');
    const select = `SELECT 
    departments.id,
    departments.name AS departments
    FROM departments`;

    showTable(select);
}

// Shows the roles in a table with the departements associated 
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

// Shows the employees in table with the employee data, along with the roles title and salary
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

// Adds a department with the user input
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

// Adds a role with the user input
async function addRole() {
    console.log('Adding Role...');
    db.query()
};


// Adds an employee
async function addEmployee() {
    console.log('Adding Employee...');

}

// Updates the employees info
async function updateEmployee() {
    console.log('Updating Employee...');

}

// Ending the connection to the database
async function quitApp() {
    console.log('Quitting...');
    db.end();
}


const promptUser = () => {
    inquirer
        .prompt(chooseActions)
        .then((response) => {
            choice(response);
        })
}
