const debug = require('debug')('localbytes-server');

/**
 * Normalizes a port value to a number or false.
 * @param {string|number} val - The port value to normalize
 * @returns {number|string|boolean} - The normalized port value
 */
const normalizePort = (val) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

/**
 * Event listener for HTTP server "error" event.
 * @param {Object} error - Error object
 * @param {number|string} port - Port the server is attempting to listen on
 */
const onError = (error, port) => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

/**
 * Event listener for HTTP server "listening" event.
 * @param {Object} server - HTTP server instance
 * @param {number|string} port - Port the server is listening on
 */
const onListening = (server, port) => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
  console.log(`Server is listening on ${bind}`);
};

/**
 * Creates and configures an HTTP server for the Express app.
 * @param {Object} app - Express application instance
 * @param {number|string} [portValue=process.env.PORT || "5000"] - Port to listen on
 * @returns {Object} HTTP server instance
 */
const createServer = (app, portValue = process.env.PORT || "5000") => {
  const http = require("http");
  
  // Normalize port
  const port = normalizePort(portValue);
  app.set("port", port);
  
  // Create HTTP server
  const server = http.createServer(app);
  
  // Set up event listeners
  server.on("error", (error) => onError(error, port));
  server.on("listening", () => onListening(server, port));
  
  return server;
};

module.exports = {
  normalizePort,
  onError,
  onListening,
  createServer
};
