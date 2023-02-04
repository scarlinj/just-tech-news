const router = require('express').Router();
const sequelize = require('../../config/connection');
const {
    // include the User route to retrieve information about user associated with each post.
    // In a query to the post table, we would like to retrieve not only information about 
    // each post, but also the user that posted it. With the foreign key, user_id, we can 
    // form a JOIN, an essential characteristic of the relational data model.
    Post,
    User,
    Vote
} = require('../../models');

// get all posts along with the users
router.get('/', (req, res) => {
    // console.log('======================');
    Post.findAll({
      // Query configurationcreated_at is automatically generated because of Sequelize timestamp
      // also include votes with sequelize.literal to select votes from the post's table
      attributes: ['id', 'post_url', 'title', 'created_at', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
      order: [['created_at', 'DESC']],
    include: [
        {
          model: User,
          attributes: ['username']
        }
      ]
  })
  .then(dbPostData => res.json(dbPostData))
  .catch(err => {
    console.log(err);
    res.status(500).json(err);
  });
});

router.get('/:id', (req, res) => {
  Post.findOne({
    where: {
      id: req.params.id
    },
    attributes: ['id', 'post_url', 'title', 'created_at', [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'), 'vote_count']],
    include: [
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
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post('/', (req, res) => {
  // expects {title: 'Taskmaster goes public!', post_url: 'https://taskmaster.com/press', user_id: 1}
  Post.create({
    title: req.body.title,
    post_url: req.body.post_url,
    user_id: req.body.user_id
  })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
});

// PUT /api/posts/upvote
router.put('/upvote', (req, res) => {
  Vote.create({
    user_id: req.body.user_id,
    post_id: req.body.post_id
  })
    .then(dbPostData => res.json(dbPostData))
    .catch(err => res.json(err));
});

// PUT /api/users/1
// we used the request parameter to find the post, then used the req.body.title value to replace the title of the post. 
// In the response, we sent back data that has been modified and stored in the database.
router.put('/:id', (req, res) => {
  Post.update( {
          title: req.body.title
      },
      {where: { id: req.params.id }
    }
    )
      .then(dbPostData => {
          if (!dbPostData[0]) {
              res.status(404).json({
                  message: 'No post found with this id'
              });
              return;
          }
          res.json(dbPostData);
      })
      .catch(err => {
          console.log(err);
          res.status(500).json(err);
      });
      // create the vote
Vote.create({
  user_id: req.body.user_id,
  post_id: req.body.post_id
}).then(() => {
  // then find the post we just voted on
  return Post.findOne({
    where: {
      id: req.body.post_id
    },
    attributes: [
      'id',
      'post_url',
      'title',
      'created_at',
      // use raw MySQL aggregate function query to get a count of how many votes the post has and return it under the name `vote_count`
      [
        sequelize.literal('(SELECT COUNT(*) FROM vote WHERE post.id = vote.post_id)'),
        'vote_count'
      ]
    ]
  })
  .then(dbPostData => res.json(dbPostData))
  .catch(err => {
    console.log(err);
    res.status(400).json(err);
  });
});
},

router.delete('/:id', (req, res) => {
  Post.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbPostData => {
      if (!dbPostData) {
        res.status(404).json({ message: 'No post found with this id' });
        return;
      }
      res.json(dbPostData);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json(err);
    });
}));

module.exports = router;