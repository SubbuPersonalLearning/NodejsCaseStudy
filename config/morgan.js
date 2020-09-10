const morgan = require('morgan');


morgan.token('message', (req, res) => res.locals.errorMessage || '');

const successResponseFormat = `method :url :status - :response-time ms`;
const errorResponseFormat = `method :url :status - :response-time ms - message: :message`;

const successHandler = morgan(successResponseFormat, {
    skip: (req, res) => res.statusCode >= 400,
    stream: { write: (message) => console.info(message.trim()) },
  });
  
  const errorHandler = morgan(errorResponseFormat, {
    skip: (req, res) => res.statusCode < 400,
    stream: { write: (message) => console.error(message.trim()) },
  });
  
  module.exports = {
    successHandler,
    errorHandler,
  };
  