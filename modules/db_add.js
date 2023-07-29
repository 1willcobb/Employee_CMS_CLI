const colors = require('./colors');
const db = require('../config/connection');
const inquirer = require('inquirer');
const {queryAsync, clearAnswers} = require('./helpers')

// View All Departments
const addDepartment = async (start) => {

    try {
        const newDepartment = {
            name: "department",
            message: "What is the name of the new Department? "
        }
    
        const answer = await inquirer.prompt(newDepartment)
        const department = answer.department
    
        db.query('INSERT INTO department (name) VALUES (?)', [department] , 
            function (err,results){
                if (results) {
                    colors.logRandomColor(`${department} added to departments`)
                    clearAnswers();
                    start();
                } else {
                    colors.logErr(err)
                    start()
                }
        })
    }catch(err){
        colors.logErr(err);
        start();
    }
}

// View All Employees
const addRole = async (start) => {
    try {
        let departments =[];
        const departmentsQ = `SELECT name FROM department`
    
        const departmentResults = await queryAsync(departmentsQ);
        departments = departmentResults.map(department => department.name);
    
        const addRoleQs = [
            {
                name: "title",
                message: "Role Title: "
            },
            {
                name: "salary",
                message: "Salary: ",
            },
            {
                name: "department_name",
                message: "What Department does this role belong to:",
                choices: departments,
                type: "list"
            }
        ]
        const rolesAnswers = await inquirer.prompt(addRoleQs)
        const { title, salary, department_name } = rolesAnswers

        const departmentIdQ = `SELECT id FROM department WHERE name = ?`;
        
        const department_id_a = await queryAsync(departmentIdQ, [department_name])
        const department_id = department_id_a[0].id
        if (rolesAnswers) { 

            const insertRole = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`

            await queryAsync(insertRole, [title, salary, department_id])
            colors.logRandomColor(`${title} added to Roles`)
            start()

        } else {
            colors.logErr(err)
            start()
        }
        
    } catch (err) {
        colors.logErr(err);
        start();
    }

}

 // View All Rolls
const addEmployee = async (start) => {
    try {
        let roles = []
        let managers = []

        const rolesQ = `SELECT title FROM roles`

        const rolesResults = await queryAsync(rolesQ);
        roles = rolesResults.map(role => role.title);

        const managerQ = `
            SELECT CONCAT(e.first_name, " ", e.last_name) AS manager 
            FROM employees AS e 
            WHERE e.manager_id = 1 OR e.manager_id IS NULL
        `;

        const managerResults = await queryAsync(managerQ);
        managers = managerResults.map(manager => manager.manager);

        const addEmployeePrompts = [
            {
                name: 'first_name',
                message: 'First Name of Employee: '
            },
            {
                name: 'last_name',
                message: 'Last Name of Employee: '
            },
            {
                name: 'role_id',
                message: 'Select a Roll',
                choices: roles,
                type: 'list',
            },
            {
                name: 'manager_id',
                message: 'Select a Manager',
                choices: managers,
                type: 'list',
            }
        ]
    
        const answers = await inquirer.prompt(addEmployeePrompts);

        console.log(answers.role_id)

        const managerIdQuery = `
            SELECT m.id as manager_id
            FROM employees AS m 
            WHERE m.first_name = ? AND m.last_name = ?
        `;

        const [ m_first_name, m_last_name ] = answers.manager_id.split(' ');
        const managerIdResults = await queryAsync(managerIdQuery, [m_first_name, m_last_name]);
        const manager_id = managerIdResults[0].manager_id;

        const roleIdQ = `SELECT id FROM roles WHERE title = ?`;
        const roleIdResults = await queryAsync(roleIdQ, [answers.role_id]);
        const role_id = roleIdResults[0].id;

        const { first_name, last_name } = answers;

        const insertQ = `
            INSERT INTO employees (first_name, last_name, role_id, manager_id) 
            VALUES (?,?,?,?)
            `;

        await queryAsync(insertQ, [first_name, last_name, role_id, manager_id])

        colors.logRandomColor(`${first_name} ${last_name} added to Employee Database.`)
        clearAnswers();
        start()
    } catch (err) {
        colors.logErr(err);
        start();
        }
}



module.exports = {
    addDepartment,
    addRole,
    addEmployee
}
