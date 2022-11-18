const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');
const {config} = require('../config/config');
// Assertion Style
chai.should();
chai.use(chaiHttp);

describe('Get transaction history of user', () => {
/**
 * Test the fetch account balance endpoint
 */

  it('Its fetch transaction history of user', (done) => {
    chai.request(server)
      .get('/api/v0/account/transaction')
      .set('Authorization', `Bearer ${config.token}`)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.be.a('object');
        response.body.should.have.property('success').eq(true);
        done();
      });
  });

  /**
   * Test the fetch transaction history without token
   */

  it('wont fetch transaction history', (done) => {
    chai.request(server)
      .get('/api/v0/account/transaction')
      .end((err, response) => {
        response.should.have.status(403);
        done();
      });
  });
});
