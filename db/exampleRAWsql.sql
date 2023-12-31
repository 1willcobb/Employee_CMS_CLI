-- SELECT ALL EMPOLOYEES
SELECT *
FROM employees JOIN roles ON roles.id = employees.role_id;

SELECT
    employees.first_name,
    employees.last_name,
    roles.title,
    department.name,
    (SELECT first_name
    FROM employees AS manager
    WHERE manager.id = employees.manager_id) 
    AS Manager
FROM employees
    JOIN roles ON roles.id = employees.role_id
    JOIN department ON department.id = roles.department_id;

SELECT
    employees.first_name,
    employees.last_name,
    roles.title,
    department.name,
    CONCAT(manager.first_name, ' ', manager.last_name) AS Manager
FROM employees
    JOIN roles ON roles.id = employees.role_id
    JOIN department ON department.id = roles.department_id
    JOIN employees AS manager ON manager.id = employees.manager_id;

--VIEW Employees combined Table
SELECT
    employees.id,
    employees.first_name AS "First Name",
    employees.last_name AS "Last Name",
    roles.title AS "Job Title",
    department.name AS "Department",
    roles.salary AS "Salary",
    (SELECT CONCAT(manager.first_name, " ", manager.last_name)
    FROM employees AS manager
    WHERE manager.id = employees.manager_id) 
        AS "Ranking Manger"
FROM employees
    JOIN roles ON roles.id = employees.role_id
    JOIN department ON department.id = roles.department_id

--View employees by manager:
SELECT
    employees.first_name,
    manager.first_name
FROM employees
    JOIN roles ON roles.id = employees.role_id
    JOIN department ON department.id = roles.department_id
    JOIN employees AS manager ON manager.id = employees.manager_id
WHERE manager.id = 1;

--Sort by org chart
SELECT
    employees.id,
    employees.first_name AS "First Name",
    employees.last_name AS "Last Name",
    roles.title AS "Job Title",
    department.name AS "Department",
    roles.salary AS "Salary",
    (SELECT CONCAT(manager.first_name, " ", manager.last_name)
    FROM employees AS manager
    WHERE manager.id = employees.manager_id) 
        AS "Ranking Manger",
    roles.org_id
FROM employees
    JOIN roles ON roles.id = employees.role_id
    JOIN department ON department.id = roles.department_id
ORDER BY roles.org_id;


--Not Done
UPDATE employees
SET manager_id = ?
WHERE employees.manager_id = 
    (SELECT manager.id
FROM employees AS manager
WHERE manger.id = )


--VIEW Employee by department 
SELECT
    CONCAT(e.first_name, " ", e.last_name) AS Employee,
    d.name AS Departments
FROM department AS d
    JOIN roles ON roles.department_id = d.id
    JOIN employees AS e ON e.role_id = roles.id
WHERE d.name = ?;

--SELECET all managers
SELECT CONCAT(e.first_name, " ", e.last_name) AS manager
FROM employees AS e
WHERE e.manager_id = 1 OR e.manager_id IS NULL


-- SELECT ALL employees under manager
SELECT CONCAT(e.first_name, " ", e.last_name) AS Employee,
    d.name AS Department
FROM department AS d
    JOIN roles ON roles.department_id = d.id
    JOIN employees AS e ON e.role_id = roles.id
WHERE e.manager_id = 
    (SELECT m.id
FROM employees AS m
WHERE m.first_name = ? AND m.last_name = ?)


SELECT id
FROM employees
WHERE first_name = ? AND last_name = ?


INSERT INTO employees
    (first_name, last_name, role_id, manager_id)
VALUES
    (?, ?, ?, ?)




WHERE department = department same and the manager_id = 1 or IS NULL


SELECT *
FROM employees
    JOIN roles ON roles.id = employees.role_id
    JOIN department ON department.id = roles.department_id;


i need to check
if there are employees in a department

-- select employee id if they are in a department
select employees.id 
FROM employees 
JOIN roles ON roles.id = employees.role_id 
JOIN department ON department.id = roles.department_id 
WHERE department.name = "Human Resources" 

--select all employee salary within a department
SELECT salary 
FROM roles 
JOIN employees ON employees.role_id = roles.id
JOIN department ON department.id = roles.department_id 
WHERE department.name = "Human Resources"

--select 