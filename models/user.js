// import Model and DataTypes from Sequelize
// Model allows us to create model class.  Must use "extends" to assign properties to another class
const {
    Model,
    DataTypes
} = require('sequelize');
const sequelize = require('../config/connection');
const bcrypt = require('bcrypt');

// create our User model
class User extends Model {
    // set up method to run on instance data (per user) to check password
    // create an instance method on the User model definition to access the password property of each user instance
    // include an instance method called checkPassword that takes in the plaintext password retrieved from the client request at req.body.email and compares that with the hashed password.
    checkPassword(loginPw) {
        // encrypt password with bcrypt - access User properties with "this", then extend password
        return bcrypt.compareSync(loginPw, this.password);
    }
}

// define table columns and configuration
User.init({
    // TABLE COLUMN DEFINITIONS GO HERE
    // define an id column
    id: {
        // use the special Sequelize DataTypes object provide what type of data it is
        type: DataTypes.INTEGER,
        // this is the equivalent of SQL's `NOT NULL` option
        allowNull: false,
        // instruct that this is the Primary Key
        primaryKey: true,
        // turn on auto increment
        autoIncrement: true
    },
    // define a username column
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    // define an email column
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        // there cannot be any duplicate email values in this table
        unique: true,
        // if allowNull is set to false, we can run our data through validators before creating the table data
        validate: {
            isEmail: true
        }
    },
    // define a password column
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            // this means the password must be at least four characters long
            len: [4]
        }
    }
}, {
    hooks: {
        // set up beforeCreate lifecycle "hook" functionality

        // The async/await function below replaces the above beforeCreate function
        async beforeCreate(newUserData) {
            newUserData.password = await bcrypt.hash(newUserData.password, 10);
            return newUserData;
        },
        // set up beforeUpdate lifecycle "hook" functionality
        async beforeUpdate(updatedUserData) {
            updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
            return updatedUserData;
        }
    },
    // the below causes errors - did adding hooks above break the code?  should this be a different format?  Add a function before {, similar to above?  Example code does not have that.
    // removed {} aroudn the below and this allowed npm to start

    // TABLE CONFIGURATION OPTIONS GO HERE (https://sequelize.org/v5/manual/models-definition.html#configuration))

    // pass in our imported sequelize connection (the direct connection to our database)
    sequelize,
    // don't automatically create createdAt/updatedAt timestamp fields
    timestamps: false,
    // don't pluralize name of database table
    freezeTableName: true,
    // use underscores instead of camel-casing (i.e. `comment_text` and not `commentText`)
    underscored: true,
    // make it so our model name stays lowercase in the database
    modelName: 'user'

});

module.exports = User;