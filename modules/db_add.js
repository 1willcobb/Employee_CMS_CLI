const colors = require('./colors')
const db = require('../config/connection')
const chalkTable = require('chalk-table')
const inquirer = require('inquirer');
const chalk = require('chalk');

const tableOptions = {
    leftPad: 2,
    skinny: true,
    intersectionCharacter: "@"
  };

const clearAnswers = () => {
    inquirer.prompt.answers = {};
}

function queryAsync(query, values) {
    return new Promise((resolve, reject) => {
      db.query(query, values, (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      });
    });
  }

// View All Departments
const addDepartment = (start) => {

    db.query('SELECT name AS Department, id AS "Department ID" FROM department', function (err,results){
        if (results) {
            colors.logRandomColor(chalkTable(tableOptions,results));
            clearAnswers();
            start();
        } else {
            colors.logErr(err)
            start()
        }
    })
}

// View All Employees
const addRole = (start) => {
    db.query(`
        SELECT 
            roles.title AS Position, 
            roles.id AS "Role ID", 
            (SELECT name FROM department WHERE department.id = roles.department_id) AS Department, 
            roles.salary as Salary 
        FROM roles 
        JOIN department ON department.id = roles.department_id`,
        function (err,results){
        if (results) {

        } else {
            colors.logErr(err)
            start()
        }
    })
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
