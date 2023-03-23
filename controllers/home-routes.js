const router = require('express').Router();
const sequelize = require('../config/connection');
const { Post, User, Comment, Vote } = require('../models');

// render a homepage, since we don't have the HTML.  This gets all posts.
router.get('/', (req, res) => {

  // console.log(req.session);
  console.log('loaded home-routes');

    Post.findAll({
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
        // pass a single post object into the homepage template
        console.log(dbPostData[0]);
        // render the posts array in the homepage template
        res.render('homepage', { posts, loggedIn: req.session.loggedIn });
      })
      .catch(err => {
        console.log(err);
        res.status(500).json(err);
      });
  });

// check for a session, then redirect to homepage if session exists
router.get('/login', (req, res) => {
  if (req.session.loggedIn) {
    res.redirect('/');
    console.log("redirect to home.");
    return;
  }
    // do not need any variables - do not need a second argument to render login page
    res.render('login');
});

module.exports = router;