import { StatusCodes } from 'http-status-codes';

export class ApiResponse<T> {
  public readonly statusCode: StatusCodes;
  public readonly data: T;
  public readonly message: string;
  public readonly success: boolean;

  /**
   * Creates a structured API success response.
   * @param statusCode The HTTP status code.
   * @param data The payload to be sent in the response.
   * @param message A descriptive message.
   */
  constructor(statusCode: StatusCodes, data: T, message = 'Success') {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}