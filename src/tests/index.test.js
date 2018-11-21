import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';

const { assert } = chai;
const { expect } = chai;

chai.use(chaiHttp);

describe('index', () => {
  describe('GET api/v1', () => {
    it('it should return a status code of 200 and display \'Welcome!!!\'', (done) => {
      chai.request(app).get('/api/v1').end((err, res) => {
        expect(res.status).to.equal(200);
        expect(res.text).to.equal('Welcome!!!');
        done();
      });
    });
  });

  describe('Error page', () => {
    it('it should return a status code of 404 ', (done) => {
      chai.request(app).get('/api/v0').end((err, res) => {
        expect(JSON.parse(res.text).error).to.equal(404);
        done();
      });
    });
  });
});
