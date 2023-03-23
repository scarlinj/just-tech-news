const router = require('express').Router();
const {
    User,
    Post,
    Vote,
    Comment
} = require('../../models');

// Do not use "user" in any routes - will take these routes and implement them to another router instance and then prefix with /user

// GET /api/users
router.get('/', (req, res) => {
    // Access our User model and run .,findAll() method)
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
            return;
        });
});

// GET /api/users/1 - find a user's profile page
router.get('/:id', (req, res) => {
    // track number of times user visits their profile page
    if(!req.session.views){
        // if the views counter does not exist, create it
        req.session.views = 1;
        console.log('This is your first visit.');
    } else {
        // if it does exist, increase views by one
        request.session.views ++
        console.log(`You have visited ${request.session.views} times.`)
    }
    // use findOne similar to findAll to select individual user
        // this is the same as "SELECT * FROM users WHERE id = 1;" in SQL
    User.findOne({
        // when finding a user, do not want to expose their password - exclude password.  You can also separately hash the password with bcrypt to protect this data.
        attributes: { exclude: ['password'] },
        // using the where option to indicate we want to find a user where its id value equals whatever req.params.id is
        where: {
                id: req.params.id
            },
            include: [
                {
                model: Post,
                attributes: ['id', 'title', 'post_url', 'created_at']
                },
                // include the Comment model here:
                {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Post,
                    attributes: ['title']
                }
                },
                {
                model: Post,
                attributes: ['title'],
                through: Vote,
                as: 'voted_posts'
                }
            ]
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
        // the below gives our server easy access to the user's user_id, username, and a Boolean describing whether or not the user is logged in.
        .then(dbUserData => {
            req.session.save(() => {
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;
        // make sure the session created before sending back response, so variable wrapped in a callback
            res.json(dbUserData);
            });
        })
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
        // The instance method below is called on the user retrieved from the database, dbUserData. 
        // Because the instance method returns a Boolean, can use it in a conditional statement to check whether a user has been verified.
        const validPassword = dbUserData.checkPassword(req.body.password);

        if (!validPassword) {
            res.status(400).json({
                message: 'Incorrect password!'
            });
            return;
        }

        req.session.save(() => {
            // declare session variables
            // the below gives our server easy access to the user's user_id, username, and a Boolean describing whether or not the user is logged in.
            req.session.user_id = dbUserData.id;
            req.session.username = dbUserData.username;
            req.session.loggedIn = true;

        res.json({
            user: dbUserData,
            message: 'You are now logged in!'
        });
    });
});
});

router.post('/logout', (req, res) => {
    // send back a 204 status after session destroyed
    if (req.session.loggedIn) {
        req.session.destroy(() => {
        res.status(204).end();
        console.log("user has logged out.")
        });
    }
    else {
        res.status(404).end();
    }
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