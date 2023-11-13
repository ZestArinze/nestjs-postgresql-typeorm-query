import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpException,
	HttpStatus,
	LoggerService,
	Inject,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { WINSTON_MODULE_NEST_PROVIDER } from 'nest-winston';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
	constructor(
		private readonly httpAdapterHost: HttpAdapterHost,
		@Inject(WINSTON_MODULE_NEST_PROVIDER)
		private readonly logger: LoggerService,
	) { }

	catch(exception: unknown, host: ArgumentsHost): void {
		// In certain situations `httpAdapter` might not be available in the
		// constructor method, thus we should resolve it here.
		const { httpAdapter } = this.httpAdapterHost;

		const ctx = host.switchToHttp();

		const httpStatus =
			exception instanceof HttpException
				? exception.getStatus()
				: HttpStatus.INTERNAL_SERVER_ERROR;

		const responseBody = {
			statusCode: httpStatus,
			timestamp: new Date().toISOString(),
			path: httpAdapter.getRequestUrl(ctx.getRequest()),
		};

		this.logger.error(`${httpAdapter} ___ ${JSON.stringify({ responseBody, exception })}`);

		httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
	}
}