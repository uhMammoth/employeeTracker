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
                sql = `SELECT * FROM roles`; 
                viewAll(sql);
                break;
            case 'View All Employees':
                sql = `SELECT * FROM employees`; 
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

                break;
            case 'Exit':
                return;
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