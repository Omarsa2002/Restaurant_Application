const {transports, createLogger, format} = require('winston');
const CONFIG  = require('../config/config');

var options = {
    file: {
      level: 'info',
      filename: CONFIG.log_file_location,
      handleExceptions: true,
      json: true,
      maxsize: 10485760, // 5MB
      maxFiles: 10,
      colorize: false,
      timestamp: true
    },
    console: {
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
      timestamp: true
    },
};
const logger = createLogger({
  format: format.combine(
      format.timestamp(),
      format.json()
  ),
  transports: [
    new transports.File(options.file),
    new transports.Console(options.console)
  ],
  exitOnError: false, // do not exit on handled exceptions
});



logger.stream = {
    write: function(message, encoding) {
        // use the 'info' log level so the output will be picked up by both transports (file and console)
        logger.info(message);
    },
};

module.exports = logger;