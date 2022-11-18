const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const {config} = require('../config/config');
// Assertion Style
chai.should();
chai.use(chaiHttp);

describe('Fund Account via card', () => {
/**
 * Test the fund wallet via card endpoint
 */

  it('card would be charged', (done) => {
    const requestBody = {
      cardNumber: '5399838383838381',
      cvv: '470',
      expiryMonth: '08',
      expiryYear: '32',
      amount: '100',
      pin: '3310',
    };
    chai.request(server)
      .post('/api/v0/fund/wallet/card')
      .set('Authorization', `Bearer ${config.token}`)
      .send(requestBody)
      .end((err, response) => {
        response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.should.have.property('success').eq(true);
        response.body.should.have.property('msg');

        done();
      });
  });

  /**
   * Test the fund wallet via card endpoint with incorrect body key value
   */

  it('card would not be charged', (done) => {
    const requestBody = {
      cardNumber: '5399838383838381',
      cvv: '470',
      expiryMonth: '08',
      expiryYear: '32',
      amount: '100',
      pin: '1234',
    };
    chai.request(server)
      .post('/api/v0/fund/wallet/card')
      .set('Authorization', `Bearer ${config.token}`)
      .send(requestBody)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.be.a('object');
        response.body.should.have.property('success').eq(false);
        response.body.should.have.property('msg');

        done();
      });
  });

  /**
   * Test the fund wallet via card endpoint with incorrect body keys
   */

  it('card would not be charged', (done) => {
    const requestBody = {
      cardNumber: '5399838383838381',
      cvv: '470',
      amount: '100',
      pin: '3310',
    };
    chai.request(server)
      .post('/api/v0/fund/wallet/card')
      .set('Authorization', `Bearer ${config.token}`)
      .send(requestBody)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.be.a('object');
        response.body.should.have.property('success').eq(false);
        response.body.should.have.property('msg');

        done();
      });
  });

  /**
   * Test the fund wallet via card endpoint without Token
   */

  it('card would not be charged', (done) => {
    const requestBody = {
      cardNumber: '5399838383838381',
      cvv: '470',
      expiryMonth: '08',
      expiryYear: '32',
      amount: '100',
      pin: '3310',
    };
    chai.request(server)
      .post('/api/v0/fund/wallet/card')
      .send(requestBody)
      .end((err, response) => {
        response.should.have.status(403);

        done();
      });
  });
});
