export class ApiResponse {
    statusCode;
    data;
    message;
    success;
    /**
     * Creates a structured API success response.
     * @param statusCode The HTTP status code.
     * @param data The payload to be sent in the response.
     * @param message A descriptive message.
     */
    constructor(statusCode, data, message = 'Success') {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
    }
}
//# sourceMappingURL=ApiResponse.js.map