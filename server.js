const db = require('./db/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');

// starts server after database connection
db.connect(err => {
    if(err) throw err;
    console.log('Database connected.');
});


// const addEmployee = [{}];

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
                addDepartment();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Add Employee':
        
                break;
            case 'Update An Employees Role':

                break;
            case 'Exit':
                return;
        }
        
    }); 
};

function addDepartment(){
    const sql = `INSERT INTO departments (name) VALUES (?)`;
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
        });
        promptHandler();
    });    
};

function addRole(){
    const addRole = [{
        type: 'text',
        name: 'roleName',
        message: 'Enter The New Role: '
    },{
        type: 'text',
        name: 'salary',
        message: 'Enter Salary For This Role: '
    },];
    inquirer.prompt({
        
    })
    .then()
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