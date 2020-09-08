const mysql = require("mysql");
const inquirer = require("inquirer");
const { response } = require("express");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "employees"
  });

  connection.connect(function(err) {
    if (err) throw err;
    start();
  });


const start = () => {
    inquirer.prompt([
      {
        name: "prompt",
        type: "list",
        message: "What would you like to do?",  
        choices: ["View all employees", "View all departments", "View all roles", "Add employee", 
        "Remove employee", "Add department", "Remove department", "Add role", "Remove role"],
      }
    ])
    .then(function(response){
    if (response.prompt === "View all employees"){
      viewAllEmployees();
      start();
    }else if(response.prompt === "View all departments"){
      viewDepartments();
      start();
    }else if(response.prompt === "View all roles"){
      viewRoles();
      start();
    }else if(response.prompt === "Add employee"){
      addemployeePrompt();
    }else if(response.prompt === "Remove employee"){
      removeEmployee();
    }else if(response.prompt === "Add department"){
      addDepartment();
    }else if(response.prompt === "Remove department"){
      removeDepartment();
    }else if(response.prompt === "Add role"){
      addRole();
    }else if(response.prompt === "Remove role"){
      removeRole();
    }
    });
};

const addemployeePrompt = () => {
  connection.query("SELECT role.title, role.salary, department.departmentName FROM role INNER JOIN department ON role.department_id=department.id", function(err, results){
    if(err) throw err;
    inquirer.prompt([
      {
        type: "input",
        name: "firstName",
        message: "What is the employee's first name?"
      },
      {
        type: "input",
        name: "lastName",
        message: "What is the employee's last name?"
      },
      {
        type: "list",
        name: "role",
        message: "What is the employee's role?",
        choices: function(){
          let choiceArray = [];
          for (let i = 0; i < results.length; i++) {
            choiceArray.push(results[i].title);
          }
          return choiceArray;
        }
      },
      {
        type: "list",
        name: "manager",
        message: "Who is the employee's manager?",
        choices: ["Matt", "Mindy", "Sarah", "Christina"]
      }
    ]).then(function(response){
      if(response.role === "Cook"){
        response.role = "1";
      }
      if(response.role === "Server"){
        response.role = "2";
      }
      if(response.role === "Bartender"){
        response.role = "3";
      }
      if(response.role === "Accountant"){
        response.role = "4";
      }
      if(response.role === "Pianist"){
        response.role = "5";
      }
      if(response.role === "Singer"){
        response.role = "6";
      }
      if(response.role === "Software Programer"){
        response.role = "7";
      }
      if(response.role === "Maintenance Worker"){
        response.role = "8";
      }
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: response.firstName,
          last_name: response.lastName,
          role_id: response.role,
          manager_id: response.manager,
        },
        function(err){
          if (err) throw err;
          console.log("You updated employees.")
          start();
        }
        )
      })
  })
    };
    
    const removeEmployee = () => {
      connection.query("SELECT * FROM employee", function(err, results){
    if(err) throw err;
    inquirer.prompt([
      {
        type: "list",
        name: "remove",
        message: "Which employee would you like to remove?",
        choices: function(){
           let choiceArray = [];
           for(let i = 0; i < results.length; i++){
             choiceArray.push(results[i].first_name + " " + results[i].last_name);
           }
           return choiceArray;
        }
      }
     ])
     .then(function(answer){
      let chosenName;
      for(let i = 0; i < results.length; i++){
        if(results[i].first_name + " " + results[i].last_name === answer.remove){
          chosenName = results[i];
        }
      }
      connection.query(
        `DELETE FROM employee WHERE first_name='${chosenName.first_name}'`
      )
        console.log(`(${chosenName.first_name} ${chosenName.last_name} has been removed from employees)`)
        start();
    
    })
  })
}

const addDepartment = () => {
   inquirer.prompt([
     {
       type: "input",
       name: "department",
       message: "What department would you like to add?"
     }
   ]).then(function(response){
    connection.query(
      "INSERT INTO department SET ?",
      {
        departmentName: response.department,
      },
      function(err){
        if (err) throw err;
        console.log("You successfully added a new department!")
        start();
      }
    )
   })
};

const removeDepartment = () => {
  connection.query("SELECT * FROM department", function(err, results){
    if(err) throw err;
    inquirer.prompt([
      {
        type: "list",
        name: "removeDept",
        message: "which department would you like to remove?",
        choices: function(){
          let choiceArray = [];
          for (let i = 0; i < results.length; i++) {
            choiceArray.push(results[i].departmentName);
          }
          return choiceArray;
        }
      }
    ])
    .then(function(answer){
      console.log(answer)
      let chosenDept;
      for (let i = 0; i < results.length; i++) {
        if(results[i].departmentName === answer.removeDept){
          chosenDept = results[i];
          console.log(chosenDept.departmentName);
        }
      }
      connection.query(
        `DELETE FROM department WHERE departmentName='${chosenDept.departmentName}'`
          )
        console.log(`${chosenDept.departmentName} has been removed from departments!`);
        start();
    })
  })
}

const addRole = () => {
  inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "What is the title of this role?"
    },
    {
      type: "input",
      name: "salary",
      message: "What is this role's salary?"
    },
    {
      type: "input",
      name: "department_id",
      message: "What is the department id?"
    }
  ]).then(function(response){
    connection.query(
      "INSERT INTO role SET ?",
      {
        title: response.title,
        salary: response.salary,
        department_id: response.department_id
      },
      function(err){
        if(err) throw err;
        console.log("You have added a new role!");
        start();
      }
    )
  })
}

const removeRole = () => {
  connection.query("SELECT * FROM role", function(err, results){
    if(err) throw err;
    inquirer.prompt([
      {
        type: "list",
        name: "removeRole",
        message: "Which role would you like to remove?",
        choices: function(){
          let choiceArray = [];
          for (let i = 0; i < results.length; i++) {
            choiceArray.push(results[i].title);
          }
          return choiceArray;
        }
      }
    ])
    .then(function(answer){
      let chosenRole;
      for (let i = 0; i < results.length; i++) {
        if(results[i].title === answer.removeRole){
          chosenRole = results[i];
        }
      }
      connection.query(
        `DELETE FROM role WHERE title='${chosenRole.title}'`
      )
      console.log(`${chosenRole.title} has been removed from roles!`);
      start();
    })
  })
}

const viewAllEmployees = () => {
   connection.query("SELECT employee.first_name, employee.last_name, role.title, department.departmentName, role.salary, employee.manager_id FROM employee INNER JOIN role ON employee.role_id=role.id INNER JOIN department ON role.department_id=department.id", function(err, res){
     if (err) throw err;
     console.log("------------------------------------------------------");
     console.table(res);
   }
   )
};

const viewDepartments = () => {
  connection.query("SELECT * FROM department", function(err, res){
    if(err) throw err;
    console.log("-------------------------------------------------------");
    console.table(res);
  })
}

const viewRoles = () => {
  connection.query("SELECT role.title, role.salary, department.departmentName FROM role INNER JOIN department ON role.department_id=department.id", function(err, res){
    if(err) throw err;
    console.log("-------------------------------------------------------");
    console.table(res);
  })
}