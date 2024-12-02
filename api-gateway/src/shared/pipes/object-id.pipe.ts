import { PipeTransform, Injectable, BadRequestException, HttpException } from '@nestjs/common';
import { Types } from 'mongoose';
import { I18nContext } from 'nestjs-i18n';

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, Types.ObjectId> {
    transform(value: any): Types.ObjectId {
        try {
            const validObjectId = Types.ObjectId.isValid(value);
            return Types.ObjectId.createFromHexString(value);
        } catch (error) {
            const i18n = I18nContext.current();
            throw new HttpException(
                {
                    data: null,
                    status: 'error',
                    message: 'Invalid ObjectId',
                    statusCode: 400,
                    cause: this.transCause({
                        field: 'id',
                        message: 'invalid',
                    }, i18n),
                },
                400,
            );
        }
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