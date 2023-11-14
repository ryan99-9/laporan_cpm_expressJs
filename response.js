const response = (statusCode, data, message, res) => {
  res.status(statusCode).json({
    payload: data,
    message: message,
    pagination: {
      prev: "",
      next: "",
      max: "",
    },
  });
};

module.exports = response;
