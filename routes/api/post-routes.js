const router = require('express').Router();
const {
    // include the User route to retrieve information about user associated with each post.
    // In a query to the post table, we would like to retrieve not only information about 
    // each post, but also the user that posted it. With the foreign key, user_id, we can 
    // form a JOIN, an essential characteristic of the relational data model.
    Post,
    User
} = require('../../models');

// get all posts along with the users
router.get('/', (req, res) => {
    // console.log('======================');
    Post.findAll({
      // Query configurationcreated_at is automatically generated because of Sequelize timestamp
      // 
      attributes: ['id', 'post_url', 'title', 'created_at'],
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
    attributes: ['id', 'post_url', 'title', 'created_at'],
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

module.exports = router;