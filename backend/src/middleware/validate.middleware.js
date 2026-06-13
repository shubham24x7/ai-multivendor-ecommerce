import { AppError } from "../utils/app-error.js";

export function validate(schema, property = "body") {
  return (req, _res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const details = error.details.map((detail) => detail.message);
      return next(new AppError("Request validation failed", 400, details));
    }

    req[property] = value;
    return next();
  };
}
