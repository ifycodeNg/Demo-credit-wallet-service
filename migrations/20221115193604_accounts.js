/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  try {
    await knex.schema.createTable('accounts', (tbl) => {
      tbl.increments('account_id');
      tbl.decimal('balance', 8, 2);
      tbl.string('wallet', 11).notNullable();
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
  return knex.schema.dropTableIfExists('accounts');
};
