const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

// Assertion Style
chai.should();
chai.use(chaiHttp);

describe('Get loan balance of users', () => {
/**
 * Test the fetch loan balance endpoint
 */

  it('Its fetch loan balance of user', (done) => {
    chai.request(server)
      .get('/api/v0/loan/balance')
      .set('Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsImFjY291bnRJZCI6MiwiaWF0IjoxNjY4NzA1MzAzLCJleHAiOjE2NjkzMTAxMDN9.NSyFUfnpmwANaHqgGWBl5TBqmxDrNdaF5PQ3PbtAe50')
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.be.a('object');
        response.body.should.have.property('success').eq(true);
        done();
      });
  });

  /**
   * Test the fetch loan balance without token
   */

  it('wont fetch loan balance', (done) => {
    chai.request(server)
      .get('/api/v0/loan/balance')
      .end((err, response) => {
        response.should.have.status(403);
        done();
      });
  });
});
