DROP DATABASE IF EXISTS employeeCms;

CREATE DATABASE employeeCms;

USE employeeCms;

CREATE TABLE department (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(30) NOT NULL UNIQUE
);

CREATE TABLE role (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL UNIQUE,
    salary DECIMAL(13, 2) NOT NULL,
    department_id INT NOT NULL,
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT,
    manager_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id),
    FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);

INSERT INTO department (name)
VALUES ("Sales"), ("Engineering"), ("Finance"), ("Legal");

INSERT INTO role (title, salary, department_id)
VALUES
    ("Sales Lead", 100000, (SELECT id FROM department WHERE name LIKE "Sales")),
    ("Salesperson", 80000, (SELECT id FROM department WHERE name LIKE "Sales")),
    ("Lead Engineer", 150000, (SELECT id FROM department WHERE name LIKE "Engineering")),
    ("Software Engineer", 120000, (SELECT id FROM department WHERE name LIKE "Engineering")),
    ("Accountant", 125000, (SELECT id FROM department WHERE name LIKE "Finance")),
    ("Legal Team Lead", 250000, (SELECT id FROM department WHERE name LIKE "Legal")),
    ("Lawyer", 190000, (SELECT id FROM department WHERE name LIKE "Legal"));

INSERT INTO employee (first_name, last_name, role_id)
VALUES
    ("John", "Doe", (SELECT id FROM role WHERE title LIKE "Sales Lead")),
    ("Mike", "Chan", (SELECT id FROM role WHERE title LIKE "Salesperson")),
    ("Ashley", "Rodriguez", (SELECT id FROM role WHERE title LIKE "Lead Engineer")),
    ("Kevin", "Tupik", (SELECT id FROM role WHERE title LIKE "Software Engineer")),
    ("Malia", "Brown", (SELECT id FROM role WHERE title LIKE "Accountant")),
    ("Sarah", "Lourd", (SELECT id FROM role WHERE title LIKE "Legal Team Lead")),
    ("Tom", "Allen", (SELECT id FROM role WHERE title LIKE "Lawyer")),
    ("Tammer", "Galal", (SELECT id FROM role WHERE title LIKE "Software Engineer"));

SET @ManagerId = (SELECT id FROM employee WHERE first_name LIKE "Ashley" AND last_name LIKE "Rodriguez");
SET @EmployeeId = (SELECT id FROM employee WHERE first_name LIKE "John" AND last_name LIKE "Doe");

UPDATE employee
SET manager_id = @ManagerId
WHERE id = @EmployeeId;

SET @ManagerId = (SELECT id FROM employee WHERE first_name LIKE "John" AND last_name LIKE "Doe");
SET @EmployeeId = (SELECT id FROM employee WHERE first_name LIKE "Mike" AND last_name LIKE "Chan");

UPDATE employee
SET manager_id = @ManagerId
WHERE id = @EmployeeId;

SET @ManagerId = (SELECT id FROM employee WHERE first_name LIKE "Ashley" AND last_name LIKE "Rodriguez");
SET @EmployeeId = (SELECT id FROM employee WHERE first_name LIKE "Kevin" AND last_name LIKE "Tupik");

UPDATE employee
SET manager_id = @ManagerId
WHERE id = @EmployeeId;

SET @ManagerId = (SELECT id FROM employee WHERE first_name LIKE "Sarah" AND last_name LIKE "Lourd");
SET @EmployeeId = (SELECT id FROM employee WHERE first_name LIKE "Tom" AND last_name LIKE "Allen");

UPDATE employee
SET manager_id = @ManagerId
WHERE id = @EmployeeId;

SET @ManagerId = (SELECT id FROM employee WHERE first_name LIKE "Kevin" AND last_name LIKE "Tupik");
SET @EmployeeId = (SELECT id FROM employee WHERE first_name LIKE "Tammer" AND last_name LIKE "Galal");

UPDATE employee
SET manager_id = @ManagerId
WHERE id = @EmployeeId;