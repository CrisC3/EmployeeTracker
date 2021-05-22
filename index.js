const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const asEmpId = `id AS "[Employee ID]"`;
const asEmpFirstName = `first_name AS "[Emp. First Name]"`;
const asEmpLastName = `last_name AS "[Emp. Last Name]"`;
const asEmpRoleTitle = `"[Emp. Role/Title]"`;
const asEmpDeptName = `"[Emp. Department]"`;
const asEmpSalary = `"[Emp. Salary]"`;
const asManager = `"[Manager Name]"`;
const asRoleId = `id AS "[Role ID]"`;
const asRoleTitle = `title AS "[Role Title]"`;
const asRoleSalary = `"[Role Salary]"`;
const asRoleDeptName = `name AS "[Role Dept. Name]"`;
const asDeptId = `id AS "[Dept. ID]"`
const asDeptName = `name AS "[Department]"`;

// Creates connection to MySQL with credentials
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

// Initiates connection to MySQL and then calls mainPrompt
connection.connect((err) => {
    if (err) throw err;
    mainPrompt();
});

// Prompts user on what they want to do
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
                    "View the total utilized budget of a department",
                    ">> Clear screen <<",
                    "..Finish"],
                loop: false
            }
        ])
        .then((response) => {
            
            // Checks what the user choice was, and calls the function to run
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

                case "Remove Employee":

                    // Calls the const anonymous function
                    remEmployee();
                    break;
                
                case "Update Employee Role":

                    // Calls the const anonymous function
                    updEmployeeRole();
                    break;

                case "Update Employee Manager":

                    // Calls the const anonymous function
                    updEmployeeMgr();
                    break;
                
                case "View All Roles":

                    // Calls the const anonymous function
                    viewAllRoles();
                    break;
                
                case "Add Role":

                    // Calls the const anonymous function
                    addRoles();
                    break;
            
                case "Remove Role":

                    // Calls the const anonymous function
                    remRoles();
                    break;
                
                case "Update Role":

                    // Calls the const anonymous function
                    updRoles();
                    break;
                
                case "View all departments":

                    // Calls the const anonymous function
                    viewAllDept();
                    break;
                
                case "Add department":

                    // Calls the const anonymous function
                    addDept();
                    break;
                
                case "Remove department":

                    // Calls the const anonymous function
                    remDept();
                    break;
                
                case "Update department":

                    // Calls the const anonymous function
                    updDept();
                    break;

                case "View the total utilized budget of a department":

                    // Calls the const anonymous function
                    viewUtilBudgetByDept();
                    break;
                
                case ">> Clear screen <<":

                    // Clears out the console screen output
                    // and returns to the mainPrompt list
                    console.clear();
                    mainPrompt();
                    break;

                default:                    
                    
                    // Checks if the MySQL connection is
                    // connected before exiting application
                    // If connected, end the connection
                    if (connection.state == "authenticated") {
                        console.log("Ending MySQL connection");
                        connection.end();
                    }

                    // Displays message to the console
                    console.log("Exiting application");
                    break;
            }
            
        });
};

// Function which runs different queries
function runQuery(sqlQueryData, returnToCall, queryType, info) {

    // Runs the sqlQuery and gets the output
    // based on the statement and queryType
    connection.query(sqlQueryData, (err, res) => {
        if (err) throw err;
        
        if (sqlQueryData.substring(0, 6) == "SELECT") {
                console.table(res);
        }
        else if (sqlQueryData.substring(0, 6) == "INSERT" && ((queryType == "AddEmployee") || (queryType == "AddRole") || (queryType == "AddDept") || (queryType == "AddRole"))) {
            sepStart();
            console.log(`Added "${info}" to the database`);
            sepEnd();
        }
        else if (sqlQueryData.substring(0, 6) == "DELETE" && ((queryType == "deleteEmployee") || (queryType == "deleteRole") || (queryType == "deleteDept"))) {
            sepStart();
            console.log(`Removed "${info}" from the database`);
            sepEnd();
        }
        else if (sqlQueryData.substring(0, 6) == "UPDATE" && ((queryType == "updateEmployee") || (queryType == "updateRole") || (queryType == "updateDept"))) {
            sepStart();
            console.log(`Updated "${info}" in the database`);
            sepEnd();
        }
        

        // Checks if to return the calling function
        // or display the mainPrompt();
        switch (returnToCall) {
            case true:
                return;
            default:
                mainPrompt();
                break;
        }
        
    });
}


