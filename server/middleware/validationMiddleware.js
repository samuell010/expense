import { body, param, validationResult } from "express-validator";

const withValidationErrors = (validateValues) => {
  return [
    validateValues,
    (req, res, next) => {
      const errors = validationResult(req);
      console.log(errors);
      console.log(req.body);
      if (!errors.isEmpty()) {
        const errorMessages = errors.array().map((error) => error.msg);
        return res.status(400).json({ errors: errorMessages });
      }
      next();
    },
  ];
};


// REPORTS
export const validateReport = withValidationErrors([

  body("title")
  .notEmpty()
  .withMessage("Title is required")
  .isString()
  .withMessage("Title must be a type of string")
  .isLength({min:3, max: 150 })
  .withMessage("Title's min length is 3 and max length is 150 characters"),

  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a type of string")
    .isLength({min:3, max: 300 })
    .withMessage("Description's min length is 3 and max length is 300 characters"),

  body("startDate")
    .notEmpty()
    .withMessage("start date is required")
    .isISO8601()
    .withMessage("start date must be a valid ISO 8601 date"),

  body("endDate")
    .notEmpty()
    .withMessage("end date is required")
    .isISO8601()
    .withMessage("end date must be a valid ISO 8601 date"),
]);


//TRIPS

export const validateTrip = withValidationErrors([
  body("description")
    .notEmpty()
    .withMessage("Description is required")
    .isString()
    .withMessage("Description must be a type of string")
    .isLength({ max: 150 })
    .withMessage("Description's max length is 150 characters"),

  body("startDate")
    .notEmpty()
    .withMessage("start date is required")
    .isISO8601()
    .withMessage("start date must be a valid ISO 8601 date"),

  body("endDate")
    .notEmpty()
    .withMessage("end date is required")
    .isISO8601()
    .withMessage("end date must be a valid ISO 8601 date"),
]);

export const validateTripUpdate = withValidationErrors([
  param("id")
    .notEmpty()
    .withMessage("Trip ID is required")
    .isInt()
    .withMessage("Trip ID must be an integer"),
  // Optional 'description'
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a type of string")
    .isLength({ max: 150 })
    .withMessage("Description's max length is 150 characters"),

  // Optional 'startDate'
  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date"),

  // Optional 'endDate'
  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date"),
]);

//KILOMETER_ALLOWANCES

export const validateKilometerAllowance = withValidationErrors([
  body("description")
  .notEmpty()
  .withMessage("Description is required")
  .isString()
  .withMessage("Description must be a string")
  .isLength({ max: 150 })
  .withMessage("Description's max length is 150 characters"),

body("vehicleInfo")
  .notEmpty()
  .withMessage("Vehicle info is required")
  .isString()
  .withMessage("Vehicle info must be a string")
  .isLength({ max: 50 })
  .withMessage("Vehicle info's max length is 50 characters"),

body("distance")
  .notEmpty()
  .withMessage("Distance is required")
  .isFloat({ gt: 0 })
  .withMessage("Distance must be a positive number"),

body("totalCost")
  .notEmpty()
  .withMessage("Total cost is required")
  .isFloat({ gt: 0 })
  .withMessage("Total cost must be a positive number"),

body("startPoint")
  .notEmpty()
  .withMessage("Start point is required")
  .isString()
  .withMessage("Start point must be a string"),

body("endPoint")
  .notEmpty()
  .withMessage("End point is required")
  .isString()
  .withMessage("End point must be a string"),

body("startLat")
  .notEmpty()
  .withMessage("Start latitude is required")
  .isFloat({ min: -90, max: 90 })
  .withMessage("Start latitude must be a valid latitude (-90 to 90)"),

body("startLng")
  .notEmpty()
  .withMessage("Start longitude is required")
  .isFloat({ min: -180, max: 180 })
  .withMessage("Start longitude must be a valid longitude (-180 to 180)"),

body("endLat")
  .notEmpty()
  .withMessage("End latitude is required")
  .isFloat({ min: -90, max: 90 })
  .withMessage("End latitude must be a valid latitude (-90 to 90)"),

body("endLng")
  .notEmpty()
  .withMessage("End longitude is required")
  .isFloat({ min: -180, max: 180 })
  .withMessage("End longitude must be a valid longitude (-180 to 180)"),

body("startDate")
  .notEmpty()
  .withMessage("Start date is required")
  .isISO8601()
  .withMessage("Start date must be a valid ISO 8601 date"),

body("endDate")
  .notEmpty()
  .withMessage("End date is required")
  .isISO8601()
  .withMessage("End date must be a valid ISO 8601 date"),

body("passengers")
  .notEmpty()
  .withMessage("Number of passengers is required")
  .isInt({ min: 1 })
  .withMessage("Passengers must be a positive integer"),

body("passengerNames")
  .isArray({ min: 1 })
  .withMessage("Passenger names must be a non-empty array"),

body("passengerNames.*")
  .notEmpty()
  .withMessage("Each passenger name is required")
  .isString()
  .withMessage("Each passenger name must be a string"),

body("reportId")
  .notEmpty()
  .withMessage("Report ID is required")
  .isInt()
  .withMessage("Report ID must be an integer"),
]);

