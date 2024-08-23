exports.ensureAuthenticated = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  }
  res.status(401).json({ msg: 'Unauthorized, please log in.' });
};

exports.ensureAdmin = (req, res, next) => {
  if (req.session && req.session.user && req.session.user.role === 'Admin') {
    return next();
  }
  res.status(403).json({ msg: 'Forbidden, Admins only.' });
};
