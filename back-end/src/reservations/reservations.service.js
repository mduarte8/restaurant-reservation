const knex = require("../db/connection");
const tableName = "reservations";

// need to update
async function list(date) {
  if (!date) {
    return knex(tableName).select("*").orderBy("reservation_time");
  }
  return knex(tableName)
    .select("*")
    .where({ reservation_date: date })
    .orderBy("reservation_time");
}

async function create(post) {
  return knex(tableName).insert(post).returning("*");
}

async function readReservation(reservationId) {
  const response = await knex(tableName)
    .select("*")
    .where("reservation_id", reservationId);
  console.log("response in service is", response);
  return response[0];
}

module.exports = {
  list,
  create,
  readReservation,
};
