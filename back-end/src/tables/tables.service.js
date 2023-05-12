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
  // could use try catch block for error in the await syntax if needed
  return await knex.transaction(async (trx) => {
    const updatedTable = await trx(tableName)
      .where({ table_id })
      .update({ reservation_id })
      .returning("*");

    await trx("reservations")
      .where({ reservation_id })
      .update({ status: "seated" });
    return updatedTable;
  });
}

async function unseat(reservation_id, table_id) {
  // could use try catch block for error in the await syntax if needed
  return await knex.transaction(async (trx) => {
    await trx("reservations")
      .where({ reservation_id })
      .update({ status: "finished" });

    const updatedTable = await trx(tableName)
      .where({ table_id })
      .update({ reservation_id: null })
      .returning("*");

    return updatedTable;
  });
}

module.exports = {
  list,
  createTable,
  read,
  seat,
  unseat,
};
