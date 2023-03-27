const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment } = require('../models');

// render a user dashboard, since we don't have the HTML.  This gets all posts for the user.
router.get('/', (req, res) => {

    // console.log(req.session);
    console.log('loaded dashboard-routes');

    Post.findAll({
        where: {
            // use ID from session
            user_id: req.session.user_id
        },
    attributes: [
        'id',
        'post_url',
        'title',
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
    include: [
        {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
            model: User,
            attributes: ['username']
            }
        },
        {
            model: User,
            attributes: ['username']
        }
        ]
    })
        .then(dbPostData => {
          // entire array of posts to be in the template
          // This will loop over and map each Sequelize object into a serialized version of itself, saving the results in a new posts array, to plug into template
        const posts = dbPostData.map(post => post.get({ plain: true }));
          // pass a single post object into the dashboard template
        console.log(dbPostData[0]);
          // render the posts array in the homepage template
        res.render('dashboard', { posts, loggedIn: true });
        })
        .catch(err => {
        console.log(err);
        res.status(500).json(err);
        });
    });

    router.get('/edit/:id', (req, res) => {
    Post.findOne({
    where: {
        id: req.params.id
    },
    attributes: [
        'id',
        'post_url',
        'title',
        'created_at',
        [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']
    ],
    include: [
        {
        model: Comment,
        attributes: ['id', 'comment_text', 'post_id', 'user_id', 'created_at'],
        include: {
            model: User,
            attributes: ['username']
        }
        },
        {
        model: User,
        attributes: ['username']
        }
    ]
    })
    .then(dbPostData => {
    if (!dbPostData) {
    res.status(404).json({ message: 'No post found with this id' });
    return;
    }

        // serialize the data
        const post = dbPostData.get({ plain: true });

        res.render('edit-post', {
            post,
            loggedIn: true
            });
    })        .catch(err => {
        console.log(err);
        res.status(500).json(err);
        });
});

module.exports = router;