// async function to get a single data row or a list of MySQL,
// to display list to user, or find an ID/title/department.
async function getListQuery(sqlQuery, exclude) {

    let sqlList = [];

    // Promise function, to run sql query and wait for the result
    const getFullList = new Promise((resolve, reject) => {
        connection.query(sqlQuery, (err, res) => (err) ? reject(err) : resolve(res));
    });

    // Fetch of the SQL query output, to wait on
    await getFullList
    .then(response => {
        
        // Local variable to handle the response, and convert
        // it into JSON, to transform the data as require
        let newData = JSON.parse(JSON.stringify(response));

        // Checks if the newData is an object, and has title/manager/... or no properties
        if ((newData.length > 0) && (newData[0].hasOwnProperty("title"))) {

            (newData.length > 1) ? sqlList.push("None") : "";

            newData.forEach(element => {
                sqlList.push(element.title);
            });
        }
        else if ((newData.length > 0) && (newData[0].hasOwnProperty("manager"))) {

            sqlList.push("None");

            newData.forEach(element => {
                sqlList.push(element.manager);
            });
        }
        else if ((newData.length > 0) && (newData[0].hasOwnProperty("empFullName"))) {

            sqlList.push("None");

            newData.forEach(element => {
                
                sqlList.push(element.empFullName);
            });            
        }
        else if ((newData.length > 0) && (newData[0].hasOwnProperty("name"))) {

            sqlList.push("None");
            
            newData.forEach(element => {
                
                sqlList.push(element.name);
            });            
        }
        else {
            sqlList.push(newData[0]);
        }
    });

    // Returns the data to the calling function
    return sqlList;    
}

// Runs the view all employees query
const viewAllEmployees = () => {
    
    console.log("\nQuerying for all employees\n");
    
    const sqlQuery = 
    `SELECT 
        emp.${asEmpId},
        emp.${asEmpFirstName},
        emp.${asEmpLastName},
        IFNULL(role.title, "(N/A)") AS ${asEmpRoleTitle},
        IFNULL(department.name, "(N/A)") AS ${asEmpDeptName},
        IFNULL(CONCAT("$ ", FORMAT(role.salary, 2)), "(N/A)") AS ${asEmpSalary},
        IFNULL(CONCAT(mgr.first_name, " ", mgr.last_name), "(N/A)") AS ${asManager}
    FROM
        employee AS emp
    LEFT JOIN employee AS mgr ON
        mgr.id = emp.manager_id
    LEFT JOIN role ON
        emp.role_id = role.id
    LEFT JOIN department ON
        role.department_id = department.id
    ORDER BY
        emp.id;`;
    
    // Calls function to run query
    runQuery(sqlQuery);
};

// Runs the view all employees by department query
const viewAllEmployeesByDep = () => {
    
    console.log("\nQuerying for all employees by department\n");
    
    const sqlQuery = 
    `SELECT 
        emp.${asEmpId},
        emp.${asEmpFirstName},
        emp.${asEmpLastName},
        IFNULL(dept.name, "(N/A)") AS ${asEmpDeptName}
    FROM
        employee emp
    LEFT JOIN role ON
        emp.role_id = role.id
    LEFT JOIN department dept ON
        role.department_id = dept.id
    ORDER BY
        emp.id`;
    
    // Calls function to run query
    runQuery(sqlQuery);
};

// Runs the view all employees by manager query
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

    // Calls function to run query
    runQuery(sqlQuery);
};

