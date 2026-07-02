require('dotenv').config();

const http = require('http');
const app = require('./app');
const connectDB = require('./config/db');
const { port } = require('./config/env');
const { initSocket } = require('./socket');

connectDB().then(() => {
  const server = http.createServer(app);
  
  initSocket(server);

  server.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
});
