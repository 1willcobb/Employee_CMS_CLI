const inquirer = require('inquirer');
const chalk = require('chalk');
const express = require('express')
const helpers = require('./helpers/helpers')

chalk.level = 3;
const PORT = process.env.PORT || 3001;

const app = express();


app.listen(PORT, () => {
  helpers.logRandomColor(`${header}\n\nConnected. Server listening on port localhost:${PORT}`)
})



