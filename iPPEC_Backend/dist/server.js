// src/server.ts (DEBUGGING VERSION)
// Intentionally leave imports out of the top level for now.
// This is the only code that will run immediately.
console.log('--- [DEBUG] Starting server.ts execution ---');
// We will immediately wrap the first import in a try/catch block.
try {
    // We are forcing the app module and all its dependencies to load inside this block.
    // If any of them throw a synchronous error, the catch block will grab it.
    const { default: app } = await import('./app.js');
    const http = await import('http');
    const { config, logger } = await import('./config/index.js');
    console.log('--- [DEBUG] All modules imported successfully ---');
    // Create the HTTP server using the Express app
    const server = http.default.createServer(app);
    // Start the server
    server.listen(config.port, () => {
        logger.info(`🚀 Server is listening on http://localhost:${config.port}`);
        logger.info(`Environment: ${config.env}`);
    });
    // Graceful shutdown logic (optional for debugging, but good to keep)
    const shutdown = (signal) => {
        logger.info(`${signal} received. Closing HTTP server.`);
        server.close(() => {
            logger.info('HTTP server closed.');
            process.exit(0);
        });
    };
    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
}
catch (error) {
    // --- THIS BLOCK WILL NOW CATCH THE HIDDEN ERROR ---
    console.error('--- [DEBUG] A FATAL ERROR OCCURRED DURING MODULE INITIALIZATION ---');
    console.error(error); // This will print the full error object and stack trace.
    process.exit(1); // Exit with an error code.
}
export {};
//# sourceMappingURL=server.js.map