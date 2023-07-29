const colors = require('./colors');
const inquirer = require('inquirer');
const {queryAsync, clearAnswers} = require('./helpers')

const deleteDepartment = async start => {
    try{
        


    }catch (err){
        colors.logErr(err)
        start()
    }
}

const deleteRole = async start => {
    try{
        let roles = []

        const roleQ = `SELECT title FROM roles`
        const rolesReturn = await queryAsync(roleQ) 

        for (const i of rolesReturn){
            roles.push(i.title)
        }

        const deleteRQPrompt = {
            name: "role",
            message: "What role do you want to delete?",
            choices: roles,
            type: "list",
        }

        const answer_role = await inquirer.prompt(deleteRQPrompt)
        const role = answer_role.role

        const vQuery = `
            SELECT id FROM employees WHERE role_id = (SELECT id FROM roles WHERE title = ?)
        `
        const answer_id = await queryAsync(vQuery, [role])
        const id = answer_id[0].id

        //check if there are employees under that role so that they can be moved to a different role. 
        if (id > 0) {
            colors.logErr("There are employees with this role that need to be moved to different roles before deleting this role.")
            await start()
        } else {
            const deleteRQ = `
            DELETE FROM roles WHERE title = ?
            `
            await queryAsync(deleteRQ, [role])

            colors.logRandomColor(`${role} successfully deleted`)

            clearAnswers()
            start()
        }

    }catch (err){
        colors.logErr(err)
        start()
    }
}

const deleteEmployee = async start => {
    try{

        let employees = []

        const employeeQ = `SELECT CONCAT(first_name, " ", last_name) AS employee FROM employees WHERE NOT manager_id = 1 OR NOT NULL`
        const employeeReturn = await queryAsync(employeeQ) 

        for (const i of employeeReturn){
            employees.push(i.employee)
        }

        const deleteEQPrompt = {
            name: "employee",
            message: "What employee do you want to delete?\n*managers can not be deleted unless decoupled from their position and new manager assigned to department*",
            choices: employees,
            type: "list"
        }

        const { employee } = await inquirer.prompt(deleteEQPrompt)

        const [ first_name, last_name ] = employee.split(' ');

        const deleteEQ = `
            DELETE FROM employees WHERE first_name = ? AND last_name = ?
        `

        await queryAsync(deleteEQ, [first_name, last_name])

        colors.logRandomColor(`${employee} successfully deleted`)

        clearAnswers()
        start()

    }catch (err){
        colors.logErr(err)
        start()
    }
}

module.exports = {
    deleteDepartment,
    deleteEmployee,
    deleteRole
}