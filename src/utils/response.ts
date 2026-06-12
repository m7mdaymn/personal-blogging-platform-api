import { Response } from 'express';

interface SuccessResponse<T = unknown> {
  success: true;
  message: string;
  data: T;
}

interface ErrorField {
  field: string;
  message: string;
}

interface ValidationErrorResponse {
  success: false;
  errors: ErrorField[];
}

interface StandardErrorResponse {
  success: false;
  message: string;
}

export const sendSuccess = <T>(
  res: Response,
  data: T,
  message: string,
  statusCode = 200
): void => {
  const response: SuccessResponse<T> = {
    success: true,
    message,
    data,
  };
  res.status(statusCode).json(response);
};

export const sendValidationError = (
  res: Response,
  errors: ErrorField[]
): void => {
  const response: ValidationErrorResponse = {
    success: false,
    errors,
  };
  res.status(400).json(response);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode: number
): void => {
  const response: StandardErrorResponse = {
    success: false,
    message,
  };
  res.status(statusCode).json(response);
};