// Runs the add new employee query
const addEmployee = async () => {
    
    console.log("\nAdding new employee(s)\n");

    const rolesQuery = "SELECT title FROM role";
    const mgrQuery = `SELECT CONCAT(first_name, " ", last_name) AS manager FROM employee`;
    const roleChoices = await getListQuery(rolesQuery); // Queries the roles in database and return the list as array
    const mgrChoices = await getListQuery(mgrQuery);    // Queries the employees in database and return the list as array

    inquirer
        .prompt([
            {
                type: "input",
                name: "newEmpFirst",
                message: "Please enter the new employee's first name:",
            },
            {
                type: "input",
                name: "newEmpLast",
                message: "Please enter the new employee's last name:"                
            },
            {
                type: "list",
                name: "newEmpRole",
                message: "Please enter the new employee's title/role:",
                choices: roleChoices,
                loop: false
            },
            {
                type: "list",
                name: "newEmpMgr",
                message: "Please enter the new employee's manager:",
                choices: mgrChoices,
                loop: false
            }
        ])
        .then(async (response) => {

            // Checks if the user entered first and last name for new employee
            if ((response.newEmpFirst != "") && (response.newEmpLast != "")) {
                
                const empFullName = response.newEmpFirst + " " + response.newEmpLast;
                const mgrFullName = (response.newEmpMgr != "None") ? response.newEmpMgr.split(" ") : [];
                const mgrFirstName = mgrFullName[0];
                const mgrLastName = mgrFullName[1];
                
                // Checks if the user chose None for the manager, but not None for role
                if ((response.newEmpMgr == "None") && (response.newEmpRole != "None")) {
                    
                    const sqlQuery =
                        `INSERT INTO employee (first_name, last_name, role_id)
                        VALUES
                        (
                            "${response.newEmpFirst}",
                            "${response.newEmpLast}",
                            (SELECT id FROM role WHERE title LIKE "${response.newEmpRole}")
                        );`;

                    // Calls the run query to add, with message to display
                    runQuery(sqlQuery, false, "AddEmployee", `${empFullName} [EMPLOYEE]`);
                }
                else if ((response.newEmpMgr == "None") && (response.newEmpRole == "None")) {
                    
                    // Else if statement - user set None for both manager and role for new employee

                    const sqlQuery =
                        `INSERT INTO employee (first_name, last_name)
                        VALUES
                        (
                            "${response.newEmpFirst}",
                            "${response.newEmpLast}"
                        );`;
                    
                    // Calls the run query to add, with message to display
                    runQuery(sqlQuery, false, "AddEmployee", `${empFullName} [EMPLOYEE]`);
                }
                else {
                    
                    // Else - if user chose a manager

                    const newEmpInsertWithRoleQuery =
                        `INSERT INTO employee (first_name, last_name, role_id)
                        VALUES
                        (
                            "${response.newEmpFirst}",
                            "${response.newEmpLast}",
                            (SELECT id FROM role WHERE title LIKE "${response.newEmpRole}")
                        );`;
                    const newEmpInsertNoRoleQuery =
                        `INSERT INTO employee (first_name, last_name)
                        VALUES
                        (
                            "${response.newEmpFirst}",
                            "${response.newEmpLast}"
                        );`;
                        
                        // ternary operator - to add new employee with or without role set
                        (response.newEmpRole != "None") ? 
                        runQuery(newEmpInsertWithRoleQuery, true, "AddEmployee", `${empFullName} [EMPLOYEE]`) :
                        runQuery(newEmpInsertNoRoleQuery, true, "AddEmployee", `${empFullName} [EMPLOYEE]`);
                    
                        // Get manager ID
                        const getMgrIdQuery = `SELECT id FROM employee WHERE first_name LIKE "${mgrFirstName}" AND last_name LIKE "${mgrLastName}";`;
                        const mgrIdQuery = await getListQuery(getMgrIdQuery);
                        const mgrId = mgrIdQuery[0].id;
                        
                        // Get the last inserted employee ID
                        const getNewEmplId = `SELECT id FROM employee WHERE first_name LIKE "${response.newEmpFirst}" AND last_name LIKE "${response.newEmpLast}" ORDER BY id DESC LIMIT 1;`;
                        const newEmpQuery = await getListQuery(getNewEmplId);
                        const empId = newEmpQuery[0].id;
                        
                        // Query build
                        const updateEmpMgrQuery = `UPDATE employee SET manager_id = ${mgrId} WHERE id = ${empId};`                

                        // Run the query
                        runQuery(updateEmpMgrQuery);
                }
            }
            else {
                sepStart();
                console.log("No employee was added");
                sepEnd();
                mainPrompt();
            }
        });
};

