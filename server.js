const express = require("express");
const logger = require("morgan");
const fs = require("require");
const inquire = require("inquire");

const app = express();
const PORT = 8080;

app.use(express.urlencoded({extended: true }));//this is the middleware
app.use(express.json());
app.use(logger("dev"));
app.use(express.static("public"));//fixes everything!

