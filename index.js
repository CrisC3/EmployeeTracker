const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const asEmpId = `id AS "[Employee ID]"`;
const asEmpFirstName = `first_name AS "[Emp. First Name]"`;
const asEmpLastName = `last_name AS "[Emp. Last Name]"`;
const asRoleTitle = `title AS "[Title]"`;
const asDeptName = `name AS "[Department]"`;
const asSalary = `"[Salary]"`;
const asManager = `"[Manager Name]"`;

const connection = mysql.createConnection({
    host: "localhost",
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: "root",
  
    // Your password
    password: "Bootcamp2021",
    database: "employeeCms",
});

connection.connect((err) => {
    if (err) throw err;
    mainPrompt();
});

const mainPrompt = () => {

    inquirer
        .prompt([
            {
                type: "list",
                name: "mainprompt",
                message: "What would you like to do?",
                choices: [
                    "View all Employees",
                    "View All Employees By Department",
                    "View All Employees By Manager",
                    "Add Employee",
                    "Remove Employee",
                    "Update Employee Role",
                    "Update Employee Manager",
                    "View All Roles",
                    "Add Role",
                    "Remove Role",
                    "Update Role",
                    "View all departments",
                    "Add department",
                    "Remove department",
                    "Update department",
                    "..Finish"]
            }
        ])
        .then((response) => {
            
            switch (response.mainprompt) {

                case "View all Employees":
                    
                    // Calls the const anonymous function
                    viewAllEmployees();
                    break;

                case "View All Employees By Department":

                    // Calls the const anonymous function
                    viewAllEmployeesByDep();
                    break;

                case "View All Employees By Manager":

                    // Calls the const anonymous function
                    viewAllEmployeesByMgr();
                    break;

                case "Add Employee":

                    // Calls the const anonymous function
                    addEmployee();
                    break;

                case "..Finish":                    
                    
                    // Checks if the MySQL connection is
                    // connected before exiting application
                    // If connected, end the connection
                    if (connection.state == "authenticated") {
                        console.log("Closing MySQL connection");
                        connection.end();
                    }

                    // Displays message to the console
                    console.log("Exiting application");
                    break;
            }
            
        });
};

function runQuerySelect(sqlQueryData) {

    connection.query(sqlQueryData, (err, res) => {
        if (err) throw err;
        
        console.table(res);

        mainPrompt();
    });
}

const viewAllEmployees = () => {
    
    console.log("\nQuerying for all employees\n");
    
    const sqlQuery = 
    `SELECT 
        emp.${asEmpId},
        emp.${asEmpFirstName},
        emp.${asEmpLastName},
        role.${asRoleTitle},
        department.${asDeptName},
        CONCAT("$ ", FORMAT(role.salary, 2)) AS ${asSalary},
        IFNULL(CONCAT(mgr.first_name, " ", mgr.last_name), "(N/A)") AS ${asManager}
    FROM
        employee AS emp
    LEFT JOIN employee AS mgr ON
        mgr.id = emp.manager_id
    INNER JOIN role ON
        emp.role_id = role.id
    INNER JOIN department ON
        role.department_id = department.id
    ORDER BY
        emp.id`;
    
    runQuerySelect(sqlQuery);
};

const viewAllEmployeesByDep = () => {
    
    console.log("\nQuerying for all employees by department\n");
    
    const sqlQuery = 
    `SELECT 
        emp.${asEmpId},
        emp.${asEmpFirstName},
        emp.${asEmpLastName},
        dept.${asDeptName}
    FROM
        employee emp
    INNER JOIN role ON
        emp.role_id = role.id
    INNER JOIN department dept ON
        role.department_id = dept.id
    ORDER BY
        emp.id`;
    
    runQuerySelect(sqlQuery);
};

const viewAllEmployeesByMgr = () => {
    
    console.log("\nQuerying for all employees by manager\n");

    const sqlQuery = 
    `SELECT 
        emp.${asEmpId},
        emp.${asEmpFirstName},
        emp.${asEmpLastName},
        IFNULL(CONCAT(mgr.first_name, " ", mgr.last_name), "(N/A)") AS ${asManager}
    FROM
        employee AS emp
    INNER JOIN employee AS mgr ON
        mgr.id = emp.manager_id
    ORDER BY
        CONCAT(mgr.first_name, " ", mgr.last_name), emp.id`;

    runQuerySelect(sqlQuery);
};

const addEmployee = () => {
    
    console.log("\nAdding new employee\n");

    inquirer
        .prompt([
            {
                type: "input",
                name: "newEmpFirst",
                message: "Please enter the new employee's first name:"                
            },
            {
                type: "input",
                name: "newEmpLast",
                message: "Please enter the new employee's last name:"                
            },
            {
                type: "list",
                name: "newEmpRole",
                message: "Please enter the new employee's role:",
                choices: [`SELECT * FROM employee`]
            }
        ])
        .then((response) => {
            
            console.log(response);

            const sqlQuery = `SELECT * FROM employee`;

            runQuerySelect(sqlQuery);
            
        });   
    
};