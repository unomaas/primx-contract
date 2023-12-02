const rejectUnauthenticated = (req, res, next) => {
  // check if logged in
  if (req.isAuthenticated()) {
    // They were authenticated! User may do the next thing
    // Note! They may not be Authorized to do all things
    next();
  } else {
    // failure best handled on the server. do redirect here.
    res.sendStatus(403);
  }
};

const rejectNonAdmin = (req, res, next) => {
  // check if logged in
  if (req.isAuthenticated() && req.user.permission_level <= 3) {
    // They were authenticated! User may do the next thing
    // Note! They may not be Authorized to do all things
    next();
  } else {
    // failure best handled on the server. do redirect here.
    res.sendStatus(403);
  }
}

const rejectNonSysAdmin = (req, res, next) => {
  // check if logged in
  if (req.isAuthenticated() && req.user.permission_level <= 1) {
    // They were authenticated! User may do the next thing
    // Note! They may not be Authorized to do all things
    next();
  } else {
    // failure best handled on the server. do redirect here.
    res.sendStatus(403);
  }
}

const isRegionalAdmin = (user) => {
  if (
    user &&
    user.region_id &&
    user.permission_level &&
    user.permission_level == 3
  ) {
    return true;
  }

  return false;
};

module.exports = { 
  rejectUnauthenticated,
  rejectNonAdmin,
  rejectNonSysAdmin,
  isRegionalAdmin,
 };
