const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const { config } = require('../config/config');

// Assertion Style
chai.should();
chai.use(chaiHttp);

describe('Withdrawal of funds from wallet', () => {
/**
 * Test the Withdrawal of funds from wallet endpoint
 */

  it('Withdrawal of funds from wallet', (done) => {
    const requestBody = {
      amount: 100,
      accountNumber: '0690000040',
      narration: 'withdrawal of funds',
      accountBank: '044',
    };
    chai.request(server)
      .post('/api/v0/withdraw/funds')
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
 * Test the Withdrawal of funds from wallet with amount greater than balance endpoint
 */
  it('Withdrawal of funds from wallet', (done) => {
    const requestBody = {
      amount: 2000000,
      accountNumber: '0690000040',
      narration: 'withdrawal of funds',
      accountBank: '044',
    };
    chai.request(server)
      .post('/api/v0/withdraw/funds')
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
   * Test the Withdrawal of funds from wallet endpoint with incorrect body parameter
   */

  it('withdrawal would be unsuccessful', (done) => {
    const requestBody = {
      accountNumber: '0690000040',
      narration: 'withdrawal of funds',
      accountBank: '044',
    };
    chai.request(server)
      .post('/api/v0/withdraw/funds')
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
   * Test the Withdrawal of funds from wallet endpoint with incorrect body key parameter
   */

  it('withdrawal would be unsuccessful', (done) => {
    const requestBody = {
      amount: 'abc',
      accountNumber: '0690000040',
      narration: 'withdrawal of funds',
      accountBank: '044',
    };
    chai.request(server)
      .post('/api/v0/withdraw/funds')
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
   * Test the fund wallet via loan endpoint without Token
   */

  it('withdrawal would be unsuccessful', (done) => {
    const requestBody = {
      amount: 100,
      accountNumber: '0690000040',
      narration: 'withdrawal of funds',
      accountBank: '044',
    };
    chai.request(server)
      .post('/api/v0/withdraw/funds')
      .send(requestBody)
      .end((err, response) => {
        response.should.have.status(403);

        done();
      });
  });
});
