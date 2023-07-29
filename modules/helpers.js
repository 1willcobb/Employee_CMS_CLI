const db = require('../config/connection')
const inquirer = require('inquirer')

function queryAsync(query, values) {
    return new Promise((resolve, reject) => {
        db.query(query, values, (error, results) => {
            if (error) {
            reject(error);
            } else {
            resolve(results);
            }
        });
    });
}

const clearAnswers = () => {
    inquirer.prompt.answers = {};
}

module.exports = {
    queryAsync,
    clearAnswers
}