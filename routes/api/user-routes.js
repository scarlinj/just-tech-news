const router = require('express').Router();
const {
    User
} = require('../../models');

// Do not use "user" in any routes - will take these routes and implement them to another router instance and then prefix with /user

// GET /api/users
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method)
    // User inherits functionality from Sequelize Model class - findAll is one of those methods
    // this is the same as "SELECT * FROM users;" in SQL
    User.findAll({
            // to not return passwords in the GET route, exclude passwords here
            attributes: {
                // can exclude passwords to hide them, if needed.
                // exclude: ['password']
            }
        })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
            return
        });
});

// GET /api/users/1
router.get('/:id', (req, res) => {
    // use findOne similar to findAll to select individual user
        // this is the same as "SELECT * FROM users WHERE id = 1;" in SQL
    User.findOne({
        // when finding a user, do not want to expose their password - exclude password.  You can also separately hash the password with bcrypt to protect this data.
        // attributes: { exclude: ['password'] },
        // using the where option to indicate we want to find a user where its id value equals whatever req.params.id is
        where: {
                id: req.params.id
            }
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({
                    message: 'No user found with this id'
                });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// create a user
// POST /api/users
router.post('/', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    // SQL would look like:  INSERT INTO users
    //                      (username, email, password)
    //                      VALUES
    //                      ("Lernantino", "lernantino@gmail.com", "password1234");
    User.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.post('/login', (req, res) => {
    // Query operation
    // expects {email: 'lernantino@gmail.com', password: 'password1234'}
    // if find a user, can call function to check password
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({
                message: 'No user with that email address!'
            });
            return;
        }

        // Verify user
        const validPassword = dbUserData.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({
                message: 'Incorrect password!'
            });
            return;
        }

        res.json({
            user: dbUserData,
            message: 'You are now logged in!'
        });
    });
});

// PUT /api/users/1
router.put('/:id', (req, res) => {
    // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
    // SQL would look like:
    // UPDATE users
    // SET username = "Lernantino", email = "lernantino@gmail.com", password = "newPassword1234"
    // WHERE id = 1;
    // if req.body has exact key/value pairs to match the model, you can just use `req.body` instead
    // pass in req.body instead to only update what's passed through
    User.update(req.body, {
            individualHooks: true,
            where: {
                id: req.params.id
            }
        })
        .then(dbUserData => {
            if (!dbUserData[0]) {
                res.status(404).json({
                    message: 'No user found with this id'
                });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// DELETE /api/users/1
router.delete('/:id', (req, res) => {
    // to delete data, use the .destroy() method
    User.destroy({
            where: {
                id: req.params.id
            }
        })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({
                    message: 'No user found with this id'
                });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;