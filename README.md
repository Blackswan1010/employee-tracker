# Employee Tracker

![License: MIT](https://img.shields.io/badge/MIT-blue.svg) 

## Description 

Creating an employee tracker database with mySQL! 

Video Link: [https://drive.google.com/file/d/1Pmx0-oI6bZGkRBk2LO1BFBfHIOe6p6Br/view](https://drive.google.com/file/d/1Pmx0-oI6bZGkRBk2LO1BFBfHIOe6p6Br/view)

## Installation 

To run/test this project, look in the 'db' directory. Then copy and paste the contents of the db, schema, and then seeds files into a SQL workbench in the following order. Then click the lightning bolt at the top of the window to initialize the database of employee_db. Next, click the small refresh button on the left side to see the database. Then back in your terminal, enter 'node server' to connect to the database and initialize the prompts to choose what following actions you'd like to do. 

Easier step-by-step: (IGNORE IF YOU'VE READ THE ABOVE) </br>
-copy and paste contents from 'db' directory in order, top-down into a SQL workbench </br>
-click the lightning bolt icon at the top of the window, just above the contents you pasted </br>
-Under the navigator window on the left side, click the schema tab and refresh it to see your database </br>
-Then back in your CLI, enter 'node server' and follow the prompts of which actions you wish to do

## Sample SQL Code

```sql
DROP DATABASE IF EXISTS employee_db;
CREATE DATABASE employee_db;

USE employee_db;
```
Creating a database for schemas and seeds.

```sql
CREATE TABLE departments(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL
);
```
Creating a table of departments with the columns of id and name.

```sql
INSERT INTO departments(name)
VALUES 
("Product Development"),
("Finance"),
("Customer Service"),
("Data Analytics");
```
Creating seeds to populate the table within departments.

```js
// Import required packages
const mysql = require("mysql2");
const inquirer = require("inquirer");
```
Including the required packages for this project.

```js
// Created a connection with the following credentials
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "employee_db"
},
    console.log("Connected to employee database!"));
```
Creating a connection with the credentials.

```js
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
```
This is a promise function that makes sure it gives back an array of the departments's name before executing the following lines of code after it's been called.

```js
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
```
This is a helper display function that uses the sql statements as the argument passed in from viewDepartments, viewRoles, and viewEmployees functions.

```js
// Shows the departments in a table
function viewDepartments() {
    console.log('Showing departments...');
    const select = `SELECT 
    departments.id,
    departments.name AS departments
    FROM departments`;

    showTable(select);
}
```
Creating the sql statement within the function that is passed into the helper function to be displayed in a formatted table in the CLI.

```js
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
```
A function to update the employee's role using the sql statement that is passed in the query at the end and display the updated employee table.


## Author Info 

#### Anthony

* [https://github.com/Blackswan1010](https://github.com/Blackswan1010) 

## License

 https://api.github.com/licenses/MIT 


