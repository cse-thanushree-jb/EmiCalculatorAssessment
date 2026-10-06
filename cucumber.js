module.exports = {
require: ['features/step-definitions/**/*.js'],
requireModule: ['dotenv/config'],
format: ['progress', 'json:cucumber-report/report.json'],
publishQuiet: true
};