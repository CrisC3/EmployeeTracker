const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: 'localhost',
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: 'root',
  
    // Your password
    password: 'Bootcamp2021',
    database: 'employeecms',
  });

  connection.connect((err) => {
    if (err) throw err;
    
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        console.table(res);
    });
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        console.table(res);
    });
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        console.table(res);
    });

    connection.end();
  });