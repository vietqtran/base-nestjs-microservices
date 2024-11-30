import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { I18nContext } from 'nestjs-i18n';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

@Injectable()
export class ResponseParserInterceptor<T> implements NestInterceptor<T, any> {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const i18n = I18nContext.current();
    return next.handle().pipe(
      map((data) => {
        const statusCode = context.switchToRpc().getData().statusCode;
        return {
          data,
          status: 'success',
          message: null,
          statusCode,
        };
      }),
      catchError(async (error: any) => {
        const cause = error.cause ? this.transCause(error.cause, i18n) : {};
        return Promise.resolve({
          ...error,
          cause,
        });
      }),
    );
  }

  transCause(cause: any, i18n: I18nContext) {
    ['vi', 'en', 'cn', 'ja'].forEach((lang) => {
      const field = i18n.t(`messages.common.fields.${cause.field}`, { lang });
      cause[lang] = {
        field,
        message: i18n.t(`messages.common.errors.${cause.message}`, {
          lang,
          args: { field },
        }),
      };
    });
    cause.field = undefined;
    cause.message = undefined;
    return cause;
  }
}
