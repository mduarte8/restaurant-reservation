const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./reservations.service");

/**
 * Data validation for properties in req body, checks to make sure all properties expected are in request body. Defense in depth strategy, should be also validated on frontend.
 */

function addStatus(req, res, next) {
  if (!req.body.data.status) {
    req.body.data.status = "booked";
  }
  next();
}

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

/**
 * Data validation for properties in req body, checks that reservation_date, reservation_time and people are of acceptable format. Defense in depth strategy should come from frontend correctly.
 */
async function reservationExists(req, res, next) {
  const reservation_id =
    req.params.reservation_id || req.body.data.reservation_id; // checks req.body.data for use in put in tables.controller
  // console.log("looking for reservation_id", reservation_id);
  // console.log("status is", req.body.data.status);
  const foundReservation = await service.readReservation(reservation_id);
  if (foundReservation) {
    res.locals.reservation = foundReservation;
    return next();
  }
  next({
    status: 404,
    message: `Reservation ${reservation_id} cannot be found`,
  });
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
  if (!Number.isInteger(data["people"]) || data["people"] <= 0) {
    next({
      status: 400,
      message: `people must be a positive integer, received ${data["people"]}`,
    });
  }
  const reservationDate = new Date(
    `${data["reservation_date"]}T${data["reservation_time"]}:00`
  );
  const earliestTime = new Date(`${data["reservation_date"]}T10:30:00`);
  const latestTime = new Date(`${data["reservation_date"]}T21:30:00`);
  const today = new Date();
  if (reservationDate < earliestTime || reservationDate > latestTime) {
    next({
      status: 400,
      message: "Reservation Time must be between 10:30 AM and 9:30 PM",
    });
  }

  if (reservationDate < today) {
    next({
      status: 400,
      message: `Reservation must be a future date and time, please select a valid date`,
    });
  }
  if (reservationDate.getDay() === 2) {
    next({
      status: 400,
      message: `Restaurant is closed on tuesdays, select another day`,
    });
  }
  if (data["status"] !== "booked") {
    next({
      status: 400,
      message: `Reservation can't be seated or finished`,
    });
  }

  return next();
}

function statusIsValid(req, res, next) {
  const validStatuses = ["booked", "seated", "finished"];
  if (res.locals.reservation.status === "finished") {
    next({
      status: 400,
      message: `finished reservation cannot be updated`,
    });
  }
  if (!validStatuses.includes(req.body.data.status)) {
    next({
      status: 400,
      message: `unknown status ${res.locals.reservation.status}`,
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
 * Create handler for new reservation.
 */

async function create(req, res) {
  const newReservation = await service.create(req.body.data);
  res.status(201).json({
    data: newReservation[0], // have to access the array that is returned by knex().returning()
  });
}

async function read(req, res) {
  res.status(200).json({ data: res.locals.reservation }); // this may want a status #
}

async function updateStatus(req, res) {
  const { reservation_id } = res.locals.reservation;
  const { status } = req.body.data;
  const updatedReservation = await service.updateStatus(reservation_id, status);
  res.status(200).json({ data: { status: updatedReservation[0].status } });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    addStatus,
    bodyDataHas("first_name"),
    bodyDataHas("last_name"),
    bodyDataHas("mobile_number"),
    bodyDataHas("reservation_date"),
    bodyDataHas("reservation_time"),
    bodyDataHas("people"),
    // bodyDataHas("status"),
    bodyDataValid,
    asyncErrorBoundary(create),
  ],
  read: [asyncErrorBoundary(reservationExists), asyncErrorBoundary(read)],
  reservationExists: asyncErrorBoundary(reservationExists),
  updateStatus: [
    asyncErrorBoundary(reservationExists),
    bodyDataHas("status"),
    statusIsValid,
    asyncErrorBoundary(updateStatus),
  ],
};
