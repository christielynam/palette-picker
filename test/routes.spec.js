const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the home page with text', (done) => {
    chai.request(server)
    .get('/')
    .end((error, response) => {
      //assertions against the response returned
      response.should.have.status(200);
      response.should.be.html;
      // response.res.text.should.equal('Welcome to Palette Picker!');
      done();
    });
  });

  it('should return a 404 for a route that does not exist', (done) => {
    chai.request(server)
    .get('/sad')
    .end((err, response) => {
      response.should.have.status(404);
      done();
    });
  });
});

describe('API Routes', () => {

});
