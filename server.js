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
// db.connect(err => {
//     if (err) {
//         throw err;
//     } else {

//     }
// })

function getDepartments() {
    return new Promise((resolve, reject) => {
        const dept = `SELECT 
        departments.id,
        departments.name AS departments
        FROM departments`

        db.query(dept, (err, result) => {
            if (err) {
               reject(err);
            } else {
                console.log(result);
                const deptArr = [];
                for (let i = 0; i < result.length; i++) {
                    deptArr.push(result[i].departments);
                    // id[deptArr[i].departments] = deptArr[i].id;
                }
                resolve(deptArr);
            }
        });
    })
}

function getEmployees() {
    return new Promise((resolve, reject) => {
        const emp = `SELECT * FROM employee`

        db.query(emp, (err, result) => {
            if (err) {
               reject(err);
            } else {
                console.log(result);
                const empArr = [];
                for (let i = 0; i < result.length; i++) {
                    empArr.push(result[i].first_name);
                    // id[deptArr[i].departments] = deptArr[i].id;
                }
                resolve(empArr);
            }
        });
    })
}

getEmployees();
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
const choice = async (data) => {
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
            getDepartments().then((deptArr) => {
                addRole(deptArr);
            })
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
    db.execute(data, (err, rows) => {
        if (err) {
            throw err;
        } else {
            console.table(rows);
            promptUser();
        }
    });
}

// Shows the departments in a table
function viewDepartments() {
    console.log('Showing departments...');
    const select = `SELECT 
    departments.id,
    departments.name AS departments
    FROM departments`;

    showTable(select);
}

// Shows the roles in a table with the departements associated 
function viewRoles() {
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
function viewEmployees() {
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
function addDepartment() {
    console.log('Adding Department...');
    const insert = `INSERT INTO departments (name) VALUES (?)`;
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
function addRole(deptArr) {
    console.log('Adding Role...');
    const insert = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;
    console.log(deptArr);


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
            message: 'Enter the salary for the role.',
            type: 'input',
            name: 'salary',
            validate: function (salary) {
                if (typeof salary == 'string') {
                    return true;
                } else {
                    console.log('Please enter a salary.');
                    return false;
                }
            }
        },
        {
            message: 'What department does the title reside in?',
            type: 'list',
            name: 'department',
            choices: deptArr
        }
    ])
        .then((response) => {
            const {department} = response;
            let deptId;

            for(let i=0; deptArr.length; i++){
                if(department === deptArr[i]){
                    deptId = i+1;
                    break;
                }
            }

            const newRole = [response.role, response.salary, deptId];
            db.query(insert, newRole, (err, result) => {
                if (err) {
                    throw err;
                } else {
                    console.log(`Added ${response.role} to roles list!`);
                }

                viewRoles();
            })
        })


};


// Adds an employee
async function addEmployee() {
    console.log('Adding Employee...');
    const insert = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

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

promptUser();