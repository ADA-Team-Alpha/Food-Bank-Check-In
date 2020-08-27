require('dotenv').config();
const app = require('./server');
const connectSocket = require('./socket');

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT);
console.log("listening on port", PORT);
connectSocket(server);
