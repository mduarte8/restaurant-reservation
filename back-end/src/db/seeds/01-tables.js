// const reservations = require("./00-reservations.json");

// exports.seed = function (knex) {
//   return knex
//     .raw("TRUNCATE TABLE reservations RESTART IDENTITY CASCADE")
//     .then(() => knex("reservations").insert(reservations));
// };

const tables = require("./01-tables.json");

exports.seed = function (knex) {
  return knex
    .raw("TRUNCATE TABLE tables RESTART IDENTITY CASCADE")
    .then(() => knex("tables").insert(tables));
};
