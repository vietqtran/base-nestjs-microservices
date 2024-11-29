import { RpcException } from '@nestjs/microservices';

export interface ErrorResponse {
    data: null;
    status: 'error';
    message: string;
    statusCode: number;
    cause?: Record<string, any>;
  }

export class CustomRpcException extends RpcException {
  constructor(
    message: string,
    statusCode: number,
    cause?: Record<string, any>,
  ) {
    const response: ErrorResponse = {
      data: null,
      status: 'error',
      message,
      statusCode,
      cause,
    };
    super(response);
  }
}
