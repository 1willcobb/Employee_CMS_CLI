const colors = require('./colors');
const inquirer = require('inquirer');
const {queryAsync, clearAnswers} = require('./helpers')
const { addRole } = require('./db_add')

//"Update Employee Role"
const updateEmployeeRole = async start => {
    try {

        let employees = []
        let roles = ["Create New Role"]

        const rolesQ = `SELECT title FROM roles`
        const rolesReturn = await queryAsync(rolesQ) 

        for (const i of rolesReturn){
            roles.push(i.title)
        }

        const updateRoleQ = [
            {
                name: "employee",
                message: "Select employee you wish to update Role",
                choices: employees,
                type: "list"
            },
            {
                name: "role",
                message: "Select role to change to",
                choices: roles,
                type: "list"  
            }
        ]

        const answers = await inquirer.prompt(updateRoleQ);
        const { employee, role } = answers

        //should you be able to create a new role from here?
        if (role === "Create New Role"){
            await addRole(start);
            return;
        }

        const roleIdQ = `SELECT id FROM roles WHERE title = ?`
        const role_id_return = await queryAsync(roleIdQ, [role])
        const role_id = role_id_return[0].id

        const [ first_name, last_name ] = employee.split(' ');

        const updateRole = `
            UPDATE employees
            SET role_id = ?
            WHERE first_name = ? AND last_name = ?
        `
        await queryAsync(updateRole, [role_id, first_name, last_name])
        colors.logRandomColor(`${employee} role updated to ${role}`)

        clearAnswers()
        start()
    } catch (err){
        colors.logErr(err);
        start();
    }
    

};

//"Update Employee Manager"
const updateEmployeeManager = async start => {
    try {

        let employees = []
        let managers = []

        const employeeQ = `SELECT CONCAT(first_name, " ", last_name) AS employee FROM employees`
        const employeeReturn = await queryAsync(employeeQ) 

        for (const i of employeeReturn){
            employees.push(i.employee)
        }

        const managerQ = `
            SELECT CONCAT(e.first_name, " ", e.last_name) AS manager 
            FROM employees AS e 
            WHERE e.manager_id = 1 OR e.manager_id IS NULL
            `
        const managerReturn = await queryAsync(managerQ) 

        for (const i of managerReturn){
            managers.push(i.manager)
        }


        const updateRoleQ = [
            {
                name: "employee",
                message: "Select employee you wish to update the manager for: ",
                choices: employees,
                type: "list"
            },
            {
                name: "manager",
                message: "Select manager to change to",
                choices: managers,
                type: "list",
            }
        ]

        const answers = await inquirer.prompt(updateRoleQ);
        const { employee, manager } = answers

        const [ m_first_name, m_last_name ] = manager.split(' ');

        const managerIdQ = `SELECT id FROM employees WHERE first_name = ? AND last_name = ?`
        const manager_id_return = await queryAsync(managerIdQ, [m_first_name, m_last_name])
        const manager_id = manager_id_return[0].id

        console.log(manager_id)

        const [ first_name, last_name ] = employee.split(' ');

        const updateRole = `
            UPDATE employees
            SET manager_id = ?
            WHERE first_name = ? AND last_name = ?
        `
        await queryAsync(updateRole, [manager_id, first_name, last_name])
        colors.logRandomColor(`${employee} manager updated to ${manager}`)

        clearAnswers()
        start()
    } catch (err){
        colors.logErr(err);
        start();
    }
};

module.exports = {
    updateEmployeeManager,
    updateEmployeeRole
}