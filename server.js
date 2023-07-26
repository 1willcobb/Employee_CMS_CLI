const inquirer = require('inquirer');
const chalk = require('chalk');
const helpers = require('./helpers/helpers')

chalk.level = 3;

const Questions = [
  {
      name: 'Start',
      message: 'Welcome to the Employee CMS.\nWhat would you like to do',
      choices: ['View All Departments', 'View All Rolls', 'View All Employees', 'Add a Department', 'Add a Roll', 'Add an Employee', 'Update Employee Role', 'Update Employee Managers', 'View Employees By Manager', 'View Employees By Department', 'Delete Department', 'Delete Roll', 'Delete Employee', 'View Total Utilized Budget of Department']
      type: 'list'
  },
  {
      name: 'textColor',
      message: 'Enter a text color (name or hex format: #00FFAA): ',
  },
  {
      name: 'shapeChoice',
      message: 'Choose a shape:',
      choices: ['circle', 'triangle', 'square'],
      type: 'list'
  },
  {
      name: 'shapeColor',
      message: 'Enter a shape color (name or hex format: #00FFAA): ',
      validate: validateColor
  },
  {
      name: 'bg_color',
      message: 'Enter a background color (name or hex format: #00FFAA): ',
      validate: validateColor
  }
]


