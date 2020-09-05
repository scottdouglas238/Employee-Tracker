CREATE database employees;

USE employees;

CREATE TABLE employees (
   id INT NOT NULL,
   first_name VARCHAR(30),
   last_name VARCHAR(30),
   title VARCHAR(30),
   department VARCHAR(30),
   salary INT NOT NULL,
   manager VARCHAR(30),
);