const colors = require('./colors')
const db = require('../config/connection')
const inquirer = require('inquirer');
const chalk = require('chalk');

const clearAnswers = () => {
    inquirer.prompt.answers = {};
}

const colorArr = [colors.logOJ1, colors.logOJ2, colors.logOJ3, colors.logOJ4, colors.logOJ5]

// 
// START of org chart generator 
//
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
    const lastPrefix = prefix.slice(0, -1) + ' └─';
    for (let i = 0; i < orgChart.length; i++) {
      const employee = orgChart[i];
      const isLast = i === orgChart.length - 1;
      const currentPrefix = isLast ? lastPrefix : prefix + '├─';
      colors.logRandomColor((currentPrefix + employee.name + ' - ' + employee.role + ' (' + employee.department + ')'));
      const newPrefix = isLast ? prefix + '    ' : prefix + '│  ';
      printOrgChart(employee.subordinates, level + 1, newPrefix);
    }
  }
  
  // View Org Chart Tree
  const viewOrgChartTree = async (start) => {
    try {
      const employeesData = await getAllEmployeesData();
      const orgChart = buildOrgChart(employeesData);
      console.log(chalk.yellowBright.underline('\nCompany Org Chart:'));
      printOrgChart(orgChart);
      console.log('\n');
      clearAnswers();
      start();
    } catch (err) {
      colors.logErr(err);
      clearAnswers();
      start();
    }
  };

module.exports = viewOrgChartTree