// Runs the remove employee query
const remEmployee = async () => {
    
    console.log("\nRemove existing employee(s)\n");

    const employeesQuery = `SELECT CONCAT(first_name, " ", last_name) AS empFullName FROM employee`;
    const empChoices = await getListQuery(employeesQuery); // Queries for all users to display as choices

    inquirer
        .prompt([
            {
                type: "list",
                name: "chosenEmp",
                message: "Please select the employee you want to remove:",
                choices: empChoices,
                loop: false
            }
        ])
        .then(async (response) => {

            const chosenEmp = response.chosenEmp;
            const empFullName = (chosenEmp != "None") ? chosenEmp.split(" ") : [];
            const empFirstName = empFullName[0];
            const empLastName = empFullName[1];

            // Checks if the user selected a valid employee
            if (chosenEmp != "None") {

                const getRemEmplId = `SELECT id FROM employee WHERE first_name LIKE "${empFirstName}" AND last_name LIKE "${empLastName}";`;
                const remEmpQuery = await getListQuery(getRemEmplId);
                const empId = remEmpQuery[0].id;

                const deleteEmpMgrQuery = `DELETE FROM employee WHERE id = ${empId};`

                // Calls function to delete employee
                runQuery(deleteEmpMgrQuery, false, "deleteEmployee", `${chosenEmp} [EMPLOYEE]`);
            }
            else {
                sepStart();
                console.log("No employee was removed");
                sepEnd();
                mainPrompt();
            }

        });
}

// Runs the update employee query
const updEmployeeRole = async () => {

    console.log("\nUpdate existing employee title/role\n");

    const employeesQuery = `SELECT CONCAT(first_name, " ", last_name) AS empFullName FROM employee`;
    const roleQuery = `SELECT title FROM role`;
    const empChoices = await getListQuery(employeesQuery); // Queries for all employees and returns as a list
    const roleChoices = await getListQuery(roleQuery); // Queries for all roles and returns as a list

    inquirer
        .prompt([
            {
                type: "list",
                name: "chosenEmp",
                message: "Please select the employee you want to update title/role:",
                choices: empChoices,
                loop: false
            },
            {
                type: "list",
                name: "chosenRole",
                message: "Please select the title/role for the employee:",
                choices: roleChoices,
                loop: false
            }
        ])
        .then(async (response) => {

            const chosenEmp = response.chosenEmp;
            const chosenRole = response.chosenRole;
            const empFullName = (chosenEmp != "None") ? chosenEmp.split(" ") : [];
            const empFirstName = empFullName[0];
            const empLastName = empFullName[1];

            // Check if the user chose an employee
            if (chosenEmp != "None") {

                const getUpdEmplId = `SELECT id FROM employee WHERE first_name LIKE "${empFirstName}" AND last_name LIKE "${empLastName}";`;
                const getRoleId = `SELECT id FROM role WHERE title LIKE "${chosenRole}";`;
                const updEmpQuery = await getListQuery(getUpdEmplId);
                const updRoleQuery = await getListQuery(getRoleId);
                const empId = updEmpQuery[0].id;
                const roleId = updRoleQuery[0].id;

                const updEmpRoleQuery = `UPDATE employee SET role_id = ${roleId} WHERE id = ${empId};`

                // Calls function to update an employee
                runQuery(updEmpRoleQuery, false, "updateEmployee", `${chosenEmp} [EMPLOYEE]`);
            }
            else {
                sepStart();
                console.log("No employee was updated");
                sepEnd();
                mainPrompt();
            }
        })
}

