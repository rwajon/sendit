import fs from 'fs';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from 'src/app';

const { assert } = chai;
const { expect } = chai;
const admins = JSON.parse(fs.readFileSync('JSONFiles/admins.json'));

chai.use(chaiHttp);

describe('Admin', () => {
  /* Sign-in */
  describe('Sign-in', () => {
    describe('GET /api/v1/admins', () => {
      it('should display \'Welcome admin!!!\' if the admin successfully signed in', (done) => {
        chai.request(app)
          .get('/api/v1/admins')
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.text).to.be.equal('Welcome admin!!!');
            done();
          });
      });
    });

    describe('GET /api/v1/admins/signin', () => {
      it('should display \'Please, sign-in!\'', (done) => {
        chai.request(app)
          .get('/api/v1/admins/signin')
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(res.text).to.be.equal('Please, sign-in!');
            done();
          });
      });
    });

    describe('POST /api/v1/admins/signin', () => {
      // test 1
      it('should return the admin information if the account exists', (done) => {
        chai.request(app)
          .post('/api/v1/admins/signin')
          .send({
            uname: 'rwajon',
            password: '12345',
          })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(Object.keys(JSON.parse(res.text).admin).length).to.be.above(0);
            done();
          });
      });

      // test 2
      it('should display \'Sorry, your username or password is incorrect\'', (done) => {
        chai.request(app)
          .post('/api/v1/admins/signin')
          .send({
            uname: 'rwajon',
            password: '1234',
          })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(JSON.parse(res.text).error).to.equal('Sorry, your username or password is incorrect');
            done();
          });
      });

      // test 3
      it('should display \'Please, enter your username and your password!\'', (done) => {
        chai.request(app)
          .post('/api/v1/admins/signin')
          .send({
            uname: '',
            password: '',
          })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(JSON.parse(res.text).error).to.equal('Please, enter your username and your password!');
            done();
          });
      });
    });
  }); // end of Sign-in
});
