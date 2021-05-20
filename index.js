const mysql = require("mysql");
const inquirer = require("inquirer");
const cTable = require("console.table");

const asEmpId = `id AS "[Employee ID]"`;
const asEmpFirstName = `first_name AS "[Emp. First Name]"`;
const asEmpLastName = `last_name AS "[Emp. Last Name]"`;
const asEmpRoleTitle = `title AS "[Emp. Role/Title]"`;
const asDeptName = `name AS "[Emp. Department]"`;
const asEmpSalary = `"[Emp. Salary]"`;
const asManager = `"[Manager Name]"`;
const asRoleId = `id AS "[Role ID]"`;
const asRoleTitle = `title AS "[Role Title]"`;
const asRoleSalary = `"[Role Salary]"`;
const asRoleDeptName = `name AS "[Role Dept. Name]"`;

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
                    "..Finish"],
                loop: false
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

                case "..Finish":                    
                    
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

function runQuery(sqlQueryData, returnToCall, queryType, info) {

    connection.query(sqlQueryData, (err, res) => {
        if (err) throw err;
        
        if (sqlQueryData.substring(0, 6) == "SELECT") {
                console.table(res);
        }
        else if (sqlQueryData.substring(0, 6) == "INSERT" && ((queryType == "AddEmployee") || (queryType == "AddRole"))) {
            sepStart();
            console.log(`Added "${info}" to the database`);
            sepEnd();
        }
        else if (sqlQueryData.substring(0, 6) == "DELETE" && (queryType == "deleteEmployee")) {
            sepStart();
            console.log(`Removed "${info}" from the database`);
            sepEnd();
        }
        else if (sqlQueryData.substring(0, 6) == "UPDATE" && (queryType == "updateEmployee")) {
            sepStart();
            console.log(`Updated "${info}" in the database`);
            sepEnd();
        }
        
        switch (returnToCall) {
            case true:
                return;
            default:
                mainPrompt();
                break;
        }
        
    });
}

async function getListQuery(sqlQuery, exclude) {

    let sqlList = [];

    sepStart();
    console.log("=== sqlQuery output for testing [START] ===\n");
    console.log(sqlQuery);
    console.log("\n=== sqlQuery output for testing [END] ===");
    sepEnd();

    const getFullList = new Promise((resolve, reject) => {
        connection.query(sqlQuery, (err, res) => (err) ? reject(err) : resolve(res));
    });

    await getFullList
    .then(response => {
        
        let newData = JSON.parse(JSON.stringify(response));

        console.log("=== newData output for testing [START] ===\n");
        console.log(newData);
        console.log("\n=== newData output for testing [END] ===");

        if (newData[0].hasOwnProperty("title")) {

            console.log("Inside of TITLE");
            sqlList.push("None");

            newData.forEach(element => {
                sqlList.push(element.title);
            });
        }
        else if (newData[0].hasOwnProperty("manager")) {

            console.log("Inside of MANAGER");
            sqlList.push("None");

            newData.forEach(element => {
                
                sqlList.push(element.manager);
            });
        }
        else if (newData[0].hasOwnProperty("empFullName")) {

            console.log("Inside of empFullName");
            sqlList.push("None");

            newData.forEach(element => {
                
                sqlList.push(element.empFullName);
            });            
        }
        else if (newData[0].hasOwnProperty("name")) {

            console.log("Inside of name");
            
            newData.forEach(element => {
                
                sqlList.push(element.name);
            });            
        }
        else {
            sqlList.push(newData[0]);
        }
    });

    sepStart();
    console.log("=== sqlList output for testing [START] ===\n");
    console.log(sqlList);
    console.log("\n=== sqlList output for testing [END] ===");
    sepEnd();
    return sqlList;    
}

