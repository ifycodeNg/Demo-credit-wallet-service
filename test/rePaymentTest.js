const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

// Assertion Style
chai.should();
chai.use(chaiHttp);

describe('Repayment of loan', () => {
/**
 * Test the fund wallet via card endpoint
 */

  it('Repayment of loan endpoint', (done) => {
    const requestBody = {
      amount: 10000,
    };
    chai.request(server)
      .post('/api/v0/repayment/loan')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImFjY291bnRJZCI6MiwiaWF0IjoxNjY4NzA1MzAzLCJleHAiOjE2NjkzMTAxMDN9.NSyFUfnpmwANaHqgGWBl5TBqmxDrNdaF5PQ3PbtAe50')
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
   * Test the repayment of loan endpoint with incorrect body key value
   */

  it('Test the repayment of loan endpoint with incorrect body key value', (done) => {
    const requestBody = {
      amount: 'abc',
    };
    chai.request(server)
      .post('/api/v0/repayment/loan')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImFjY291bnRJZCI6MiwiaWF0IjoxNjY4NzA1MzAzLCJleHAiOjE2NjkzMTAxMDN9.NSyFUfnpmwANaHqgGWBl5TBqmxDrNdaF5PQ3PbtAe50')
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
   * Test the repayment of loan endpoint with incorrect body keys
   */

  it('Test the repayment of loan endpoint with incorrect body keys', (done) => {
    const requestBody = {
      amountLoan: 10000,
    };
    chai.request(server)
      .post('/api/v0/repayment/loan')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImFjY291bnRJZCI6MiwiaWF0IjoxNjY4NzA1MzAzLCJleHAiOjE2NjkzMTAxMDN9.NSyFUfnpmwANaHqgGWBl5TBqmxDrNdaF5PQ3PbtAe50')
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
   * Test the repayment of loan endpoint without Token
   */

  it('Test the repayment of loan endpoint without Token', (done) => {
    const requestBody = {
      amount: 10000,
    };
    chai.request(server)
      .post('/api/v0/repayment/loan')
      .send(requestBody)
      .end((err, response) => {
        response.should.have.status(403);

        done();
      });
  });
});
