const knex = require("../db/connection");
const tableName = "reservations";

// need to update
async function list(date) {
  if (!date) {
    return await knex(tableName).select("*").orderBy("reservation_time");
  }
  return await knex(tableName)
    .select("*")
    .where({ reservation_date: date })
    .orderBy("reservation_time");
}

async function create(post) {
  return knex(tableName).insert(post).returning("*");
}

module.exports = {
  list,
  create,
};
