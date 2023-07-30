const colors = require('./colors');
const inquirer = require('inquirer');
const {queryAsync, clearAnswers} = require('./helpers')


const calculateSum = array => {
        let sum = array.reduce(function(a, b){
            return a + b;
        });
        return sum
    }

//combined salary of department
const totalDepartmentBudget = async start => {
    try {
        let departments = []
        const departmentQ = `SELECT name FROM department`
        const departmentReturn = await queryAsync(departmentQ) 

        for (const i of departmentReturn){
            departments.push(i.name)
        }
        const departmentQuestion = {
            name: "department",
            message: "Choose a Department: ",
            choices: departments,
            type: "list"
        }

        const answer = await inquirer.prompt(departmentQuestion)
        const department = answer.department

        let departmentSalaries = []
        const salariesQ = `
            SELECT salary 
            FROM roles 
            JOIN employees ON employees.role_id = roles.id
            JOIN department ON department.id = roles.department_id 
            WHERE department.name = ?
        `
        const salariesReturn = await queryAsync(salariesQ, department)

        for (const i of salariesReturn){
            departmentSalaries.push(i.salary)
        }

        const totalDepartmentSalary = calculateSum(departmentSalaries)

        console.log("\n");
        colors.logRandomColor(`The department of ${department} has a budget of $${totalDepartmentSalary}`)
        console.log("\n");

        clearAnswers()
        await start()

    } catch (err) {
        colors.logErr(err);
        start()
    }
}

//combined salary of entire organization
const totalOrgExpenses = async start => {
    try {

        const employeesSalaries = []
        const salaryQ = `
            SELECT salary 
            FROM roles 
            JOIN employees ON employees.role_id = roles.id
        `
        const salariesReturn = await queryAsync(salaryQ)
        for (const i of salariesReturn){
            employeesSalaries.push(i.salary)
        }

        const companySalaryExpense = calculateSum(employeesSalaries)

        console.log("\n");
        colors.logRandomColor(`The company has a total salary expense of $${companySalaryExpense}`)
        console.log("\n");

        clearAnswers()
        await start()
    } catch (err) {
        colors.logErr(err);
        start()
    }
}

module.exports = {
    totalDepartmentBudget,
    totalOrgExpenses
}