const viewAllEmployees = () => {
    
    console.log("\nQuerying for all employees\n");
    
    const sqlQuery = 
    `SELECT 
        emp.${asEmpId},
        emp.${asEmpFirstName},
        emp.${asEmpLastName},
        role.${asEmpRoleTitle},
        department.${asDeptName},
        CONCAT("$ ", FORMAT(role.salary, 2)) AS ${asEmpSalary},
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
    
    runQuery(sqlQuery);
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
    
    runQuery(sqlQuery);
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

    runQuery(sqlQuery);
};

const addEmployee = async () => {
    
    console.log("\nAdding new employee(s)\n");

    const rolesQuery = "SELECT title FROM role";
    const mgrQuery = `SELECT CONCAT(first_name, " ", last_name) AS manager FROM employee`;
    const roleChoices = await getListQuery(rolesQuery);
    const mgrChoices = await getListQuery(mgrQuery);

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
                choices: roleChoices
            },
            {
                type: "list",
                name: "newEmpMgr",
                message: "Please enter the new employee's manager:",
                choices: mgrChoices
            }
        ])
        .then(async (response) => {

            if ((response.newEmpFirst != "") && (response.newEmpLast != "")) {
                
                const empFullName = response.newEmpFirst + " " + response.newEmpLast;
                const mgrFullName = (response.newEmpMgr != "None") ? response.newEmpMgr.split(" ") : [];
                const mgrFirstName = mgrFullName[0];
                const mgrLastName = mgrFullName[1];
                
                if ((response.newEmpMgr == "None") && (response.newEmpRole != "None")) {
                    
                    const sqlQuery =
                        `INSERT INTO employee (first_name, last_name, role_id)
                        VALUES
                        (
                            "${response.newEmpFirst}",
                            "${response.newEmpLast}",
                            (SELECT id FROM role WHERE title LIKE "${response.newEmpRole}")
                        );`;
                        
                    runQuery(sqlQuery, false, "AddEmployee", `${empFullName} [EMPLOYEE]`);
                }
                else if ((response.newEmpMgr == "None") && (response.newEmpRole == "None")) {
                    
                    const sqlQuery =
                        `INSERT INTO employee (first_name, last_name)
                        VALUES
                        (
                            "${response.newEmpFirst}",
                            "${response.newEmpLast}"
                        );`;
                        
                    runQuery(sqlQuery, false, "AddEmployee", `${empFullName} [EMPLOYEE]`);
                }
                else {
                    
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
                        
                        (response.newEmpRole != "None") ? 
                        runQuery(newEmpInsertWithRoleQuery, true, "AddEmployee", `${empFullName} [EMPLOYEE]`) :
                        runQuery(newEmpInsertNoRoleQuery, true, "AddEmployee", `${empFullName} [EMPLOYEE]`);
                    
                        const getMgrIdQuery = `SELECT id FROM employee WHERE first_name LIKE "${mgrFirstName}" AND last_name LIKE "${mgrLastName}";`;
                        const mgrIdQuery = await getListQuery(getMgrIdQuery);
                        const mgrId = mgrIdQuery[0].id;
                        
                        const getNewEmplId = `SELECT id FROM employee WHERE first_name LIKE "${response.newEmpFirst}" AND last_name LIKE "${response.newEmpLast}" ORDER BY id DESC LIMIT 1;`;
                        const newEmpQuery = await getListQuery(getNewEmplId);
                        const empId = newEmpQuery[0].id;
                        
                        const updateEmpMgrQuery = `UPDATE employee SET manager_id = ${mgrId} WHERE id = ${empId};`                

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

const remEmployee = async () => {
    
    console.log("\nRemove existing employee(s)\n");

    const employeesQuery = `SELECT CONCAT(first_name, " ", last_name) AS empFullName FROM employee`;
    const empChoices = await getListQuery(employeesQuery);

    inquirer
        .prompt([
            {
                type: "list",
                name: "chosenEmp",
                message: "Please select the employee you want to remove:",
                choices: empChoices
            }
        ])
        .then(async (response) => {

            const chosenEmp = response.chosenEmp;
            const empFullName = (chosenEmp != "None") ? chosenEmp.split(" ") : [];
            const empFirstName = empFullName[0];
            const empLastName = empFullName[1];

            if (chosenEmp != "None") {

                const getRemEmplId = `SELECT id FROM employee WHERE first_name LIKE "${empFirstName}" AND last_name LIKE "${empLastName}";`;
                const remEmpQuery = await getListQuery(getRemEmplId);
                const empId = remEmpQuery[0].id;

                const deleteEmpMgrQuery = `DELETE FROM employee WHERE id = ${empId};`

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

const updEmployeeRole = async () => {

    console.log("\nUpdate existing employee title/role\n");

    const employeesQuery = `SELECT CONCAT(first_name, " ", last_name) AS empFullName FROM employee`;
    const roleQuery = `SELECT title FROM role`;
    const empChoices = await getListQuery(employeesQuery);
    const roleChoices = await getListQuery(roleQuery);

    inquirer
        .prompt([
            {
                type: "list",
                name: "chosenEmp",
                message: "Please select the employee you want to update title/role:",
                choices: empChoices
            },
            {
                type: "list",
                name: "chosenRole",
                message: "Please select the title/role for the employee:",
                choices: roleChoices
            }
        ])
        .then(async (response) => {

            const chosenEmp = response.chosenEmp;
            const chosenRole = response.chosenRole;
            const empFullName = (chosenEmp != "None") ? chosenEmp.split(" ") : [];
            const empFirstName = empFullName[0];
            const empLastName = empFullName[1];

            if (chosenEmp != "None") {

                const getUpdEmplId = `SELECT id FROM employee WHERE first_name LIKE "${empFirstName}" AND last_name LIKE "${empLastName}";`;
                const getRoleId = `SELECT id FROM role WHERE title LIKE "${chosenRole}";`;
                const updEmpQuery = await getListQuery(getUpdEmplId);
                const updRoleQuery = await getListQuery(getRoleId);
                const empId = updEmpQuery[0].id;
                const roleId = updRoleQuery[0].id;

                const updEmpRoleQuery = `UPDATE employee SET role_id = ${roleId} WHERE id = ${empId};`

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

const updEmployeeMgr = async() => {

    console.log("\nUpdate existing employee manager\n");

    const employeesQuery = `SELECT CONCAT(first_name, " ", last_name) AS empFullName FROM employee`;
    const empChoices = await getListQuery(employeesQuery);    

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

            console.log(response);
            const chosenEmp = response.chosenEmp;
            const empFullName = (chosenEmp != "None") ? chosenEmp.split(" ") : [];
            const empFirstName = empFullName[0];
            const empLastName = empFullName[1];

            const chosenMgr = response.chosenMgr;
            const mgrFullName = (chosenMgr != "None") ? chosenMgr.split(" ") : [];
            const mgrFirstName = mgrFullName[0];
            const mgrLastName = mgrFullName[1];

            console.log(empFirstName + " " + empLastName);
            console.log(mgrFirstName + " " + mgrLastName);

            // if ((chosenEmp != "None") && (chosenMgr != "None") && (chosenEmp != chosenMgr)) {
            if ((chosenEmp != "None") && (chosenEmp != chosenMgr)) {

                const getEmplId = `SELECT id FROM employee WHERE first_name LIKE "${empFirstName}" AND last_name LIKE "${empLastName}";`;
                const getMgrlId = `SELECT id FROM employee WHERE first_name LIKE "${mgrFirstName}" AND last_name LIKE "${mgrLastName}";`;
                const getEmplIdQuery = await getListQuery(getEmplId);
                const getMgrlIdQuery = (chosenMgr != "None") ? await getListQuery(getMgrlId) : null;
                const empId = getEmplIdQuery[0].id;
                const mgrId = (getMgrlIdQuery != null) ? getMgrlIdQuery[0].id : null;

                const updEmpRoleQuery = `UPDATE employee SET manager_id = ${mgrId} WHERE id = ${empId};`


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
    
    runQuery(sqlQuery);
}

const addRoles = async () => {

    console.log("\nAdding new role(s)\n");

    const deptQuery = "SELECT name FROM department;";
    const deptChoices = await getListQuery(deptQuery);

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
                choices: deptChoices
            }
        ])
        .then((response) => {

            const newRoleName = response.newRoleName;
            const newRoleSalary = (typeof response.newRoleSalary === "number") ? (!(isNaN(response.newRoleSalary)) ? response.newRoleSalary : 0) : 0;
            const newRoleDept = response.newRoleDept;
            
            if ((newRoleName.length > 0) && (newRoleDept != "None")) {

                const sqlQuery =
                        `INSERT INTO role (title, salary, department_id)
                        VALUES
                        (
                            "${newRoleName}",
                            "${newRoleSalary}",
                            (SELECT id FROM department WHERE name LIKE "${newRoleDept}")
                        );`;
                        
                runQuery(sqlQuery, false, "AddRole", `${newRoleName} [ROLE]`);

            }
            else {

                let msgMain = "No role was added";
                let msgNoName = "\nThere was no role name set";

                sepStart();
                (newRoleName.length == 0) ? msgMain += msgNoName : "";
                console.log(msgMain);
                sepEnd();
                mainPrompt();
            }
            

        });

}

const remRoles = async () => {

    console.log("\nRemoving role(s)\n");

    const deptQuery = "SELECT title FROM role;";
    const deptChoices = await getListQuery(deptQuery);

    inquirer
        .prompt([
            {
                type: "list",
                name: "remRole",
                message: "Please select a role to delete:",
                choices: deptChoices
            }
        ])
        .then(async (response) => {
            console.log(response);
            const chosenRole = response.remRole;

            if (chosenRole != "None") {

                const getRoleId = `SELECT id FROM role WHERE title LIKE "${chosenRole}";`;
                const remRoleQuery = await getListQuery(getRoleId);
                const roleId = remRoleQuery[0].id;

                const deleteRoleQuery = `DELETE FROM role WHERE id = ${roleId};`

                runQuery(deleteRoleQuery, false, "deleteEmployee", `${chosenRole} [ROLE]`);
            }
        })

}

function dataValidation(input, msg) {
    
    if (input)
        return true;
    else {
        console.log(`\n${msg}`);
        return false;
    }
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