import type { ArgumentsHost } from '@nestjs/common';
import { Catch, HttpException, HttpStatus } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import type { Request, Response } from 'express';

import { RootConfig } from '@/config';
import { Environment } from '@/config/types';

@Catch()
export class ExceptionFilter extends BaseExceptionFilter {
  constructor(private readonly config: RootConfig) {
    super();
  }

  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    const devErrorResponse: Record<string, unknown> = {
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      method: request.method,
      errorName: exception.name,
      requestId: request.id,
      message:
        exception instanceof HttpException
          ? (exception.getResponse() as { message: unknown }).message
          : exception.message,
    };

    const prodErrorResponse: Record<string, unknown> = {
      statusCode,
      requestId: request.id,
      message,
    };

    response
      .status(statusCode)
      .json(
        this.config.env === Environment.DEV
          ? devErrorResponse
          : prodErrorResponse,
      );
  }
}
