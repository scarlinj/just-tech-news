const express = require('express');
const routes = require('./routes');
//import  sequelize from config/connection.js
const sequelize = require('./config/connection');

const app = express();
// This PORT uses Heroku's process.env.PORT value when deployed and 3001 when run locally
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// turn on routes
app.use(routes);

// turn on connection to db and server - "sync" means Sequelize takes models and connects them to associate database tables.
// if this doesn't find a table, it will create one
sequelize.sync({
    // change this when you create new databases
    // "force: true" would cause Sequelize to drop and recreate database tables on startup.  We want database to understand when we change something, 
    // so this allows for us to make those changes while updating the project.
    // If we change the value of the force property to true, then the database connection must sync with the model definitions and associations. 
    // By forcing the sync method to true, we will make the tables re-create if there are any association changes
    force: false
}).then(() => {
    app.listen(PORT, () => console.log(`Now listening on port ${PORT}`));
});