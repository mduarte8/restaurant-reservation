const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");

/**
 * Data validation for properties in req body
 */

function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    const bodyValue = data[propertyName];
    if (bodyValue) {
      return next();
    }
    next({ status: 400, message: `Must include a valid ${propertyName}` });
  };
}

function bodyDataValid(req, res, next) {
  const { data = {} } = req.body;
  // may want to add validation that it's a valid year, month and date
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(data["reservation_date"])) {
    next({
      status: 400,
      message: `reservation_date must be in YYYY-MM-DD format, received ${data["reservation_date"]}`,
    });
  }
  const timeRegex = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;
  if (!timeRegex.test(data["reservation_time"])) {
    next({
      status: 400,
      message: `reservation_time must be in the HH:MM format, received ${data["reservation_time"]}`,
    });
  }
  // console.log("data[people] is", data["people"]);
  // console.log(typeof data["people"]);
  // console.log("Num.isInt", Number.isInteger(parseInt(data["people"])));
  // console.log("less than", data["people"] > 0);
  if (!Number.isInteger(parseInt(data["people"])) || data["people"] <= 0) {
    next({
      status: 400,
      message: `people must be a positive integer, received ${data["people"]}`,
    });
  }
  return next();
}

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const { date } = req.query;
  const data = await service.list(date);
  res.status(200).json({
    data,
  });
}

/**
 * List handler for reservation resources
 */

async function create(req, res) {
  const newReservation = await service.create(req.body.data);
  res.status(201).json({
    data: newReservation[0], // have to access the array that is returned by knex().returning()
  });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    bodyDataHas("first_name"),
    bodyDataHas("last_name"),
    bodyDataHas("mobile_number"),
    bodyDataHas("reservation_date"),
    bodyDataHas("reservation_time"),
    bodyDataHas("people"),
    bodyDataValid,
    asyncErrorBoundary(create),
  ],
};
