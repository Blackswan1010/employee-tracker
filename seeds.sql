INSERT INTO departments(name)
VALUES 
("Product Development"),
("Finance"),
("Customer Service"),
("Data Analytics");

INSERT INTO roles(title, salary, department_id)
VALUES 
("Product Manager", 80000, 1),
("Product Designer", 60000, 1),
("Software Designer", 70000, 1),
("Chief Financial Officer", 150000, 2),
("Financial Analyst", 50000, 2),
("Accountant", 50000, 2),
("Customer Service Rep", 30000, 3),
("Customer Support Specialist", 40000, 3),
("Customer Service Manager", 50000, 3),
("Chief Data Officer", 120000, 4),
("Data Engineer", 70000, 4),
("Data Scientist". 70000, 4);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES 
("Namjoon", "Kim", 9, NULL),
("Jin", "Kim", 1, 3),
("Yoongi", "Min", 4, 1),
("Hobi", "Jung", 5, NULL),
("Jimin", "Park", 7, 2),
("Tae", "Kim", 2, NULL),
("Jungkook", "Jeon", 3, NULL);