const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const {config} = require('../config/config');
// Assertion Style
chai.should();
chai.use(chaiHttp);

describe('Fund Account via Loan', () => {
/**
 * Test the fund wallet via loan endpoint
 */

  it('Its should grant a user instant loan', (done) => {
    const requestBody = {
      loanAmount: '1000',
    };
    chai.request(server)
      .post('/api/v0/fund/wallet')
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
   * Test the fund wallet via loan endpoint with incorrect body parameter
   */

  it('Its should not grant a user loan', (done) => {
    const requestBody = {
      amount: '20000',
    };
    chai.request(server)
      .post('/api/v0/fund/wallet')
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
   * Test the fund wallet via loan endpoint with incorrect body key parameter
   */

  it('Its should not grant a user loan', (done) => {
    const requestBody = {
      loanAmount: 'abc',
    };
    chai.request(server)
      .post('/api/v0/fund/wallet')
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

  it('Its should not grant a user loan', (done) => {
    const requestBody = {
      amount: '20000',
    };
    chai.request(server)
      .post('/api/v0/fund/wallet')
      .send(requestBody)
      .end((err, response) => {
        response.should.have.status(403);

        done();
      });
  });
});
