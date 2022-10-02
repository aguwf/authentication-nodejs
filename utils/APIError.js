class APIError extends Error {
  constructor(message, code, status = 'error', isOperational = true) {
    super();
    this.name = this.constructor.name; // good practice
    this.message = message;
    this.status = code;
    this.code = code;
    this.isOperational = isOperational;
  }
}

const handleError = (err, res) => {
  const { status, code, message } = err;
  res.status(code).json({
    status,
    code,
    message,
  });
};

module.exports = { APIError, handleError };
