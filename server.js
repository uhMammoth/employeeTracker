const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');

// starts server after database connection
db.connect(err => {
    if(err) throw err;
    console.log('Database connected.');
});

function promptHandler(){
    const choices = ['View All Departments','View All Roles','View All Employees','Add Department','Add Role','Add Employee','Update An Employees Role', 'Exit'];
    inquirer.prompt([{
        type: 'list',
        name: 'choice',
        message: 'What would you like to do?',
        choices: choices
    }]).then(answers => {
        let sql = '';
        switch (answers.choice) {
            case 'View All Departments':
                sql = `SELECT * FROM departments`; 
                viewAll(sql);               
                break;
            case 'View All Roles':
                // sql = `SELECT roles.id, roles.title, roles.salary, departments.name AS departments_name FROM roles LEFT JOIN departments on roles`; 
                sql = `SELECT * FROM roles`; 
                viewAll(sql);
                break;
            case 'View All Employees':
                sql = `SELECT employees.*, roles.title AS role_title FROM employees LEFT JOIN roles ON employees.role_id = roles.id`; 
                viewAll(sql);
                break;
            case 'Add Department':
                sql = `INSERT INTO departments (name) VALUES (?)`;
                addDepartment(sql);
                break;
            case 'Add Role':
                sql = `INSERT INTO roles (title, salary, department_id) VALUES (?,?,?)`;
                addRole(sql);
                break;
            case 'Add Employee':
                sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) VALUES (?,?,?,?)`;
                addEmployee(sql);
                break;
            case 'Update An Employees Role':
                sql = `UPDATE employees SET role_id = ? WHERE id = ?`
                updateEmployee(sql);
                break;
            case 'Exit':
                db.end();
        }
        
    }); 
};

function addDepartment(sql){
    inquirer.prompt({
        type: 'input',
        name: 'departmentName',
        message: 'Enter The New Department: '
    })
    .then(input => {
        console.log(input.departmentName);
        db.query(sql, input.departmentName, (err, rows) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log('Department added!');
        });
        promptHandler();
    });    
};

function addRole(sql){    
    let choices = [];
    db.query(`SELECT * FROM departments`, (err, rows) => {
        if(err){
            console.log(err);
            return;
        }
        for (let i = 0; i < rows.length; i++) {            
            choices[i] = {value: rows[i].id, name: rows[i].name};
        }
    });
    inquirer.prompt([{
        type: 'text',
        name: 'title',
        message: 'Enter Title Of New Role: '
    },{
        type: 'text',
        name: 'salary',
        message: 'Enter Salary For This Role: $'
    },{
        type: 'list',
        name: 'department_id',
        message: 'Choose The Department For This Role: ',
        choices: choices
    }])
    .then(answers => {
        let role = [answers.title, answers.salary, answers.department_id];
        db.query(sql, role, (err, rows) => {
            if(err){
                console.log(err);
                return;
            }
            console.log('Role added!');
        });
        promptHandler();
    });
};

function addEmployee(sql){
    let roles = [];
    let managers = [];
    db.query(`SELECT id, title FROM roles`, (err, rows) => {
        if(err){
            console.log(err);
            return;
        }
        for (let i = 0; i < rows.length; i++) {            
            roles[i] = {value: rows[i].id, name: rows[i].title};
        }
    });

    let managerQuery = `SELECT employees.*, roles.title AS role_title FROM employees LEFT JOIN roles ON employees.role_id = roles.id`;
    db.query(managerQuery, (err, rows) => {
        if(err){
            console.log(err);
            return;
        }
        
        for (let i = 0; i < rows.length; i++) {
            if (rows[i].role_title === 'manager') {
                managers[i] = {value: rows[i].id, name: rows[i].first_name + ' ' + rows[i].last_name};
            }
            
        }
        managers.push({value: null, name: 'N/A'});
    });
    inquirer.prompt([{
        type: 'text',
        name: 'first_name',
        message: 'Enter Your First Name: '
    },{
        type: 'text',
        name: 'last_name',
        message: 'Enter Your Last Name: '
    },{
        type: 'list',
        name: 'roles',
        message: 'Choose A Role For This Employee: ',
        choices: roles
    },{
        type: 'list',
        name: 'manager',
        message: 'Choose A Manager Or Select N/A: ',
        choices: managers
    }])
    .then(answers => {
        let employee = [answers.first_name, answers.last_name, answers.roles, answers.manager];
        db.query(sql, employee, (err, rows) => {
            if(err){
                console.log(err);
                return;
            }
            console.log('Employee added!');
        });
        promptHandler();
    });
};

function updateEmployee(sql){

    const viewEmployees = `SELECT employees.*, roles.title AS role_title FROM employees LEFT JOIN roles ON employees.role_id = roles.id`; 
    db.query(viewEmployees, (err, rows) => {
        if(err){
            console.log(err);
            return;
        }
        console.info('\n=============');
        console.table(rows);
        console.info('=============');
    });
    
    let roles = [];
    db.query(`SELECT id, title FROM roles`, (err, rows) => {
        if(err){
            console.log(err);
            return;
        }
        for (let i = 0; i < rows.length; i++) {            
            roles[i] = {value: rows[i].id, name: rows[i].title};
        }
    });

    inquirer
        .prompt([{
            type: 'text',
            name: 'update_id',
            message: 'From the above table enter the employees ID number to change their role: '
        },{
            type: 'list',
            name: 'roles',
            message: 'Choose A Role For This Employee: ',
            choices: roles
        }])
        .then(answers => {
            //UPDATE employees SET role_id = ? WHERE id = ?
            let update = [answers.roles, answers.update_id];
            db.query(sql, update, (err, rows) => {
                if(err){
                    console.log(err);
                    return;
                }
                console.log('Employee updated!');
            });
            promptHandler();
        });
};

function viewAll(sql){
    
    db.query(sql, (err, rows) => {
        if(err){
            console.log(err);
            return;
        }
        console.info('\n=============');
        console.table(rows);
        console.info('=============');
        promptHandler();
    });
    return;
};

promptHandler();