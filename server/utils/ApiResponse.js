class ApiResponse {
  constructor(status = 200, message = "success", suceess = true, data = null) {
    this.status = status;
    this.message = message;
    this.suceess = suceess;
    this.data = data;
  }
}

module.exports = ApiResponse;
