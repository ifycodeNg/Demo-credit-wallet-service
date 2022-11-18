const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const {config} = require('../config/config');

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
      .set('Authorization', `Bearer ${config.token}`)
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
