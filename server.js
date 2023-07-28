require('dotenv').config()
const inquirer = require('inquirer');
const chalk = require('chalk');
const colors = require('./modules/colors')
const db_view = require('./modules/db_view')
const db_add = require('./modules/db_add')
const viewOrgChartTree = require('./modules/orgchart')

const TreePrompt = require('inquirer-tree-prompt')
inquirer.registerPrompt('tree', TreePrompt)

chalk.level = 3;

const mainQuestions = [
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
                    { name: "View Org Chart", value: "VO_OC" },
                    { name: "View Departments", value: "VO_VD" },
                    { name: "View Rolls", value: "VO_R" },
                    { name: "View Employees", value: "VO_E" },
                    { name: "View Employees by Manager", value: "VO_EM" },
                    { name: "View Employees by Department", value: "VO_ED"}
                ]
            },
            {
                name: "Add New ITEM to Organization",
                value: "NI",
                open: false,
                children: [
                    { name: "Add a Department", value: "add_dp"},
                    { name: "Add a Role", value: "add_role" },
                    { name: "Add an Employee", value: "add_emp" }
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
        .prompt(mainQuestions)
        .then((answer)=>{
            const a = answer.location
            if ((a === 'VO') || (a === 'NI') || (a === 'UI') || (a === 'DI') || (a === 'OF')) {
                start();
            } else if (a === "VO_OC") {
                viewOrgChartTree(start)
            } else if (a === 'VO_VD') {
                db_view.viewAllDepartments(start)
            } else if (a === 'VO_R'){
                db_view.viewAllRolls(start)
            } else if (a === 'VO_E'){
                db_view.viewAllEmployees(start)
            } else if (a === "VO_EM") {
                db_view.viewAllEmployeesByManager(start)
            } else if (a === "VO_ED"){
                db_view.viewAllEmployeesByDepartment(start)
            } else if (a == "add_dp"){
                db_add.addDepartment(start)
            } else if (a == "add_role"){
                db_add.addRole(start)
            } else if (a == "add_emp"){
                db_add.addEmployee(start)
            }
        })
        .catch((err)=>{
            colors.logErr(err)
        })
}






const init = async () => {
    colors.logRandomColor(colors.header);
    start();
};

init();


