
import { Catch, ArgumentsHost, ExceptionFilter, HttpStatus } from '@nestjs/common';
import { RpcException } from '@nestjs/microservices';

@Catch(RpcException)
export class RpcCustomExceptionFilter implements ExceptionFilter {
  catch(exception: RpcException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest();
    const rpcError = exception.getError();
    if (
      typeof rpcError === 'object' &&
      rpcError !== null &&
      'status' in rpcError &&
      'message' in rpcError
    ) {
      const errorObject = rpcError as { status: number | string; message: string };
      const status = isNaN(+errorObject.status) ? HttpStatus.BAD_REQUEST : +errorObject.status;
      return response.status(status).json(errorObject);
    }

    response.status(HttpStatus.BAD_REQUEST).json({
      status: HttpStatus.BAD_REQUEST,
      message: rpcError,
      timestamp: new Date().toISOString(),
    })
  }
}
