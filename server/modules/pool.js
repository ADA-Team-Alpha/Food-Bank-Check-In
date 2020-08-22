const pg = require('pg');
const url = require('url');

let config = {};

/**
 * Connect the modules/routes to a remote/local database.
 * The first configuration is for connection to Heroku, see:
 * https://devcenter.heroku.com/articles/postgres-connection-pooling
 * The second connection is for development on the local computer.
 */

if (process.env.DATABASE_URL) {
  // Heroku automatically adds a DATABASE_URL to its env at runtime
  // so extract each section of that url by splitting the string.
  // A shortened example url is:
  // postgres://vouurystpd:e4739a8dd45ce143f@ec2-1-94.compute-1.amazonaws.com:5432/d4l5ku9
  // Outlining each key:
  // postgres://[USER]vouurystpd[USER]:[PASSWORD]e4739a8dd45ce143f[PASSWORD]@
  // [HOST]ec2-1-94.compute-1.amazonaws.com[HOST]:[PORT]5432[PORT]/[DATABASE]d4l5ku9[DATABASE]
  //
  // Once connected run this command to print the above info: heroku pg:credentials:url
  const params = url.parse(process.env.DATABASE_URL);
  const auth = params.auth.split(':');

  config = {
    user: auth[0],
    password: auth[1],
    host: params.hostname,
    // The port should be 5432 but extract it anyway.
    port: params.port,
    database: params.pathname.split('/')[1],
    ssl: { rejectUnauthorized: false },
    // Max number of clients in the pool.
    max: 20,
    // How long a client is allowed to remain idle before being closed.
    idleTimeoutMillis: 30000
  };
} else {
  // No DATABASE_URL was in the env so run on the local development computer.
  config = {
    host: 'localhost',
    port: 5432,
    database: process.env.DATABASE_NAME,
    // Max number of clients in the pool.
    max: 10,
    // How long a client is allowed to remain idle before being closed.
    idleTimeoutMillis: 30000
  };
}

// This creates the actual pool that will be accessed from other modules.
const pool = new pg.Pool(config);

// The pool will emit an error on behalf of any idle clients
// it contains if a backend error or network partition happens.
pool.on('error', (err) => {
  console.log('Unexpected error on idle client', err);
  process.exit(-1);
});

module.exports = pool;
