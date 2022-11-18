const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const { config } = require('../config/config');

// Assertion Style
chai.should();
chai.use(chaiHttp);

describe('Transfer funds to other users wallet within Demo Credit', () => {
/**
 * Test Transfer funds to other users wallet within Demo Credit endpoint
 */

  it('sucessful transfer', (done) => {
    const requestBody = {
      accountNumber: '08059283540',
      amount: 5000,
    };
    chai.request(server)
      .post('/api/v0/transfer/funds')
      .set('Authorization', `Bearer ${config.token}`)
      .send(requestBody)
      .end((err, response) => {
        console.log(response)
        response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.should.have.property('success').eq(true);
        response.body.should.have.property('msg');

        done();
      });
  });

  /**
   * Test Transfer of funds to other users wallet within Demo Credit with incorrect body key value
   */

  it('failed transfer', (done) => {
    const requestBody = {
      accountNumber: '08059283533',
      amount: 'abc',
    };
    chai.request(server)
      .post('/api/v0/transfer/funds')
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
   * Test Transfer of funds to other users wallet within Demo Credit with wrong body key
   */

  it('reject transfer', (done) => {
    const requestBody = {
      accountNumber: '08059283533',
      amountTransfer: '5000',
    };
    chai.request(server)
      .post('/api/v0/transfer/funds')
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
   * Test Transfer of funds to other users wallet within Demo Credit tests with invalid walletNumber
   */

  it('tests with invalid walletNumber', (done) => {
    const requestBody = {
      accountNumber: '08059283533',
      amountTransfer: '5000',
    };
    chai.request(server)
      .post('/api/v0/transfer/funds')
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
   * Test Transfer of funds to other users wallet within Demo Credit without token
   */

  it('Transfer loan from user wallet to persoanl/other account without token', (done) => {
    const requestBody = {
      amount: 10000,
    };
    chai.request(server)
      .post('/api/v0/transfer/funds')
      .send(requestBody)
      .end((err, response) => {
        response.should.have.status(403);

        done();
      });
  });
});
