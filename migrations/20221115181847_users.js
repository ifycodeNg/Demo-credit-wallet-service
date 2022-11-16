/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  try {
    await knex.schema.createTable('users', (tbl) => {
      tbl.increments('user_id');
      tbl.string('first_name', 255).notNullable();
      tbl.string('last_name', 255).notNullable();
      tbl.string('phone_number', 11).notNullable();
      tbl.string('email').unique();
      tbl.integer('is_blocked');
      tbl.string('password', 255).notNullable();
      tbl.timestamp('created_at', { precision: 6 }).defaultTo(knex.fn.now(6));
      tbl.timestamp('updated_at', { precision: 6 }).defaultTo(knex.fn.now(6));
    });
    console.log('Creation completed');
  } catch (err) {
    throw Error(err);
  }
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  return knex.schema.dropTableIfExists('users');
};