// Runs the update employee manager query
const updEmployeeMgr = async() => {

    console.log("\nUpdate existing employee manager\n");

    const employeesQuery = `SELECT CONCAT(first_name, " ", last_name) AS empFullName FROM employee`;
    const empChoices = await getListQuery(employeesQuery); // Queries for all employees, and returns as a list

    inquirer
        .prompt([
            {
                type: "list",
                name: "chosenEmp",
                message: "Please select the EMPLOYEE you want to assign a manager:",
                choices: empChoices,
                loop: false
            },
            {
                type: "list",
                name: "chosenMgr",
                message: "Please select the MANAGER for the employee:",
                choices: empChoices,
                loop: false
            }
        ])
        .then(async (response) => {

            const chosenEmp = response.chosenEmp;
            const empFullName = (chosenEmp != "None") ? chosenEmp.split(" ") : [];
            const empFirstName = empFullName[0];
            const empLastName = empFullName[1];

            const chosenMgr = response.chosenMgr;
            const mgrFullName = (chosenMgr != "None") ? chosenMgr.split(" ") : [];
            const mgrFirstName = mgrFullName[0];
            const mgrLastName = mgrFullName[1];

            // Checks if the user selected an employee, and they didn't select the same employee as its own manager
            if ((chosenEmp != "None") && (chosenEmp != chosenMgr)) {

                const getEmplId = `SELECT id FROM employee WHERE first_name LIKE "${empFirstName}" AND last_name LIKE "${empLastName}";`;
                const getMgrlId = `SELECT id FROM employee WHERE first_name LIKE "${mgrFirstName}" AND last_name LIKE "${mgrLastName}";`;
                const getEmplIdQuery = await getListQuery(getEmplId);
                const getMgrlIdQuery = (chosenMgr != "None") ? await getListQuery(getMgrlId) : null;
                const empId = getEmplIdQuery[0].id;
                const mgrId = (getMgrlIdQuery != null) ? getMgrlIdQuery[0].id : null;

                const updEmpRoleQuery = `UPDATE employee SET manager_id = ${mgrId} WHERE id = ${empId};`

                // Calls function to run update
                runQuery(updEmpRoleQuery, false, "updateEmployee", `${chosenEmp} [EMPLOYEE]`);
            }
            else {

                let msg = "No employee was updated";
                let msgIfSameEmpMgrError = "\nYou chose the same employee as the manager";
                sepStart();
                (chosenEmp == chosenMgr) ? msg += msgIfSameEmpMgrError : "";
                console.log(msg);
                sepEnd();
                mainPrompt();
            }
        })
}

// Runs the view all roles query
const viewAllRoles = () => {
    
    console.log("\nQuerying for all titles/roles\n");
    
    const sqlQuery = 
    `SELECT 
        rol.${asRoleId},
        rol.${asRoleTitle},
        CONCAT("$ ", FORMAT(rol.salary, 2)) AS ${asRoleSalary},
        dept.${asRoleDeptName}
    FROM
        role rol
    INNER JOIN department dept ON
        rol.department_id = dept.id
    ORDER BY
        rol.id`;
    
    // Calls function to run query
    runQuery(sqlQuery);
}

