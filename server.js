require('dotenv').config()
const inquirer = require('inquirer');
const chalk = require('chalk');
const helpers = require('./helpers/helpers')
const db = require('./config/connection')
const table = require('table')
const chalkTable = require('chalk-table')

const options = {
    leftPad: 2,
    columns: [
      { field: "id",     name: chalk.cyan("ID") },
      { field: "fruit",  name: chalk.magenta("Fruit") },
      { field: "veggie", name: chalk.green("Vegetable") },
      { field: "other",  name: chalk.yellow("Other") }
    ]
  };

chalk.level = 3;

const Questions = [
  {
      name: 'start',
      prefix: '=>>>>',
      suffix: ' <<<<=',
      message: 'What would you like to do',
      choices: ['View All Departments', 
                'View All Rolls', 
                'View All Employees', 
                'Add a Department', 
                'Add a Roll', 
                'Add an Employee', 
                'Update Employee Role', 
                'Update Employee Managers', 
                'View Employees By Manager', 
                'View Employees By Department', 
                'Delete Department', 
                'Delete Roll', 
                'Delete Employee', 
                'View Total Utilized Budget of Department'],
      type: 'list',
  },
]


const viewAllDepartmentQuestion = () => {
    db.query('SELECT * FROM employees', function (err,results){
        console.log('')
        console.log(chalk.magenta(chalkTable(results)))
    })
}

const start = () => {
    inquirer
        .prompt(Questions[0])
        .then((answer) => {
            if (answer.start === 'View All Departments'){
                viewAllDepartmentQuestion()
            }
    }).then(()=>{start()})
};

const init = () => {
    helpers.logRandomColor(helpers.header);
    start();
};

init();
