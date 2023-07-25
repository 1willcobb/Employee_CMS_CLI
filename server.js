const inquirer = require('inquirer');
const chalk = require('chalk');
const express = require('express')
const { logRandomColor } = require('./helpers/helpers')

chalk.level = 3;
const PORT = process.env.PORT || 3001;

const app = express();

app.use('')


app.listen(PORT, () => {
  logRandomColor(`Connected. Server listening on port localhost:${PORT}`)
})



