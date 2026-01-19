class ApiError extends Error {
  constructor(status, message, suceess = false, data = null) {
    super(message);
    this.status = status;
    this.suceess = suceess;
    this.data = data;
  }
}

module.exports = ApiError;
