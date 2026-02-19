// src/middleware/validate.middleware.ts
import { ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';
import { ApiError } from '../utils/ApiError.js';
export const validate = (schema) => async (req, res, next) => {
    try {
        // --- THE FIX: Parse the request and store the result ---
        const parsedData = await schema.parseAsync({
            body: req.body,
            query: req.query,
            params: req.params,
        });
        // --- Attach the validated and coerced data to the request object ---
        // We can now safely access this in our controllers.
        if (parsedData.body)
            req.body = parsedData.body;
        if (parsedData.query)
            req.query = parsedData.query;
        if (parsedData.params)
            req.params = parsedData.params;
        return next();
    }
    catch (error) {
        if (error instanceof ZodError) {
            const formattedErrors = error.errors.map((e) => `Field '${e.path.at(-1)}': ${e.message}`);
            const errorMessage = formattedErrors.join(' | ');
            return next(new ApiError(StatusCodes.BAD_REQUEST, errorMessage));
        }
        return next(error);
    }
};
// // src/middleware/validate.middleware.ts
// import { Request, Response, NextFunction } from 'express';
// import { AnyZodObject, ZodError } from 'zod';
// import { StatusCodes } from 'http-status-codes';
// import { ApiError } from '../utils/ApiError.js';
// export const validate =
//   (schema: AnyZodObject) =>
//   async (req: Request, res: Response, next: NextFunction) => {
//     try {
//       await schema.parseAsync({
//         body: req.body,
//         query: req.query,
//         params: req.params,
//       });
//       return next();
//     } catch (error) {
//       if (error instanceof ZodError) {
//         // --- THIS IS THE FIX ---
//         // Instead of just joining messages, we format each error with its field path.
//         const formattedErrors = error.errors.map(
//           (e) => `Field '${e.path.at(-1)}': ${e.message}`,
//         );
//         const errorMessage = formattedErrors.join(' | ');
//         // Pass a clear, formatted error message to the global error handler.
//         return next(new ApiError(StatusCodes.BAD_REQUEST, errorMessage));
//       }
//       return next(error);
//     }
//   };
// // import { Request, Response, NextFunction } from "express";
// // import { AnyZodObject, ZodError } from "zod";
// // import { StatusCodes } from "http-status-codes";
// // import { ApiError } from "../utils/ApiError.js";
// // /**
// //  * A middleware factory that returns a validation middleware.
// //  * @param schema The Zod schema to validate against.
// //  * @returns An Express middleware function.
// //  */
// // export const validate =
// //   (schema: AnyZodObject) =>
// //   async (req: Request, res: Response, next: NextFunction) => {
// //     try {
// //       await schema.parseAsync({
// //         body: req.body,
// //         query: req.query,
// //         params: req.params,
// //       });
// //       return next();
// //     } catch (error) {
// //       if (error instanceof ZodError) {
// //         // Create a user-friendly error message from Zod's error object
// //         const errorMessages = error.errors.map((e) => e.message).join(", ");
// //         return next(new ApiError(StatusCodes.BAD_REQUEST, errorMessages));
// //       }
// //       // Pass other errors to the global error handler
// //       return next(error);
// //     }
// //   };
//# sourceMappingURL=validate.middleware.js.map