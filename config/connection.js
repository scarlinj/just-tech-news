// import the Sequelize constructor from the library
const Sequelize = require('sequelize');

require('dotenv').config();

// use the const Sequelize you imported above in the database connection below
let sequelize;
// create connection to our database, pass in your MySQL information for username and password
// use process.env.DB_NAME as local environment variable to hide sensitive data when pushed to Heroku
// Sequelize prefers to work with mysql2 library instead of mysql - not working 2/20/2023.  Use mysql library
// use JawsDB to set up remote database below
if (process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL);
} else {
sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
    host: 'localhost',
    dialect: 'mysql',
    // mysql port is 3306
    port: 3306
});
}

module.exports = sequelize;