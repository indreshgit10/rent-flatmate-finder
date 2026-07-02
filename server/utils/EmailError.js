class EmailError extends Error {
  constructor(message) {
    super(message);
    this.name = 'EmailError';
    this.isOperational = true;
  }
}

module.exports = EmailError;
