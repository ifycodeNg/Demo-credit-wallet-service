const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

// Assertion Style
chai.should();
chai.use(chaiHttp);

describe('Login API', () => {
/**
 * Test the Login endpoint
 */

  it('Its should login a user', (done) => {
    const requestBody = {
      email: 'ifyugwumba52@gmail.com',
      userPassword: '08059284543',

    };
    chai.request(server)
      .post('/api/v0/login')
      .send(requestBody)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.be.a('object');
        response.body.should.have.property('success').eq(true);
        response.body.should.have.property('firstName');
        response.body.should.have.property('phoneNumber');
        response.body.should.have.property('accountNumber');
        response.body.should.have.property('address');
        response.body.should.have.property('token');
        response.body.should.have.property('msg');

        done();
      });
  });

  /**
   * Test the Login endpoint using incorrect email
   * but a correct password
   */
  it('Its should not Login a user', (done) => {
    const requestBody = {
      email: 'ifyugwumba00@gmail.com',
      userPassword: '08059284543',
    };
    chai.request(server)
      .post('/api/v0/register')
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
   * Test the Login endpoint using correct email
   * but a incorrect password
   */
  it('Its should not login a user', (done) => {
    const requestBody = {
      email: 'ifyugwumba52@gmail.com',
      userPassword: '08059284588',
    };
    chai.request(server)
      .post('/api/v0/login')
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
   * Test the Login endpoint using correct email
   * but a incorrect password
   */
  it('Its should not login a user', (done) => {
    const requestBody = {
      email: 'ifyugwumba52@gmail.com',
      userPassword: '08059284544',
    };
    chai.request(server)
      .post('/api/v0/login')
      .send(requestBody)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.be.a('object');
        response.body.should.have.property('success').eq(false);
        response.body.should.have.property('msg');

        done();
      });
  });
});
