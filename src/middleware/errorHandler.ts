import { Request, Response, NextFunction } from "express";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error(err.stack);

  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong";
  let errorDetails = err;

  if (err.name === "CastError" && err.kind === "ObjectId") {
    statusCode = 404;
    message = "Resource not found";
    errorDetails = { name: "CastError", message: "Invalid ID" };
  }

  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation failed";
    errorDetails = {
      name: "ValidationError",
      errors: err.errors,
    };
  }

  // Duplicate key error
  if (err.code === 11000) {
    statusCode = 400;
    message = "Duplicate field value entered";
    errorDetails = {
      name: "DuplicateKeyError",
      message: "Duplicate key error",
      keyValue: err.keyValue,
    };
  }

  res.status(statusCode).json({
    success: false,
    message: message,
    error: errorDetails,
  });
};
