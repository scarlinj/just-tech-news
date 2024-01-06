// had "next" in group with req, res, but that caused site to crash.  Removed this to fix error.

const userAuth = (req, res) => {
  if (!req.session.user_id) {
    res.redirect('/login');
  } else {
    console.log
    res.redirect('/dashboard');
  }
};

module.exports = userAuth;