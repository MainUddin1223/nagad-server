import ApiError from "./apiErrorHandler.js";

const globalErrorHandler = (error, req, res, next) => {
  let statusCode = 500;
  let message = "Internal server error";
  let errorMessages = [];
  console.log("--------------error---------------", error);

  if (error instanceof ApiError) {
    statusCode = error.statusCode;
    message = error.message;
    errorMessages = error.message
      ? [
          {
            path: "",
            message: error.message,
          },
        ]
      : [];
  } else if (error instanceof Error) {
    message = error.message;
    errorMessages = error.message
      ? [
          {
            path: "",
            message: error.message,
          },
        ]
      : [];
  }
  res.status(statusCode).json({
    success: false,
    message,
    errorMessages,
    stack: process.env.NODE_ENV !== "production" ? error.stack : undefined,
  });
};

export default globalErrorHandler;
