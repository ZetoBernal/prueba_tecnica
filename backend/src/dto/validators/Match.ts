import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";

export const Match = (property: string, validationOptions?: ValidationOptions) => {
  return (object: object, propertyName: string): void => {
    registerDecorator({
      name: "match",
      target: object.constructor,
      propertyName,
      constraints: [property],
      options: validationOptions,
      validator: {
        validate(value: unknown, args: ValidationArguments): boolean {
          const [relatedPropertyName] = args.constraints as [string];
          const relatedValue = (args.object as Record<string, unknown>)[relatedPropertyName];
          return value === relatedValue;
        },
      },
    });
  };
};
