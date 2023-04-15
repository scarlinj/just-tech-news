const router = require('express').Router();
const { Comment } = require('../../models');
const userAuth = require('../../utils/auth');

// Do not use "comment" in any routes - will take these routes and implement them to another router instance and then prefix with /comment


router.get('/', (req, res) => {
    // console.log('======================');
    Comment.findAll({
      // Query configuration created_at is automatically generated because of Sequelize timestamp
      
    //   attributes: ['id', 'comment_text', 'user_id', 'post_id', 'updated_at', 'created_at'],
    //   order: [['created_at', 'DESC']],
    // include: [
    //     {
    //       model: User,
    //       attributes: ['username']
    //     }
      // ]
    })
    .then(dbCommentData => res.json(dbCommentData))
    .catch(err => {
      console.log(err);
      // only can call res once?
      res.status(500).json(err);
    });
});

router.post('/', userAuth, (req, res) => {
  if (req.session) {
    Comment.create({
        comment_text: req.body.comment_text,
        post_id: req.body.post_id,

        user_id: req.body.user_id
        
      })
        .then(dbCommentData => res.json(dbCommentData))
        .catch(err => {
          console.log(err);
          res.status(400).json(err);
        });
      }
});

router.delete('/:id', userAuth, (req, res) => {
  Comment.destroy({
    where: {
      id: req.params.id
    }
  })
    .then(dbCommentData => {
      if (!dbCommentData) {
        res.status(404).json({ message: 'No comment with this id' });
        return;
      }
      res.json(dbCommentData);
    })
    .catch(err => {
      console.log(err);
      // res.status(500).json(err);
    });
});

module.exports = router;