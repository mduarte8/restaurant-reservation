const knex = require("../db/connection");
const tableName = "reservations";

// need to update
function list(date) {
  console.log("date in reservations service is", date);
  console.log("i'm the best");
  if (!date) {
    return knex(tableName).select("*");
  }
  return knex(tableName).select("*").where({ reservation_date: date }); // .where({ reservation_id: 1 }).first();
}

module.exports = {
  list,
};
