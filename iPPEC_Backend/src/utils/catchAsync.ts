import { Request, Response, NextFunction } from "express";

type AsyncFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

/**
 * A higher-order function to wrap async route handlers and catch errors.
 * @param fn The async function to execute.
 * @returns An Express route handler that catches promise rejections.
 */
export const catchAsync =
  (fn: AsyncFunction) => (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
  };
