const knex = require("../db/connection");
const tableName = "tables";

async function list() {
  return knex(tableName).select("*").orderBy("table_name");
}

async function read(table_id) {
  return knex(tableName).select("*").where({ table_id }).first();
}

async function createTable(post) {
  return knex(tableName).insert(post).returning("*");
}

async function seat(reservation_id, table_id) {
  return knex(tableName)
    .where({ table_id })
    .update({
      reservation_id,
    })
    .returning("*");
}

module.exports = {
  list,
  createTable,
  read,
  seat,
};
