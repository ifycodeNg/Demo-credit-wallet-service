/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  try {
    await knex.schema.createTable('loans', (tbl) => {
      tbl.increments('loan_id');
      tbl.bigint('amount', 11);
      tbl.decimal('balance_before');
      tbl.decimal('balance_after');
      tbl.enu('transaction_type', ['loan', 'repayment']);
      tbl.integer('account_id').unsigned();
      tbl.foreign('account_id').references('accounts.account_id');
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
  return knex.schema.dropTableIfExists('loans');
};
