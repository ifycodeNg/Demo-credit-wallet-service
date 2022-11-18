const Axios = require('axios');

const { config } = require('../config/config');

const instance = Axios.create({
  baseURL: `${config.BASE_API_URL}`,
  timeout: 5000,
  headers: { Authorization: `Bearer ${config.secret}` },
});

async function getAllBankController(req, res) {
  try {
    const response = await instance.get('/banks/NG');
    if (response.status !== 200) {
      return Error('Error Occured');
    }
    res.type('application/json');
    return res.status(200).json({
      success: true,
      banks: response.data,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      banks: 'Internal server error',
    });
  }
}

module.exports = getAllBankController;
