import { PipeTransform, Injectable, HttpException } from '@nestjs/common';
import { Types } from 'mongoose';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, Types.ObjectId> {
  private static readonly SUPPORTED_LANGUAGES = ['vi', 'en', 'cn', 'ja'];

  transform(value: any): Types.ObjectId {
    try {
      return Types.ObjectId.createFromHexString(value);
    } catch {
      const i18n = I18nContext.current();
      throw new HttpException(
        {
          data: null,
          status: 'error',
          message: 'Invalid ObjectId',
          statusCode: 400,
          cause: this.translateCause({ field: 'id', message: 'invalid' }, i18n),
        },
        400,
      );
    }
  }

  private translateCause(
    cause: { field: string; message: string },
    i18n: I18nContext,
  ): Record<string, any> {
    const translations = ParseObjectIdPipe.SUPPORTED_LANGUAGES.reduce(
      (result, lang) => {
        result[lang] = this.createTranslatedMessage(cause, lang, i18n);
        return result;
      },
      {} as Record<string, any>,
    );

    return { ...translations };
  }

  private createTranslatedMessage(
    cause: { field: string; message: string },
    lang: string,
    i18n: I18nContext,
  ): { field: string; message: string } {
    const field = i18n.t(`messages.common.fields.${cause.field}`, { lang });
    const message = i18n.t(`messages.common.errors.${cause.message}`, {
      lang,
      args: { field },
    });
    return { field, message };
  }
}