// Runs the add new role query
const addRoles = async () => {

    console.log("\nAdding new role(s)\n");

    const deptQuery = "SELECT name FROM department;";
    const deptChoices = await getListQuery(deptQuery); // Queries for existing roles and returns as a list

    inquirer
        .prompt([
            {
                type: "input",
                name: "newRoleName",
                message: "Please enter the new role title:"
            },
            {
                type: "number",
                name: "newRoleSalary",
                message: "Please enter the new role salary (number only, no comma/dollar symbols):"
            },
            {
                type: "list",
                name: "newRoleDept",
                message: "Please set the new role department:",
                choices: deptChoices,
                loop: false
            }
        ])
        .then(async (response) => {

            const newRoleName = response.newRoleName;
            const newRoleSalary = (typeof response.newRoleSalary === "number") ? (!(isNaN(response.newRoleSalary)) ? response.newRoleSalary : 0) : 0;
            const newRoleDept = response.newRoleDept;
            const queryIfRoleExists = `SELECT title FROM role WHERE title LIKE "${newRoleName}";`
            const checkIfRoleExists = await getListQuery(queryIfRoleExists);
            const roleExistName = checkIfRoleExists[0];
            
            // Checks if the newRole has data, the user did not select None, and does not enter the same existing role name
            if ((newRoleName.length > 0) && (newRoleDept != "None") && (newRoleName != roleExistName)) {

                const sqlQuery =
                        `INSERT INTO role (title, salary, department_id)
                        VALUES
                        (
                            "${newRoleName}",
                            "${newRoleSalary}",
                            (SELECT id FROM department WHERE name LIKE "${newRoleDept}")
                        );`;
                    
                // Calls the function to add role
                runQuery(sqlQuery, false, "AddRole", `${newRoleName} [ROLE]`);

            }
            else {

                let msgMain = "No role was added";
                const msgNoName = "\nThere was no role name set";
                const msgDupRole = `\nThere exists a role name of "${newRoleName}"`;

                sepStart();
                (newRoleName.length == 0) ? msgMain += msgNoName : "";
                (newRoleName == roleExistName) ? msgMain += msgDupRole : "";
                console.log(msgMain);
                sepEnd();
                mainPrompt();
            }
        });
}

// Runs the remove role query
const remRoles = async () => {

    console.log("\nRemoving role(s)\n");

    const roleQuery = "SELECT title FROM role;";
    const roleChoices = await getListQuery(roleQuery); // Queries for all existing roles, and returns as a list

    inquirer
        .prompt([
            {
                type: "list",
                name: "remRole",
                message: "Please select a role to delete:",
                choices: roleChoices,
                loop: false
            }
        ])
        .then(async (response) => {
            
            const chosenRole = response.remRole;

            // Checks the user did not chose None
            if (chosenRole != "None") {

                const getRoleId = `SELECT id FROM role WHERE title LIKE "${chosenRole}";`;
                const remRoleQuery = await getListQuery(getRoleId);
                const roleId = remRoleQuery[0].id;

                const deleteRoleQuery = `DELETE FROM role WHERE id = ${roleId};`

                // Calls function to run delete query
                runQuery(deleteRoleQuery, false, "deleteRole", `${chosenRole} [ROLE]`);
            }
            else {

                let msgMain = "No role was removed\nThere was no role selected";
                
                sepStart();
                console.log(msgMain);
                sepEnd();
                mainPrompt();
            }
        })

}

