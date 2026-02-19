/**
 * A higher-order function to wrap async route handlers and catch errors.
 * @param fn The async function to execute.
 * @returns An Express route handler that catches promise rejections.
 */
export const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err) => next(err));
};
//# sourceMappingURL=catchAsync.js.map