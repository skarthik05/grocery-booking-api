import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  HttpException,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { StandardResponse } from './interface/response.interface';

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<StandardResponse<T>> {
    return next.handle().pipe(
      map((data) => {
        return {
          status: 'success',
          data,
        } as StandardResponse<T>;
      }),
      catchError((error) => {
        const response: StandardResponse<null> = {
          status: 'error',
          error: error.message || 'Internal Server Error',
        };
        return throwError(
          () => new HttpException(response, error.status || 500),
        );
      }),
    );
  }
}
