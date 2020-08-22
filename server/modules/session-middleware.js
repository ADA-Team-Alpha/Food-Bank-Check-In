const cookieSession = require('cookie-session');

/*
  The cookie session makes it so a user can enters their username and password one time,
  and then we can keep them logged in. We do this by giving them a really long random string
  that the browser will pass back to us with every single request. The long random string is
  something the server can confirm, and then we know that we have the right user.

  You can see this string that gets passed back and forth in the
  `application` -> `storage` -> `cookies` section of the chrome debugger.
*/

module.exports = cookieSession({
  secret: process.env.SERVER_SESSION_SECRET || 'secret',
  // This is the name of the req.variable. 'user' is convention, but not required.
  key: 'user',
  reSave: 'false',
  saveUninitialized: false,
  // Set to 1 hour - 60 min/hour * 60 s/min * 1000 ms/s.
  maxAge: 60 * 60 * 1000,
  secure: false
});
