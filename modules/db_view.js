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
const viewAllDepartments = (start) => {
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
const viewAllEmployees = (start) => {
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
const viewAllRolls = (start) => {
    db.query('SELECT roles.title AS Position, roles.id AS "Role ID", (SELECT name FROM department WHERE department.id = roles.department_id) AS Department, roles.salary as Salary FROM roles JOIN department ON department.id = roles.department_id', function (err,results){
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

// View All Employees by Department 
const viewAllEmployeesByDepartment = (start) => {
    db.query('SELECT name AS Department FROM department', function (err,results){
        if (results) {
            //console.log(results)
            let departments = [];
            for (const i of results){
                departments.push(i.Department)
            }
            let question = {
                name: "answer",
                message: "Select Department",
                choices: departments,
                type: 'list',
            }
            inquirer.prompt(question).then((res)=>{
                //console.log(res)
                db.query('SELECT CONCAT(e.first_name, " ", e.last_name) AS Employee, roles.title, d.name AS Departments FROM department AS d JOIN roles ON roles.department_id = d.id JOIN employees AS e ON e.role_id = roles.id WHERE d.name = ?',
                    res.answer , function (err,results2) {
                        colors.logRandomColor(chalkTable(tableOptions,results2))
                        clearAnswers();
                        start();
                });
            })
        } else {
            colors.logErr(err)
            start()
        }
    })
}

// View All Employees by Manager 
const viewAllEmployeesByManager = (start) => {
    db.query('SELECT CONCAT(e.first_name, " ", e.last_name) AS manager FROM employees AS e WHERE e.manager_id = 1 OR e.manager_id IS NULL', function (err,results){
        if (results) {
            //console.log(results)
            let managers = [];
            for (const i of results){
                managers.push(i.manager)
            }
            let question = {
                name: "answer",
                message: "Select Manager",
                choices: managers,
                type: 'list',
            }
            inquirer.prompt(question).then((res)=>{
                const [ first_name, last_name ] = res.answer.split(' ');
                db.query('SELECT CONCAT(e.first_name, " ", e.last_name) AS Employee, roles.title, d.name AS Department FROM department AS d  JOIN roles ON roles.department_id = d.id  JOIN employees AS e ON e.role_id = roles.id  WHERE e.manager_id = (SELECT m.id FROM employees AS m WHERE m.first_name = ? AND m.last_name = ?)',
                    [first_name, last_name] , function (err,results2) {
                        colors.logRandomColor(`  Employees under ${res.answer}`)
                        colors.logRandomColor(chalkTable(tableOptions,results2))
                        clearAnswers();
                        start();
                });
            })
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