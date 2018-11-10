import fs from 'fs';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import User from '../private/User';

const { assert } = chai;
const { expect } = chai;
const users = JSON.parse(fs.readFileSync('private/users.json'));

chai.use(chaiHttp);

describe('User', () => {
  describe('GET /api/v1/users', () => {
    it('should display \'Please, sign-in!\'', (done) => {
      chai.request(app)
        .get('/api/v1/users')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(res.text).to.equal('Please, provide a user id to check!');
          done();
        });
    });
  });

  // get user info
  describe('GET /api/v1/users/0000', () => {
    it('should return the info of a specific user with the id: 001', (done) => {
      chai.request(app)
        .get('/api/v1/users/001')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(Object.keys(JSON.parse(res.text).userInfo).length).to.be.above(0);
          done();
        });
    });

    it('should display \'Sorry, there is no user that corresponds to this id: 0000\'', (done) => {
      chai.request(app)
        .get('/api/v1/users/0000')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(JSON.parse(res.text).error).to.equal('Sorry, there is no user that corresponds to this id: 0000');
          done();
        });
    });
  });

  /* Sign-in */
  describe('Sign-in', () => {
    describe('POST /api/v1/users/signin', () => {
      // test 1
      it('should return the user information if the account exists', (done) => {
        chai.request(app)
          .post('/api/v1/users/signin')
          .send({
            uname: 'rwajon',
            password: '12345',
          })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);
            done();
          });
      });

      // test 2
      it('should display \'Sorry, your username or password is incorrect\'', (done) => {
        chai.request(app)
          .post('/api/v1/users/signin')
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
          .post('/api/v1/users/signin')
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

  /* Sign-up */
  describe('Sign-up', () => {
    describe('POST /api/v1/users/signup', () => {
      // test 1
      it('should return the user information if the registration has succeeded', (done) => {
        chai.request(app)
          .post('/api/v1/users/signup')
          .send({
            id: '001',
            fname: 'Jonathan',
            lname: 'Rwabahizi',
            uname: 'rwajon',
            password: '12345',
            phone: '+250781146646',
            email: 'jonathanrwabahizi@gmail.com',
            country: 'Rwanda',
            city: 'Gisenyi',
            address: 'Mbugangari',
          })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(Object.keys(JSON.parse(res.text).newUser).length).to.be.above(0);
            done();
          });
      });

      // test 2
      it('should display \'Please, enter the required information to sign-up!\'', (done) => {
        chai.request(app)
          .post('/api/v1/users/signup')
          .send({
            id: '001',
            fname: 'Jonathan',
            lname: '',
            uname: 'rwajon',
            password: '',
            phone: '+250781146646',
            email: 'jonathanrwabahizi@gmail.com',
            country: 'Rwanda',
            city: 'Gisenyi',
            address: 'Mbugangari',
          })
          .end((err, res) => {
            expect(res.status).to.equal(200);
            expect(JSON.parse(res.text).error).to.equal('Please, enter the required information to sign-up!');
            done();
          });
      });
    });
  }); // end of Sign-up
});
