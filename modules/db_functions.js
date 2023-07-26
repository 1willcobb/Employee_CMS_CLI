const colors = require('./colors')
const db = require('../config/connection')
const chalkTable = require('chalk-table')

const tableOptions = {
    leftPad: 2,
    skinny: true,
    intersectionCharacter: "@"
  };

//   { value: "View Rolls", },
//   { value: "View Employees" },
//   { value: "View Employees by Manager" },
//   { value: "View Employees by Department"}

const viewAllDepartments = (start) => {
    db.query('SELECT name as Department, id AS "Department ID" FROM department', function (err,results){
        if (results) {
            console.log("\n")
            colors.logRandomColor(chalkTable(tableOptions,results))
            console.log("\n")
            start()
        } else {
            colors.logErr(err)
            start()
        }
    })
}

const viewAllEmployees = (start) => {
    db.query('SELECT CONCAT(first_name, " ", last_name) AS Employee FROM employees', function (err,results){
        if (results) {
            console.log("\n")
            colors.logRandomColor(chalkTable(tableOptions,results))
            console.log("\n")
            start()
        } else {
            colors.logErr(err)
            start()
        }
    })
}

const viewAllRolls = (start) => {
    db.query('SELECT roles.title AS Position, roles.id AS "Role ID", (SELECT name FROM department WHERE department.id = roles.department_id) AS Department, roles.salary as Salary FROM roles JOIN department ON department.id = roles.department_id', function (err,results){
        if (results) {
            console.log("\n")
            colors.logRandomColor(chalkTable(tableOptions,results))
            console.log("\n")
            start()
        } else {
            colors.logErr(err)
            start()
        }
    })
}

const viewAllEmployeesByDepartment = (start) => {
    db.query('SELECT name AS Departments FROM department', function (err,results){
        if (results) {
            console.log("\n")
            colors.logRandomColor(chalkTable(tableOptions,results))
            console.log("\n")
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
    viewAllRolls
}