// Runs the update role query
const updRoles = async () => {
    
    console.log("\nUpdating role(s)\n");

    const roleQuery = "SELECT title FROM role;";
    const roleChoices = await getListQuery(roleQuery); // Queries for existing roles and return as a list
    const deptQuery = "SELECT name FROM department;";
    const deptChoices = await getListQuery(deptQuery); // Queries for existing departments and return as a list

    inquirer
        .prompt([
            {
                type: "list",
                name: "updRole",
                message: "Please select a role to update:",
                choices: roleChoices,
                loop: false
            },
            {
                type: "input",
                name: "updRoleTitle",
                message: "Please enter an updated role name:"
            },
            {
                type: "number",
                name: "updRoleSalary",
                message: "Please enter an updated role salary:"
            },
            {
                type: "list",
                name: "updRoleDept",
                message: "Please select a department to update the role:",
                choices: deptChoices,
                loop: false
            }
        ])
        .then(async (response) => {
            
            const chosenRole = response.updRole;
            const chosenDept = response.updRoleDept;
            const roleTitle = (response.updRoleTitle != "") ? response.updRoleTitle : chosenRole;
            const roleSalaryQuery = `SELECT salary FROM role WHERE title LIKE "${chosenRole}"`;
            const roleSalaryCheck = (!(isNaN(response.updRoleSalary))) ? response.updRoleSalary : ((roleTitle.length > 0) ? await getListQuery(roleSalaryQuery) : 0);
            const roleSalary = ((roleSalaryCheck.length > 0)) ? roleSalaryCheck[0].salary : roleSalaryCheck;            
            const roleDeptCurrQuery = `SELECT department_id FROM role WHERE title LIKE "${chosenRole}"`;
            const roleDeptQuery = `SELECT id FROM department WHERE name LIKE "${chosenDept}"`;            
            const roleDeptCheck = (chosenDept != "None") ? await getListQuery(roleDeptQuery) : await getListQuery(roleDeptCurrQuery);
            const roleDeptId = (roleDeptCheck[0].hasOwnProperty("id")) ? roleDeptCheck[0].id : roleDeptCheck[0].department_id;
            
            // Checks if the user did not chose None, and if a role was entered
            if ((chosenRole != "None") && (roleTitle.length > 0)) {

                const getRoleId = `SELECT id FROM role WHERE title LIKE "${chosenRole}";`;
                const runRoleQuery = await getListQuery(getRoleId);
                const roleId = runRoleQuery[0].id;

                const updateRoleQuery = 
                `UPDATE
                    role
                SET
                    title = "${roleTitle}",
                    salary = ${roleSalary},
                    department_id = ${roleDeptId}
                WHERE
                    id = ${roleId};`

                // Calls function to run update
                runQuery(updateRoleQuery, false, "updateRole", `${chosenRole} [ROLE]`);

            }
            else {

                let msgMain = "No role was selected";
                const msgNoRoleUpdName = "\nNo updated title was set";
                
                sepStart();
                (roleTitle.length == 0) ? msgMain += msgNoRoleUpdName : "";
                console.log(msgMain);
                sepEnd();
                mainPrompt();
            }
            
        })
}

// Runs the view all departments query
const viewAllDept = async () => {

    console.log("\nQuerying for all departments\n");

    const sqlQuery = 
    `SELECT 
        dept.${asDeptId},
        dept.${asDeptName}
    FROM
        department AS dept
    ORDER BY
        dept.id`;
    
    // Calls function to run query
    runQuery(sqlQuery);
}

// Runs the add department query
const addDept = async () => {

    console.log("\nAdding new department(s)\n");

    inquirer
        .prompt([
            {
                type: "input",
                name: "newDeptName",
                message: "Please enter the new department name:"
            }
        ])
        .then(async (response) => {

            const newDeptName = response.newDeptName;
            const queryIfDeptExists = `SELECT name FROM department WHERE name LIKE "${newDeptName}";`
            const checkIfDeptExists = await getListQuery(queryIfDeptExists);
            const deptExistName = checkIfDeptExists[0];

            // Checks if the user entered a new department, and they did entered the same as a existing department
            if ((newDeptName.length > 0) && (newDeptName != deptExistName)) {
                
                const sqlQuery =
                        `INSERT INTO department (name)
                        VALUES
                        (
                            "${newDeptName}"
                        );`;
                
                // Calls function to run add query
                runQuery(sqlQuery, false, "AddDept", `${newDeptName} [DEPARTMENT]`);
            }
            else {
                
                let msgMain = "No department was added";
                const msgNoName = "\nThere was no department name set";
                const msgDupRole = `\nThere exists a department name of "${newDeptName}" already`;

                sepStart();
                (newDeptName.length == 0) ? msgMain += msgNoName : "";
                (newDeptName == deptExistName) ? msgMain += msgDupRole : "";
                console.log(msgMain);
                sepEnd();
                mainPrompt();
            }
        })
}

