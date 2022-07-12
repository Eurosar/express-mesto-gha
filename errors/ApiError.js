class ApiError extends Error {
  constructor(status, message) {
    super();
    this.message = message;
    this.status = status;
  }

  static NotFoundError(message) {
    return new ApiError(404, message);
  }

  static BadRequestError(message) {
    return new ApiError(400, message);
  }

  static InternalError(message) {
    return new ApiError(500, message);
  }
}

module.exports = ApiError;
