//this will download the http , its like importing the packages
const http = require('http');
const app = require('./app');

//application will listen at this port 
const port = process.env.PORT || 3000;

const server = http.createServer(app); //server created with the app file

server.listen(port, () => {
    console.log('Node server running on port ' + port);
  });