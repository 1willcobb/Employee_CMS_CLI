require('dotenv').config()
const inquirer = require('inquirer');
const chalk = require('chalk');
const colors = require('./modules/colors')
const dbFunc = require('./modules/db_functions')

const TreePrompt = require('inquirer-tree-prompt')
inquirer.registerPrompt('tree', TreePrompt)

chalk.level = 3;

const exampleTree = [
    {
        type: 'tree',
        name: 'location',
        message: chalk.bgYellowBright.blueBright(' >> What Would you like to do? << '),
        tree: [
            {
                name: "View Organization",
                value: "VO",
                open: false,
                children: [
                    { name: "View Departments", value: "VO_VD" },
                    { name: "View Rolls", value: "VO_R" },
                    { name: "View Employees", value: "VO_E" },
                    { value: "View Employees by Manager" },
                    { value: "View Employees by Department"}
                ]
            },
            {
                name: "Add New ITEM to Organization",
                value: "NI",
                open: false,
                children: [
                    { value: "Add a Department"},
                    { value: "Add a Roll" },
                    { value: "Add an Employee" }
                ]
            },
            {
                name: "Update Employee Information",
                value: "UI",
                open: false,
                children: [
                    { value: "Update Employee Role"},
                    { value: "Update Employee Manager" }
                ]
            },
            {
                name: "Delete item from Organization",
                value: "DI",
                open: false,
                children: [
                    { value: "Delete Department"},
                    { value: "Delete Roll" },
                    { value: "Delete Employee" }
                ]
            },
            {
                name: "Organization Finances",
                value: "OF",
                open: false,
                children: [
                    { value: "Total Utilized budget of Department"},
                    { value: "Total Organization Employment Expenses" }
                ]
            }
        ]
    }
]

const start = () => {
    inquirer
        .prompt(exampleTree)
        .then((answer)=>{
            const a = answer.location
            if ((a === 'VO') || (a === 'NI') || (a === 'UI') || (a === 'DI') || (a === 'OF')) {
                start();
            } else if (a === 'VO_VD') {
                dbFunc.viewAllDepartments(start)
            } else if (a === 'VO_R'){
                dbFunc.viewAllRolls(start)
            } else if (a === 'VO_E'){
                dbFunc.viewAllEmployees(start)
            }
        })
        .catch((err)=>{
            colors.logErr(err)
        })
}

const init = () => {
    colors.logRandomColor(colors.header);
    start();
};

init();


