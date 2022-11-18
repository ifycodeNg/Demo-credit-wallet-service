const Flutterwave = require('flutterwave-node-v3');
const { v4 } = require('uuid');
const db = require('../model/db');
const { config } = require('../config/config');

const flw = new Flutterwave(config.publicKey, config.secretKey);

async function debitAccount({
  amount, accountId, purpose, trx, reference,
}) {
  const getSenderAccount = await db('accounts').where('account_id', accountId);
  await db('accounts').transacting(trx).where('account_id', '=', accountId).decrement({ balance: amount });
  await trx('transactions').insert({
    transaction_type: 'debit',
    transaction_purpose: purpose,
    amount,
    account_id: accountId,
    reference_id: reference,
    balance_before: Number(getSenderAccount[0].balance),
    balance_after: Number(getSenderAccount[0].balance) - Number(amount),
  });

  return {
    success: true,
    message: 'Debit successful',
  };
}
module.exports = debitAccount;
