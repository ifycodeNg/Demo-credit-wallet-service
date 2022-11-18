const express = require('express');
const Jwt = require('jsonwebtoken');
const { config } = require('../config/config');

const router = express.Router();

const isAuthenticated = (req, res, next) => {
  const bearerHeader = req.headers.authorization;

  if (typeof bearerHeader !== 'undefined') {
    const bearer = bearerHeader.split(' ');

    const bearerToken = bearer[1];

    Jwt.verify(bearerToken, config.jwt.ACCESS_TOKEN_SECRET, (err, decoded) => {
      if (err) {
        res.sendStatus(403);
      }
      if (decoded) {
        req.token = decoded;
        next();
      }
    });
  } else {
    res.sendStatus(403);
  }
};

const registerController = require('../controller/registerUserController');
const loginController = require('../controller/loginController');
const getAccountBalanceController = require('../controller/getAccountBalanceController');
const getLoanBalanceController = require('../controller/getLoanBalanceController');
const fundWalletController = require('../controller/fundWalletController');
const fundWalletViaCardController = require('../controller/fundWalletViaCardController');
const transferFundsController = require('../controller/transferFundsController');
const rePaymentController = require('../controller/rePaymentController');
const withDrawalController = require('../controller/withDrawalController');
const transactionHistory = require('../controller/transactionHistory');
const getAllBankController = require('../controller/getAllBankController');

router.get('/', (req, res) => {
  res.send('Welcome to Demo credit');
});
/* POST Registeration. */
router.post('/register', registerController);
/* POST Login. */
router.post('/login', loginController);
/* POST Fund Wallet. */
router.post('/fund/wallet', isAuthenticated, fundWalletController);
/* POST Transfer Funds to other Accounts. */
router.post('/fund/wallet/card', isAuthenticated, fundWalletViaCardController.fundWalletViaCardController);
/* POST Transfer Funds to other Accounts. */
router.post('/fund/wallet/card/validate', isAuthenticated, fundWalletViaCardController.validateCardTransfer);
/* POST Transfer Funds to other Accounts. */
router.post('/transfer/funds', isAuthenticated, transferFundsController);
/* POST Withdrawal Funds. */
router.post('/withdraw/funds', isAuthenticated, withDrawalController);
/* POST Withdrawal Funds. */
router.post('/repayment/loan', isAuthenticated, rePaymentController);
/* GET account balance. */
router.get('/account/balance', isAuthenticated, getAccountBalanceController);
/* GET loan balance. */
router.get('/loan/balance', isAuthenticated, getLoanBalanceController);
/* GET Transaction history. */
router.get('/account/transaction', isAuthenticated, transactionHistory);
/* GET all banks in nigeria. */
router.get('/get/banks', getAllBankController);
module.exports = router;
