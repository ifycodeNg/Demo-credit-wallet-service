/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  try {
    await knex.schema.createTable('user_meta', (tbl) => {
      tbl.increments('meta_id');
      tbl.string('meta_key', 255).notNullable();
      tbl.string('meta_value', 255).notNullable();
      tbl.integer('user_id').unsigned();
      tbl.foreign('user_id').references('users.user_id');
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
  return knex.schema.dropTableIfExists('user_meta');
};
