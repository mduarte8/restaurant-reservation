const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");
const {
  reservationExists,
} = require("../reservations/reservations.controller");

async function tableExists(req, res, next) {
  const { table_id } = req.params;
  const foundTable = await service.read(table_id);
  if (foundTable) {
    res.locals.table = foundTable;
    return next();
  }
  next({
    status: 404,
    message: `table_id ${table_id} not found`,
  });
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

function bodyDataValid(req, res, next) {
  const { data = {} } = req.body;
  if (data["table_name"].length < 2) {
    next({
      status: 400,
      message: "table_name must be longer than 2 characters",
    });
  }
  if (typeof data["capacity"] !== "number") {
    next({
      status: 400,
      message: "capacity must be a type number.",
    });
  }
  return next();
}

function tableIsValid(req, res, next) {
  const { capacity, reservation_id } = res.locals.table;
  const { people } = res.locals.reservation;
  if (people > capacity) {
    next({
      status: 400,
      message: "table does not have sufficient capacity",
    });
  }
  if (reservation_id) {
    next({
      status: 400,
      message: "table is currently occupied",
    });
  }
  return next();
}

function tableIsOccupied(req, res, next) {
  if (!res.locals.table.reservation_id) {
    next({
      status: 400,
      message: `Cannot unseat table ${res.locals.table.table_id} as it is not occupied with reservation`,
    });
  }
  return next();
}

function canSeatReservation(req, res, next) {
  const currentReservationStatus = res.locals.reservation.status;
  if (currentReservationStatus === "seated") {
    next({
      status: 400,
      message: `Cannot re-seat reservation ${res.locals.reservation.reservation_id}, as it is already seated`,
    });
  }
  if (currentReservationStatus === "finished") {
    next({
      status: 400,
      message: `Cannot seat seat reservation ${res.locals.reservation.reservation_id} as it is already finished`,
    });
  }
  return next();
}

async function list(req, res) {
  // const { date } = req.query;
  const data = await service.list();
  res.status(200).json({
    data,
  });
}

async function create(req, res) {
  const newTable = await service.createTable(req.body.data);
  res.status(201).json({
    data: newTable[0], // have to access the array that is returned by knex().returning()
  });
}

async function seat(req, res) {
  const seatedTable = await service.seat(
    res.locals.reservation.reservation_id,
    res.locals.table.table_id
  );
  res.status(200).json({
    data: seatedTable[0],
  });
}

async function destroy(req, res) {
  const unseatedTable = await service.unseat(
    res.locals.table.reservation_id,
    res.locals.table.table_id
  );
  res.status(200).json({
    data: unseatedTable[0],
  });
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [
    bodyDataHas("table_name"),
    bodyDataHas("capacity"),
    bodyDataValid,
    asyncErrorBoundary(create),
  ],
  update: [
    bodyDataHas("reservation_id"),
    asyncErrorBoundary(tableExists),
    asyncErrorBoundary(reservationExists),
    tableIsValid,
    canSeatReservation,
    asyncErrorBoundary(seat),
  ],
  delete: [
    asyncErrorBoundary(tableExists),
    tableIsOccupied,
    asyncErrorBoundary(destroy),
  ],
};
