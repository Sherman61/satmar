const errorHandler = (err, req, res, next) => {
    console.error(err.message || "An error occurred");
    res.status(500).json({
      message: err.message || "An unexpected error occurred.",
    });
  };
  
  module.exports = errorHandler;
  