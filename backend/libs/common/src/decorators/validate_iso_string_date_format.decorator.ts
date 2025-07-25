import type { ValidationOptions, ValidationArguments } from 'class-validator';
import { registerDecorator } from 'class-validator';
import * as moment from 'moment';

export function IsIsoStringDateFormat(
  property: string,
  validationOptions?: ValidationOptions,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      name: 'IsIsoStringDateFormat',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [formatDate] = args.constraints;
          return moment(value, formatDate, true).isValid();
        },
      },
    });
  };
}
