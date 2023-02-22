const router = require('express').Router();

router.get('/', (req, res) => {
// render a homepage, since we don't have the HTML
  res.render('homepage');
});

module.exports = router;