const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../app');

// Assertion Style
chai.should();
chai.use(chaiHttp);

describe('Registration API', () => {
/**
 * Test the Registration endpoint
 */

  it('Its should register a user', (done) => {
    const requestBody = {
      email: 'ifyugwumba52@gmail.com',
      password: '08059284543',
      firstName: 'Ifeanyi',
      lastName: 'ugwumba',
      mobileNumber: '08059284552',
      address: 'Maitama Abuja',

    };
    chai.request(server)
      .post('/api/v0/register')
      .send(requestBody)
      .end((err, response) => {
        response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.should.have.property('success');
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
   * Test the Registration endpoint using registered email
   * and registered mobile number
   */

  it('Its should not register a user', (done) => {
    const requestBody = {
      email: 'ifyugwumba52@gmail.com',
      password: '08059284543',
      firstName: 'Ifeanyi',
      lastName: 'ugwumba',
      mobileNumber: '08059284552',
      address: 'Maitama Abuja',

    };
    chai.request(server)
      .post('/api/v0/register')
      .send(requestBody)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.be.a('object');
        response.body.should.have.property('success');
        response.body.should.have.property('msg');

        done();
      });
  });

  /**
   * Test the Registration endpoint using registered email
   * and a different mobile number
   */

  it('Its should not register a user', (done) => {
    const requestBody = {
      email: 'ifyugwumba52@gmail.com',
      password: '08059284588',
      firstName: 'Ifeanyi',
      lastName: 'ugwumba',
      mobileNumber: '08059284589',
      address: 'Maitama Abuja',

    };
    chai.request(server)
      .post('/api/v0/register')
      .send(requestBody)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.be.a('object');
        response.body.should.have.property('success');
        response.body.should.have.property('msg');

        done();
      });
  });

  /**
   * Test the Registration endpoint using different email
   * but a registered number
   */
  it('Its should not register a user', (done) => {
    const requestBody = {
      email: 'ifyugwumba59@gmail.com',
      password: '08059284543',
      firstName: 'Ifeanyi',
      lastName: 'ugwumba',
      mobileNumber: '08059284552',
      address: 'Maitama Abuja',

    };
    chai.request(server)
      .post('/api/v0/register')
      .send(requestBody)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.be.a('object');
        response.body.should.have.property('success');
        response.body.should.have.property('msg');

        done();
      });
  });

  /**
   * Test the Registration endpoint using incomplete set of parameters
   */

  it('Its should not register a user', (done) => {
    const requestBody = {
      email: 'ifyugwumba16@gmail.com',
      password: '08059284543',
      firstName: 'Ifeanyi',
      address: 'Maitama Abuja',
    };
    chai.request(server)
      .post('/api/v0/register')
      .send(requestBody)
      .end((err, response) => {
        response.should.have.status(200);
        response.body.should.be.a('object');
        response.body.should.have.property('success');
        response.body.should.have.property('msg');

        done();
      });
  });

  /**
* Test the Registration endpoint using incorrect email format
    */

  it('Its should not register a user', (done) => {
    const requestBody = {
      email: 'ifyugwumba50.com',
      password: '08059284543',
      firstName: 'Ifeanyi',
      lastName: 'ugwumba',
      mobileNumber: '08059284550',
      address: 'Maitama Abuja',

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
});
