const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

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

const viewAllEmployees = () => {
    
    console.log("\nQuerying for all employees\n");
    
    const localQuery = 
    `SELECT 
        emp.ID,
        emp.first_name AS "First Name",
        emp.last_name AS "Last Name",
        role.title AS "Title",
        department.name AS "Department",
        CONCAT("$ ", FORMAT(role.salary, 2)) AS "Salary",
        IFNULL(CONCAT(mgr.first_name, ", ", mgr.last_name), "(N/A)") AS Manager
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
    
    connection.query(localQuery, (err, res) => {
        if (err) throw err;
        
        console.table(res);
        
        connection.end();
        mainPrompt();
    });
}

const viewAllEmployeesByDep = () => {
    
    console.log("\nQuerying for all employees by department\n");
    
    const localQuery = 
    `SELECT 
        *
    FROM
        employee`;
    
    connection.query(localQuery, (err, res) => {
        if (err) throw err;
        
        console.table(res);
        
        connection.end();
        mainPrompt();
    });
}