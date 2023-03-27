const path = require('path');
const routes = require('./controllers');
const express = require('express');
// Use handlebars as template engine
const exphbs = require('express-handlebars');
// express-session library allows us to connect to the back end
const session = require('express-session');

const app = express();
// This PORT uses Heroku's process.env.PORT value when deployed and 3001 when run locally
// must call app below, since it is defined above
const PORT = process.env.PORT || 3001;
//import  sequelize from config/connection.js
const sequelize = require('./config/connection');
// connect-session-sequelize library automatically stores the sessions created by express-session into our database
// first, require npm module connect-session-sequelize, then pass through session.Store property
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const hbs = exphbs.create({});

// Use a secret stored in the .env file
const sess = {
    // store the secret below (will be something other than "super secret secret") - cookie read by server, compared to secret to make sure it wasn't modified by client.
    secret: process.env.SESSION_SECRET,
    // tell session to use cookies with cookie: {} (if you want to set further options for the cookie, such as maximum age, add options to this object)
    cookie: {},
    // resave forces session to be saved to session.Store, even if cookie hasn't been modified.  Default is true, but default is deprecated and the recommended setting is False.
    resave: false,
    // when make a new session, session is saved as part of Store
    saveUninitialized: true,
    // initialize sequelizeStore and pass through value of object of "db: sequlize."  Will create connection with db, set up session table, and save session in db. 
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(session(sess));

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));


// include stylesheet in public directory 
app.use(express.static(path.join(__dirname, 'public')));

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