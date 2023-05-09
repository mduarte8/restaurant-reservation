const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const service = require("./tables.service");

async function list(req, res) {
  // const { date } = req.query;
  const data = await service.list();
  res.status(200).json({
    data,
  });
}

module.exports = {
  list: asyncErrorBoundary(list),
};

// module.exports = {
//     list: asyncErrorBoundary(list),
//     create: [
//       bodyDataHas("first_name"),
//       bodyDataHas("last_name"),
//       bodyDataHas("mobile_number"),
//       bodyDataHas("reservation_date"),
//       bodyDataHas("reservation_time"),
//       bodyDataHas("people"),
//       bodyDataValid,
//       asyncErrorBoundary(create),
//     ],
//   };
