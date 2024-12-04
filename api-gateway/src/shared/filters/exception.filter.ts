import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';

export interface ErrorResponse {
  data: null;
  status: 'error';
  message: string;
  statusCode: number;
  cause?: Record<string, any>;
}

@Catch(HttpException)
export class KafkaExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(KafkaExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const statusCode = exception.getStatus();
    const exceptionResponse = exception.getResponse() as any;

    this.logger.error(
      `Kafka Exception caught: ${exception.message}`,
      exception.stack,
    );

    const errorResponse: ErrorResponse = {
      data: null,
      status: 'error',
      message:
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : exceptionResponse.message || 'An error occurred',
      statusCode,
      cause: exceptionResponse.cause,
    };

    response.status(statusCode).json(errorResponse);
  }
}
