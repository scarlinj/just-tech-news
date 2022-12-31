const express = require('express');
const routes = require('./routes');
//import  sequelize from config/connection.js
const sequelize = require('./config/connection');

const app = express();
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
    // force: true would cause Sequelize to drop and recreate database tables on startup.  We want database to understand something changed.
    force: false
}).then(() => {
    app.listen(PORT, () => console.log('Now listening'));
});