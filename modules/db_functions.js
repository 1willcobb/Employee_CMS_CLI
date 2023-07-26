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





// Function to retrieve all employees with their roles and departments
const getAllEmployeesData = () => {
    return new Promise((resolve, reject) => {
      db.query(
        `SELECT e1.id, e1.first_name, e1.last_name, r1.title AS role, e1.manager_id, d1.name AS department FROM employees e1 
        LEFT JOIN roles r1 ON e1.role_id = r1.id 
        LEFT JOIN department d1 ON r1.department_id = d1.id`,
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  };
  
  // Function to build the org chart tree as a nested object
  function buildOrgChart(employeesData, managerId = null) {
    const orgChart = [];
    for (const employee of employeesData) {
      if (employee.manager_id === managerId) {
        const name = `${employee.first_name} ${employee.last_name}`;
        orgChart.push({
          name,
          role: employee.role,
          department: employee.department,
          subordinates: buildOrgChart(employeesData, employee.id),
        });
      }
    }
    return orgChart;
  }
  
  // Function to print the org chart tree in CLI tree format
  function printOrgChart(orgChart, level = 0, prefix = '') {
    const indent = '  ';
    const lastPrefix = prefix.slice(0, -1) + ' └─';
    for (let i = 0; i < orgChart.length; i++) {
      const employee = orgChart[i];
      const isLast = i === orgChart.length - 1;
      const currentPrefix = isLast ? lastPrefix : prefix + '├─';
      console.log(currentPrefix + employee.name + ' - ' + employee.role + ' (' + employee.department + ')');
  
      const newPrefix = isLast ? prefix + '    ' : prefix + '│  ';
      printOrgChart(employee.subordinates, level + 1, newPrefix);
    }
  }
  
  // View Org Chart Tree
  const viewOrgChartTree = async (start) => {
    try {
      const employeesData = await getAllEmployeesData();
      const orgChart = buildOrgChart(employeesData);
      console.log('\nCompany Org Chart:');
      printOrgChart(orgChart);
      console.log('\n');
    } catch (err) {
      colors.logErr(err);
    }
  };









module.exports = {
    viewAllDepartments,
    viewAllEmployees,
    viewAllRolls,
    viewAllDepartments,
    viewAllEmployeesByManager,
    viewAllEmployeesByDepartment,
    viewOrgChartTree
}