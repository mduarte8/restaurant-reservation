const service = require("./reservations.service");

/**
 * List handler for reservation resources
 */
async function list(req, res) {
  const { date } = req.query;
  console.log("date in controler is", date);
  const data = await service.list(date);
  res.json({
    data,
  });
}

module.exports = {
  list,
};
