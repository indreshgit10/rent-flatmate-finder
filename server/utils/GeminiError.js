class GeminiError extends Error {
  constructor(message) {
    super(message);
    this.name = 'GeminiError';
    this.isOperational = true;
  }
}

module.exports = GeminiError;
