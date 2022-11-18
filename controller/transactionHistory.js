const db = require('../model/db');

const transactionHistory = async (req, res) => {
  try {
    const { accountId } = req.token;
    const trx = await db.transaction();
    const transactionLookup = await db('transactions').transacting(trx).where('account_id', accountId);
    trx.commit();
    res.type('application/json');
    return res.status(200).json({
      success: true,
      transactions: transactionLookup,
    });
  } catch (err) {
    return res.status(200).json({
      success: false,
      msg: 'Internal server error',
    });
  }
};

module.exports = transactionHistory;