// DAILY ALLOWANCES

export const validateDailyAllowance = withValidationErrors([
  body("totalAllowances")
    .notEmpty()
    .withMessage("Total allowances are required.")
    .isInt()
    .withMessage("Total allowances must be an integer"),

  body("freeMeals")
    .notEmpty()
    .withMessage("Free meals are required.")
    .isInt()
    .withMessage("Free meals must be an integer"),

  body("country")
    .notEmpty()
    .withMessage("Country is required.")
    .isString()
    .withMessage("Country must be a string")
    .isLength({ max: 30 })
    .withMessage("Country's max length is 30 characters"),

  body("over_5_km")
    .notEmpty()
    .withMessage("Over 5 km is required.")
    .isBoolean()
    .withMessage("Over 5 km must be a boolean value"),

  body("over_15_km")
    .notEmpty()
    .withMessage("Over 15 km is required.")
    .isBoolean()
    .withMessage("Over 15 km must be a boolean value"),

  body("startDate")
    .notEmpty()
    .withMessage("Start date is required.")
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date"),

  body("endDate")
    .notEmpty()
    .withMessage("End date is required.")
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date"),

  body("tripId")
    .notEmpty()
    .withMessage("Trip ID is required.")
    .isInt()
    .withMessage("Trip ID must be an integer"),
]);


// AUTHENTICATION

export const validateLogin = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Email must be in a correct email format")
    .isLength({ min: 3, max: 30 })
    .withMessage("email must be between 3 and 30 characters long")
    .trim(),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters long"),
]);

export const validateRegister = withValidationErrors([
  body("email")
    .notEmpty()
    .withMessage("email is required")
    .isEmail()
    .withMessage("Email must be in a correct email format")
    .isLength({ min: 3, max: 30 })
    .withMessage("email must be between 3 and 30 characters long")
    .trim(),
  body("password")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ min: 8 })
    .withMessage("password must be at least 8 characters long")
    .matches(/[A-Z]/)
    .withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/)
    .withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/)
    .withMessage("Password must contain at least one number")
    .matches(/[\W_]/)
    .withMessage("Password must contain at least one special character")
    .isLength({ max: 30 })
    .withMessage("Password cannot be longer than 30 characters"),
  body("name")
    .notEmpty()
    .withMessage("password is required")
    .isLength({ max: 30 })
    .withMessage("Max length of first name is 30 characters"),
  body("lastName")
    .notEmpty()
    .withMessage("lastName is required")
    .isLength({ max: 30 })
    .withMessage("Max length of last name is 30 characters"),
]);