// Runs the remove department query
const remDept = async () => {

    console.log("\nRemove department(s)\n");

    const deptQuery = "SELECT dept.name FROM department dept LEFT JOIN role rol ON dept.id = rol.department_id WHERE rol.department_id IS NULL;";
    const deptChoices = await getListQuery(deptQuery); // Queries for all existing deparment and returns as a list

    inquirer
        .prompt([
            {
                type: "list",
                name: "remDept",
                message: "Please select the department to remove (NOTE: You can only see departments with no roles, in order to fully remove a department, you will need to re-assign roles/titles departments):",
                choices: deptChoices,
                loop: false
            }
        ])
        .then(async (response) => {
            
            const chosenDept = response.remDept;

            // Checks the user did not chose None
            if (chosenDept != "None") {
                
                const getRemDeptId = `SELECT id FROM department WHERE name LIKE "${chosenDept}";`;
                const remDeptQuery = await getListQuery(getRemDeptId);
                const deptId = remDeptQuery[0].id;

                const deleteDeptQuery = `DELETE FROM department WHERE id = ${deptId};`

                // Calls function to delete
                runQuery(deleteDeptQuery, false, "deleteDept", `${chosenDept} [DEPARTMENT]`);
            }
            else {

                let msgMain = "No department was removed\nThere was no department selected";
                
                sepStart();
                console.log(msgMain);
                sepEnd();
                mainPrompt();
            }

        });
}

// Runs the update department query
const updDept = async () => {

    console.log("\nUpdating department(s)\n");

    const deptQuery = "SELECT name FROM department;";
    const deptChoices = await getListQuery(deptQuery); // Queries for existing department, and returns as a list

    inquirer
        .prompt([
            {
                type: "list",
                name: "updDept",
                message: "Please select the department to update:",
                choices: deptChoices,
                loop: false
            },
            {
                type: "input",
                name: "updDeptName",
                message: "Please enter the department new name:"
            }
        ])
        .then(async (response) => {

            const updChosenDept = response.updDept;
            const newDeptName = response.updDeptName;

            // Checks the user did not chose None, and new department name was entered
            if ((updChosenDept != "None") && (newDeptName.length > 0)) {

                const getUpdDeptId = `SELECT id FROM department WHERE name LIKE "${updChosenDept}";`;
                const updDeptIdQuery = await getListQuery(getUpdDeptId);
                const deptId = updDeptIdQuery[0].id;

                const updDeptQuery = `UPDATE department SET name = "${newDeptName}" WHERE id = ${deptId};`;

                // Calls function to run update
                runQuery(updDeptQuery, false, "updateDept", `${updChosenDept} => ${newDeptName} [DEPARTMENT]`);
            
            }
            else {

                let msgMain = "No department was selected";
                const msgNoDeptUpdName = "\nNo updated department name was set";
                
                sepStart();
                (newDeptName.length == 0) ? msgMain += msgNoDeptUpdName : "";
                console.log(msgMain);
                sepEnd();
                mainPrompt();

            }
        })
}

// Runs the view utilization salary by department
const viewUtilBudgetByDept = () => {

    console.log("\nQuerying for the total utilized budget of every department\n");
    
    const sqlQuery = 
    `SELECT 
        dept.id AS "[Dept. ID]",
        dept.name AS "[Department]",
        CONCAT("$ ", FORMAT(SUM(role.salary), 2)) AS "[Dept. Budget]"
    FROM
        employee emp
    INNER JOIN role ON
        emp.role_id = role.id
    INNER JOIN department dept ON
        role.department_id = dept.id
    GROUP BY
        dept.name
    ORDER BY
        dept.id;`;
    
    runQuery(sqlQuery);
}


//#region Line separators
function sepStart() {
    console.log("\n>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
    console.log("--------------------------------------------------------------------------------\n");
}

function sepEnd() {
    console.log("\n--------------------------------------------------------------------------------");
    console.log("<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<\n");
}
//#endregion