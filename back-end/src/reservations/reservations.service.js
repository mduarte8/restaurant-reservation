const knex = require("../db/connection");
const tableName = "reservations";

async function list(date) {
  if (!date) {
    return knex(tableName).select("*").orderBy("reservation_time");
  }
  return knex(tableName)
    .select("*")
    .where({ reservation_date: date })
    .whereNot("status", "finished")
    .orderBy("reservation_time");
}

async function search(mobile_number) {
  return knex("reservations")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

async function create(post) {
  return knex(tableName).insert(post).returning("*");
}

async function readReservation(reservation_id) {
  const response = await knex(tableName).select("*").where({ reservation_id });
  return response[0];
}

async function updateStatus(reservation_id, status) {
  const response = await knex(tableName)
    .where({ reservation_id })
    .update({ status })
    .returning("*");
  return response;
}

async function update(reservation) {
  const { reservation_id, ...updatedData } = reservation;
  const response = await knex(tableName)
    .where({ reservation_id })
    .update(updatedData)
    .returning("*");
  return response;
}

module.exports = {
  list,
  search,
  create,
  readReservation,
  updateStatus,
  update,
};
