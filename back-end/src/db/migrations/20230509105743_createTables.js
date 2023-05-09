// exports.up = function (knex) {
//     return knex.schema.createTable("reservations", (table) => {
//       table.increments("reservation_id").primary();
//       table.string("first_name").notNullable();
//       table.string("last_name", null).notNullable();
//       table.string("mobile_number", null).notNullable();
//       table.date("reservation_date").notNullable();
//       table.time("reservation_time").notNullable();
//       table.integer("people", null).unsigned().notNullable();
//       table.timestamps(true, true);
//     });
//   };

//   exports.down = function (knex) {
//     return knex.schema.dropTable("reservations");
//   };

exports.up = function (knex) {
  return knex.schema.createTable("tables", (table) => {
    table.increments("table_id").primary();
    table.string("table_name").notNullable();
    table.integer("capacity").notNullable();
    table.integer("reservation_id").unsigned().nullable();
    table.foreign("reservation_id").references("reservations.reservation_id");
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTable("tables");
};
