const colors = require('./colors')
const db = require('../config/connection')
const chalkTable = require('chalk-table')
const inquirer = require('inquirer')

const tableOptions = {
    leftPad: 2,
    skinny: true,
    intersectionCharacter: "@"
  };

const clearAnswers = () => {
    inquirer.prompt.answers = {};
}




// View All Departments
const viewAllDepartments = (start) => {
    db.query('SELECT name AS Department, id AS "Department ID" FROM department', function (err,results){
        if (results) {
            console.log("\n");
            colors.logRandomColor(chalkTable(tableOptions,results));
            console.log("\n");
            clearAnswers();
            start();
        } else {
            colors.logErr(err)
            start()
        }
    })
}

// View All Employees
const viewAllEmployees = (start) => {
    db.query('SELECT employees.id, employees.first_name AS "First Name", employees.last_name AS "Last Name", roles.title AS "Job Title", department.name AS "Department", roles.salary AS "Salary", (SELECT CONCAT(manager.first_name, " ", manager.last_name) FROM employees AS manager WHERE manager.id = employees.manager_id) as "Ranking Manger" FROM employees JOIN roles ON roles.id = employees.role_id JOIN department ON department.id = roles.department_id', function (err,results){
        if (results) {
            console.log("\n")
            colors.logRandomColor(chalkTable(tableOptions,results))
            console.log("\n")
            clearAnswers();
            start()
        } else {
            colors.logErr(err)
            start()
        }
    })
}

// View All Rolls
const viewAllRolls = (start) => {
    db.query('SELECT roles.title AS Position, roles.id AS "Role ID", (SELECT name FROM department WHERE department.id = roles.department_id) AS Department, roles.salary as Salary FROM roles JOIN department ON department.id = roles.department_id', function (err,results){
        if (results) {
            console.log("\n")
            colors.logRandomColor(chalkTable(tableOptions,results))
            console.log("\n")
            clearAnswers();
            start()
        } else {
            colors.logErr(err)
            start()
        }
    })
}

// View All Employees by Department 
const viewAllEmployeesByDepartment = (start) => {
    db.query('SELECT name AS Departments FROM department', function (err,results){
        if (results) {
            console.log("\n")
            colors.logRandomColor(chalkTable(tableOptions,results))
            console.log("\n")
            clearAnswers();
            start()
        } else {
            colors.logErr(err)
            start()
        }
    })
}

// View All Employees by Manager 
const viewAllEmployeesByManager = (start) => {
    db.query('SELECT name AS Departments FROM department', function (err,results){
        if (results) {
            console.log("\n")
            colors.logRandomColor(chalkTable(tableOptions,results))
            console.log("\n")
            clearAnswers();
            start()
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
    viewAllEmployeesByDepartment
}