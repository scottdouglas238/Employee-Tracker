const mysql = require("mysql");
const inquirer = require("inquirer");

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
      start();
    }else if(response.prompt === "Add department"){
      addDepartment();
      start();
    }else if(response.prompt === "Remove department"){
      removeDepartment();
      start();
    }else if(response.prompt === "Add role"){
      addRole();
      start();
    }else if(response.prompt === "Remove role"){
      removeRole();
      start();
    }
    });

};
const addemployeePrompt = () => {
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
        choices: ["Sales Lead", "Salesperson", "Software Engineer", "Account Manager", "Accountant"]
      },
      {
        type: "list",
        name: "manager",
        message: "Who is the employee's manager?",
        choices: ["Matt", "Mindy", "Sarah", "Christina"]
      }
    ]).then(function(response){
      console.log(response)
      connection.query(
        "INSERT INTO employee SET ?",
        {
          first_name: response.firstName,
          last_name: response.lastName,
          // title: response.role,
          // manager: response.manager,
        },
        function(err){
          if (err) throw err;
          console.log("You updated employees.")
          start();
        }
      )
    })
};

const viewAllEmployees = () => {
   connection.query("SELECT * FROM employee", function(err, res){
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
  connection.query("SELECT * FROM role", function(err, res){
    if(err) throw err;
    console.log("-------------------------------------------------------");
    console.table(res);
  })
}
