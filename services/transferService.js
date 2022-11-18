const Flutterwave = require('flutterwave-node-v3');
const { v4 } = require('uuid');
const db = require('../model/db');
const { config } = require('../config/config');

const flw = new Flutterwave(config.publicKey, config.secretKey);

/**
 *
 * @param {integer} amount amount to be credited to account
 * @param {integer} accountId accountId of the creditor
 * @param {string} purpose purpose transaction purpose
 * @param {integer} reference reference reference number of transaction
 * @param {object} trx transaction object
 * @returns {object}
 */
async function creditAccount({
  amount, accountId, purpose, trx, reference,
}) {
  const getRecipentAccount = await db('accounts').where('account_id', accountId);
  await db('accounts').transacting(trx).where('account_id', '=', accountId).increment({ balance: amount });

  await trx('transactions').insert({
    transaction_type: 'credit',
    transaction_purpose: purpose,
    amount,
    account_id: accountId,
    reference_id: reference,
    balance_before: Number(getRecipentAccount[0].balance),
    balance_after: Number(getRecipentAccount[0].balance) + Number(amount),
  });
  return {
    success: true,
    message: 'Credit successful',
  };
}

/**
 *
 * @param {integer} amount amount to be debited from account
 * @param {integer} accountId accountId of the debitor
 * @param {string} purpose purpose transaction purpose
 * @param {integer} reference reference reference number of transaction
 * @param {object} trx transaction object
 * @returns {object}
 */
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

/**
 *
 * @param {integer} cardNumber card number
 * @param {integer} expiryMonth expiry Month of card
 * @param {integer} expiryYear expiry year of card
 * @param {integer} pin pin of card
 * @param {integer} amount amount to be charged
 * @param {string} fullName full Name of card holder
 * @param {string} email email of card holder
 * @param {integer} phoneNumber phone Number of card holder
 * @returns {object}
 */
async function chargeCard({
  cardNumber: card_number, cvv,
  expiryMonth: expiry_month,
  expiryYear: expiry_year,
  pin,
  amount,
  fullName: fullname,
  email,
  phoneNumber: phone_number,
}) {
  try {
    const payload = {
      card_number,
      cvv,
      expiry_month,
      expiry_year,
      currency: 'NGN',
      amount,
      fullname,
      email,
      phone_number,
      enckey: config.EncryptionKey,
      tx_ref: v4(),

    };
    const response = await flw.Charge.card(payload);
    if (response.meta.authorization.mode === 'pin') {
      const payload2 = payload;
      payload2.authorization = {
        mode: 'pin',
        fields: [
          'pin',
        ],
        pin,
      };
      const reCallCharge = await flw.Charge.card(payload2);
      if (reCallCharge.status === 'success') {
        return {
          success: true,
          reCallCharge,
        };
      }
      return {
        success: false,
        error: 'Payment failed',
      };
    }
  } catch (err) {
    return {
      success: false,
      error: 'Payment failed',
    };
  }
}

/**
 *
 * @param {integer} otp Totp sent to card holder phone
 * @param {string} flwRef transaction reference
 * @param {integer} userId userId of card holder
 * @param {object} trx database transaction object
 * @returns {object}
 */

async function validateTransaction({
  otp, flwRef: flw_ref, userId, trx,
}) {
  try {
    const response = await flw.Charge.validate({
      otp,
      flw_ref,
    });

    // Verify the payment
    if (response.status === 'success') {
      if (response.data.status === 'successful') {
        const { amount } = response.data;
        const reference = response.data.tx_ref;
        const purpose = 'transfer';
        const getRecipentAccount = await db('accounts').where('user_Id', userId);
        const accountId = getRecipentAccount[0].account_id;
        const creditUserWallet = await creditAccount({
          amount, accountId, purpose, trx, reference,
        });
        if (creditUserWallet.success) {
          return {
            success: true,
            msg: 'Success',
          };
        }
        return {
          success: false,
          msg: 'Transaction failed',
        };
      }
    }
  } catch (err) {
    Error('Error encountered');
    return {
      success: false,
      error: 'Payment failed',
    };
  }
  return {
    success: false,
    msg: 'Error encountered',
  };
}
/**
 *
 * @param {integer} accountBank This is the recipient bank code
 * @param {integer} accountNumber expiry Month of card
 * @param {integer} expiryYear expiry year of card
 * @param {string} narration narration of withdrawal
 * @param {integer} amount amount to be withdrawn
 * @param {integer} accountId accountId of user
 * @param {object} trx database transaction object
 * @returns {object}
 */
async function withdrawal({
  accountBank: account_bank,
  accountNumber: account_number,
  amount,
  narration,
  accountId,
  trx,
}) {
  try {
    const payload = {
      account_bank, 
      account_number,
      amount,
      narration,
      currency: 'NGN',
      reference: v4(),
      debit_currency: 'NGN',
    };
    const response = await flw.Transfer.initiate(payload);
    const { reference } = response.data;
    if (response.status) {
      const debitResult = await debitAccount({
        amount,
        accountId,
        purpose: 'transfer',
        reference,
        trx,
      });
      if (debitResult.success) {
        return {
          success: true,
          msg: 'Success',
        };
      }
      if (!debitResult.success) {
        return {
          success: false,
          msg: 'Error encountered',
        };
      }
    }
    return {
      success: false,
      msg: 'Internal server error',
    };
  } catch (err) {
    return {
      success: false,
      msg: 'Error encountered',
    };
  }
}

module.exports = {
  creditAccount, debitAccount, chargeCard, validateTransaction, withdrawal,
};
