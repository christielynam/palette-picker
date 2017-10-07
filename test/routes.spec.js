const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

chai.use(chaiHttp);

describe('Client Routes', () => {
  it('should return the home page with text', (done) => {
    chai.request(server)
    .get('/')
    .end((error, response) => {
      response.should.have.status(200);
      response.should.be.html;
      response.res.text.includes('Palette Picker');
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

  before((done) => {
    database.migrate.latest()
      .then(() => done())
      .catch(error => console.log(error));
  });

  beforeEach((done) => {
    database.seed.run()
      .then(() => done())
      .catch(error => console.log(error));
  });

  describe('GET /api/v1/projects', () => {

    it('should retrieve all projects', (done) => {
      chai.request(server)
      .get('/api/v1/projects')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1);
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('Project 1');
        done();
      });
    });

    it('should return a 404 if the path is incorrect', (done) => {
      chai.request(server)
      .get('/api/v1/poop')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      });
    });

  });

  describe('POST /api/v1/projects', () => {

    it('should be able to add a new project to the db', (done) => {
      chai.request(server)
      .post('/api/v1/projects')
      .send({
        id: 2,
        name: 'Project 2'
      })
      .end((error, response) => {
        response.should.have.status(201);
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('Project 2');
        chai.request(server)
        .get('/api/v1/projects')
        .end((error, response) => {
          response.body.should.be.a('array');
          response.body.length.should.equal(2);
          done();
        });
      });
    });

    it('should not create a project with missing data', (done) => {
      chai.request(server)
      .post('/api/v1/projects')
      .send({
        id: 2
      })
      .end((error, response) => {
        response.should.have.status(422);
        // response.body.error.should.equal('Expected format: { name: <String> }. You're missing a "name" property.');
        done();
      });
    });

  })


  describe('GET /api/v1/palettes', () => {

    it('should retrieve all palettes', (done) => {
      chai.request(server)
      .get('/api/v1/palettes')
      .end((error, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(2);
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1);
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('Life Savers');
        response.body[0].should.have.property('hex_val_1');
        response.body[0].hex_val_1.should.equal('#2B0DBC')
        response.body[0].should.have.property('hex_val_2');
        response.body[0].hex_val_2.should.equal('#7C93FE');
        response.body[0].should.have.property('hex_val_3');
        response.body[0].hex_val_3.should.equal('#DC8AC9');
        response.body[0].should.have.property('hex_val_4');
        response.body[0].hex_val_4.should.equal('#C9309E');
        response.body[0].should.have.property('hex_val_5');
        response.body[0].hex_val_5.should.equal('#B442E9');
        response.body[0].should.have.property('project_id');
        response.body[0].project_id.should.equal(1);
        response.body[1].should.have.property('id');
        response.body[1].id.should.equal(2);
        response.body[1].should.have.property('name');
        response.body[1].name.should.equal('Cotton Candy');
        response.body[1].should.have.property('hex_val_1');
        response.body[1].hex_val_1.should.equal('#135D1D')
        response.body[1].should.have.property('hex_val_2');
        response.body[1].hex_val_2.should.equal('#8AF105');
        response.body[1].should.have.property('hex_val_3');
        response.body[1].hex_val_3.should.equal('#7946B2');
        response.body[1].should.have.property('hex_val_4');
        response.body[1].hex_val_4.should.equal('#27CCB6');
        response.body[1].should.have.property('hex_val_5');
        response.body[1].hex_val_5.should.equal('#874D5E');
        response.body[1].should.have.property('project_id');
        response.body[1].project_id.should.equal(1);
        done();
      });
    });

    it('should return a 404 if the path is incorrect', (done) => {
      chai.request(server)
      .get('/api/v1/poop')
      .end((error, response) => {
        response.should.have.status(404);
        done();
      });
    });

  });

  describe('POST /api/v1/palettes', () => {

    it('should be able to add a new palette to a project', (done) => {
      chai.request(server)
      .post('/api/v1/palettes')
      .send({
        id: 3,
        name: 'Starburst',
        hex_val_1: '#6D0BE1',
        hex_val_2: '#E20F50',
        hex_val_3: '#B483F5',
        hex_val_4: '#709F06',
        hex_val_5: '#86CE37',
        project_id: 1
      })
      .end((error, response) => {
        response.should.have.status(201);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(3);
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('Starburst');
        response.body[0].should.have.property('hex_val_1');
        response.body[0].hex_val_1.should.equal('#6D0BE1');
        response.body[0].should.have.property('hex_val_2');
        response.body[0].hex_val_2.should.equal('#E20F50');
        response.body[0].should.have.property('hex_val_3');
        response.body[0].hex_val_3.should.equal('#B483F5');
        response.body[0].should.have.property('hex_val_4');
        response.body[0].hex_val_4.should.equal('#709F06');
        response.body[0].should.have.property('hex_val_5');
        response.body[0].hex_val_5.should.equal('#86CE37');
        response.body[0].should.have.property('project_id');
        response.body[0].project_id.should.equal(1);
        chai.request(server)
        .get('/api/v1/palettes')
        .end((error, response) => {
          response.body.should.be.a('array');
          response.body.length.should.equal(3);
          done();
        });
      });
    });

    it('should not create a palette with missing data', (done) => {
      chai.request(server)
      .post('/api/v1/palettes')
      .send({
        id: 3,
        name: 'Starburst',
        hex_val_1: '#6D0BE1',
        hex_val_2: '#E20F50',
        hex_val_3: '#B483F5',
        hex_val_4: '#709F06',
        hex_val_5: '#86CE37'
      })
      .end((error, response) => {
        response.should.have.status(422);
        // response.body.error.should.equal('Expected format: { name: <String>, hex_val_1: <String>, hex_val_2: <String>, hex_val_3: <String>, hex_val_4: <String>, hex_val_5: <String>, project_id: <Integer> }. You're missing a "project_id" property.');
        done();
      });
    });
  });

});
