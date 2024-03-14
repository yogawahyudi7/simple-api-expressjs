const response = (res, status, data) => {
  res.status(status).json({
    status: status,
    data: data,
  });
};

module.exports = response;
