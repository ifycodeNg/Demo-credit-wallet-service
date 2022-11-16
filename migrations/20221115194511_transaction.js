/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  try {
    await knex.schema.createTable('transactions', (tbl) => {
      tbl.increments('txn_id');
      tbl.bigInteger('reference_id');
      tbl.integer('amount', 11);
      tbl.decimal('balance_before');
      tbl.enu('transaction_type', ['debit', 'credit']);
      tbl.enu('transaction_purpose', ['deposit', 'transfer', 'withdrawal']);
      tbl.decimal('balance_after');
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
  return knex.schema.dropTableIfExists('transactions');
};
