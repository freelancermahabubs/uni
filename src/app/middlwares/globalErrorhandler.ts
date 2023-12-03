/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import { ErrorRequestHandler } from 'express';
import { TErrorSources } from '../interface/error';
import config from '../config';
import { ZodError } from 'zod';
import handleZoderror from '../errors/handleZoderror';
import handleValidationError from '../errors/handleValidationError';
const globalErrorHandler: ErrorRequestHandler = (error, req, res, next) => {
  let statusCode = 500;
  let message = 'Something went Wrong!';

  let errorSources: TErrorSources = [
    {
      path: '',
      message: 'Something went Wrong!',
    },
  ];

  if (error instanceof ZodError) {
    const simplifiedError = handleZoderror(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  } else if (error?.name === 'ValidationError') {
    const simplifiedError = handleValidationError(error);
    statusCode = simplifiedError?.statusCode;
    message = simplifiedError?.message;
    errorSources = simplifiedError?.errorSources;
  }
  return res.status(statusCode).json({
    success: false,
    message,
    errorSources,
    stack: config.NODE_ENV === 'development' ? error?.stack : null,
  });
};

export default globalErrorHandler;
