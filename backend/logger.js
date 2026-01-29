const winston = require('winston');


const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }), // Only errors
    new winston.transports.File({ filename: 'logs/combined.log' }), // All info logs
  ],
});
module.exports = logger;
