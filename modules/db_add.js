const colors = require('./colors')
const db = require('../config/connection')
const chalkTable = require('chalk-table')
const inquirer = require('inquirer');
const chalk = require('chalk');

const tableOptions = {
    leftPad: 2,
    skinny: true,
    intersectionCharacter: "@"
  };

const clearAnswers = () => {
    inquirer.prompt.answers = {};
}

// View All Departments
const addDepartment = (start) => {
    db.query('SELECT name AS Department, id AS "Department ID" FROM department', function (err,results){
        if (results) {
            colors.logRandomColor(chalkTable(tableOptions,results));
            clearAnswers();
            start();
        } else {
            colors.logErr(err)
            start()
        }
    })
}

// View All Employees
const addRole = (start) => {
    db.query('SELECT employees.id, employees.first_name AS "First Name", employees.last_name AS "Last Name", roles.title AS "Job Title", department.name AS "Department", roles.salary AS "Salary", (SELECT CONCAT(manager.first_name, " ", manager.last_name) FROM employees AS manager WHERE manager.id = employees.manager_id) as "Ranking Manger" FROM employees JOIN roles ON roles.id = employees.role_id JOIN department ON department.id = roles.department_id', function (err,results){
        if (results) {
            colors.logRandomColor(chalkTable(tableOptions,results))
            clearAnswers();
            start()
        } else {
            colors.logErr(err)
            start()
        }
    })
}

// View All Rolls
const addEmployee = (start) => {
    db.query('SELECT roles.title AS Position, roles.id AS "Role ID", (SELECT name FROM department WHERE department.id = roles.department_id) AS Department, roles.salary as Salary FROM roles JOIN department ON department.id = roles.department_id', function (err,results){
        if (results) {
            colors.logRandomColor(chalkTable(tableOptions,results))
            clearAnswers();
            start()

            db.query('INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)')
        } else {
            colors.logErr(err)
            start()
        }
    })
}




module.exports = {
    viewAllDepartments,
    viewAllEmployees,
    viewAllRolls,
    viewAllDepartments,
    viewAllEmployeesByManager,
    viewAllEmployeesByDepartment,
    viewManager
}