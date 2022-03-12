const {CustomAPIError} = require('../errors/custom-error');

const errorHandler = (error, req, res, next) => {
  if (error instanceof CustomAPIError) {
    return res.status(error.status).json({message: error.message});
  } else {
    return res.status(500).json({message: 'Internal server error'});
  }
};

module.exports = errorHandler;
