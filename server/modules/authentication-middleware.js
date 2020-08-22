/**
 * Check if the user is logged in
 * @param {*} req for the request
 * @param {*} res for the response
 * @param {*} next is sent automatically since this is middleware
 */

const rejectUnauthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    // They were authenticated so continue with the request.
    next();
  } else {
    // The user isn't authenticated/signed in so block the request.
    res.sendStatus(403);
  }
};

module.exports = { rejectUnauthenticated };
