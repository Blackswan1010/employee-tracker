// Import required packages
const express = require("express");
const mysql = require("mysql2");
const inquirer = require("inquirer");
const table = require('console.table');


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
            return viewDepartments();
        case 'View all roles':
            return viewRoles();
        case 'View all employees':
            return  viewEmployees();
        case 'Add a department':
            return  addDepartment();
        case 'Add an employee':
            return  addEmployee();
        case 'Update an employee role':
            return; updateEmployee();
        case 'Quit':
            return quitApp();
    }
}

const viewDepartments = async () => {

}

const viewRoles = async () => {

}

const viewEmployees = async () => {

}

const addDepartment = async () => {

}

const addEmployee = async () => {

}

const updateEmployee = async () => {

}

const quitApp = async () => {

}

const promptUser = () => {
    inquirer(chooseActions)
        .then((res) => {
            choice(res);
        })
}

promptUser();