const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

// Assertion Style
chai.should();
chai.use(chaiHttp);

describe('Get account balance', () => {
/**
 * Test to the fetch all banks in nigeria endpoint
 */

  it('fetch banks', (done) => {
    chai.request(server)
      .get('/api/v0/get/banks')
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.be.a('object');
        response.body.should.have.property('success').eq(true);
        done();
      });
  });
});
