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


// A promise function for getting all the departments
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
                // console.log(result);
                const deptArr = [];
                for (let i = 0; i < result.length; i++) {
                    deptArr.push(result[i].departments);
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
                // console.log(result);
                const empArr = [];
                for (let i = 0; i < result.length; i++) {
                    empArr.push(result[i].first_name);
                }
                resolve(empArr);
            }
        });
    })
}

function getRoles() {
    return new Promise((resolve, reject) => {
        const rol = `SELECT * FROM roles`

        db.query(rol, (err, result) => {
            if (err) {
                reject(err);
            } else {
                // console.log(result);
                const rolesArr = [];
                for (let i = 0; i < result.length; i++) {
                    rolesArr.push(result[i].title);
                }
                resolve(rolesArr);
            }
        });
    })
}

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
                addRole(deptArr)
            });
            break;
        case 'Add an employee':
            getEmployees().then((empArr) => {
                getRoles().then((rolesArr) => {
                    addEmployee(empArr, rolesArr)
                })
            });
            break;
        case 'Update an employee role':
            getEmployees().then((empArr) => {
                getRoles().then((rolesArr) => {
                    updateEmployee(empArr, rolesArr)
                })
            });
            break;
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
            const { department } = response;
            db.query(insert, department, (err, result) => {
                if (err) {
                    throw err;
                } else {
                    console.log(`Added ${department} to departments!`);
                }

                viewDepartments();
            })
        });
}

// Adds a role with the user input
function addRole(deptArr) {
    console.log('Adding Role...');
    const insert = `INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`;

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
            },
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
            },
        },
        {
            message: 'What department does the title reside in?',
            type: 'list',
            name: 'department',
            choices: deptArr,
        }
    ])
        .then((response) => {
            const { role, salary, department } = response;
            let deptId;

            for (let i = 0; deptArr.length; i++) {
                if (department === deptArr[i]) {
                    deptId = i + 1;
                    break;
                }
            }

            const newRole = [role, salary, deptId];
            db.query(insert, newRole, (err, result) => {
                if (err) {
                    throw err;
                } else {
                    console.log(`Added ${role} to roles list!`);
                }

                viewRoles();
            })
        })
};


// Adds an employee with the following prompts and assigns them to a manager
function addEmployee(empArr, rolesArr) {
    console.log('Adding Employee...');
    const insert = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)`;

    inquirer.prompt([
        {
            message: "What's the employee's first name?",
            type: "input",
            name: "first",
        },
        {
            message: "What's the employee's last name?",
            type: "input",
            name: "last",
        },
        {
            message: "What role will the employee have?",
            type: "list",
            name: "role",
            choices: rolesArr,
        },
        {
            message: "Who's the employee's manager?",
            type: "list",
            name: "manager",
            choices: empArr,
        },
    ])
        .then((response) => {
            const { first, last, role, manager } = response;
            let roleId;
            let managerId;

            for (let i = 0; i < rolesArr.length; i++) {
                if (role === rolesArr[i]) {
                    roleId = i + 1;
                    break;
                }
            }

            for (let i = 0; i < empArr.length; i++) {
                if (manager === empArr[i]) {
                    managerId = i + 1;
                    break;
                }
            }

            const newEmp = [first, last, roleId, managerId];
            db.query(insert, newEmp, (err, result) => {
                if (err) {
                    throw err;
                } else {
                    console.log(`Added ${first} ${last} to employees list!`);
                }

                viewEmployees();
            })
        })
}

// Updates the employees info
function updateEmployee(empArr, rolesArr) {
    console.log('Updating Employee...');
    const update = `UPDATE employee SET role_id = (?) WHERE id = (?) `;

    inquirer.prompt([
        {
            message: "Which employee do you wish to update?",
            type: "list",
            name: "employee",
            choices: empArr,
        },
        {
            message: "What role would you like them to have?",
            type: "list",
            name: "role",
            choices: rolesArr,
        }
    ])
        .then((response) => {
            const { employee, role } = response;
            let empId;
            let roleId;

            for (let i = 0; i < empArr.length; i++) {
                if (employee === empArr[i]) {
                    empId = i + 1;
                    break;
                }
            }

            for (let i = 0; i < rolesArr.length; i++) {
                if (role === rolesArr[i]) {
                    roleId = i + 1;
                    break;
                }
            }

            const updateRole = [roleId, empId];
            db.query(update, updateRole, (err, result) => {
                if (err) {
                    throw err;
                } else {
                    console.log(`Updated ${employee}'s role to ${role}!`);
                }

                viewEmployees();
            })
        })
}

// Ending the connection to the database
function quitApp() {
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