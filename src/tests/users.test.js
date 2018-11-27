import fs from 'fs';
import chai from 'chai';
import chaiHttp from 'chai-http';
import db from '../models/index';
import app from '../app';

const { assert } = chai;
const { expect } = chai;
const users = JSON.parse(fs.readFileSync('src/models/users.json'));

chai.use(chaiHttp);

describe('User', () => {
  // clear users table
  before(async () => {
    try {
      await db.query('TRUNCATE users CASCADE; ALTER SEQUENCE users_id_seq RESTART WITH 1;');
    } catch (error) {
      console.log(error);
      exit();
    }
  });

  /* Sign-up */
  describe('Sign-up', () => {
    describe('POST /api/v1/auth/signup', () => {
      // test 1
      it('should return the user information if the registration has succeeded', (done) => {
        chai.request(app)
          .post('/api/v1/auth/signup')
          .send({
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
            expect(res.status).to.equal(201);
            expect(Object.keys(JSON.parse(res.text).newUser).length).to.be.above(0);
            done();
          });
      });

      // test 2
      it('should display \'Please, enter the required information to sign-up!\'', (done) => {
        chai.request(app)
          .post('/api/v1/auth/signup')
          .send({
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

      // test 3
      it('should display \'Sorry, this account already exists\'', (done) => {
        chai.request(app)
          .post('/api/v1/auth/signup')
          .send({
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
            expect(JSON.parse(res.text).error).to.equal('Sorry, this account already exists');
            done();
          });
      });
    });
  }); // end of Sign-up

  /* Sign-in */
  describe('Sign-in', () => {
    describe('POST /api/v1/auth/signin', () => {
      // test 1
      it('should return the user information if the account exists', (done) => {
        chai.request(app)
          .post('/api/v1/auth/signin')
          .send({
            uname: 'rwajon',
            password: '12345',
          })
          .end((err, res) => {
            expect(res.status).to.equal(202);
            console.log(res.text);
            expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);
            done();
          });
      });

      // test 2
      it('should display \'Sorry, your username or password is incorrect\'', (done) => {
        chai.request(app)
          .post('/api/v1/auth/signin')
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
          .post('/api/v1/auth/signin')
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

  describe('GET /api/v1/users/:userId/parcels', () => {
    // test 1
    it('should return all parcel delivery orders of the user 1', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/auth/signin')
        .send({
          uname: 'rwajon',
          password: '12345',
        })
        .then(res => {
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          agent.post('/api/v1/parcels')
            .send({
              rname: "John Smith",
              rphone: "+123456789",
              remail: "johnsmith@gmail.com",
              product: "Sandals",
              weight: "1.5 Kg",
              quantity: "2",
              sender_country: "Rwanda",
              sender_city: "Gisenyi",
              sender_address: "Mbugangari",
              dest_country: "USA",
              dest_city: "Ney-York",
              dest_address: "Near Central Park"
            })
            .then(res => {
              expect(res.status).to.equal(201);
              expect(Object.keys(JSON.parse(res.text).order).length).to.be.above(0);

              return agent.get('/api/v1/users/1/parcels')
                .then(res => {
                  expect(res.status).to.equal(200);
                  expect(JSON.parse(res.text).parcels.length).to.be.above(0);
                })
                .then(() => {
                  done();
                  agent.close();
                });
            });
        });
    });

    // test 2
    it('should display \'Sorry, there are no parcel delivery orders\'', (done) => {
      chai.request(app)
        .get('/api/v1/users/11/parcels')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(JSON.parse(res.text).error).to.be.equal('Sorry, there are no parcel delivery orders');
          done();
        });
    });
  }); // end of GET /api/v1/users/:userId/parcels

  describe('GET /api/v1/users/:userId/parcels/pending', () => {
    before(async () => {
      try {
        await db.query('UPDATE orders SET status=\'pending\';');
      } catch (error) {
        console.log(error);
        exit();
      }
    });

    // test 1
    it('should return all pending parcel delivery orders of user 1', (done) => {
      chai.request(app)
        .get('/api/v1/users/1/parcels/pending')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(JSON.parse(res.text).pending.length).to.be.above(0);
          done();
        });
    });

    // test 2
    it('should display \'Sorry, there are no pending parcel delivery orders\'', (done) => {
      chai.request(app)
        .get('/api/v1/users/11/parcels/pending')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(JSON.parse(res.text).error).to.be.equal('Sorry, there are no pending parcel delivery orders');
          done();
        });
    });
  }); // end of GET /api/v1/users/:userId/parcels/pending

  describe('GET /api/v1/users/:userId/parcels/in-transit', () => {
    before(async () => {
      try {
        await db.query('UPDATE orders SET status=\'in transit\';');
      } catch (error) {
        console.log(error);
        exit();
      }
    });

    // test 1
    it('should return all parcels in transit of the user 1', (done) => {
      chai.request(app)
        .get('/api/v1/users/1/parcels/in-transit')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(JSON.parse(res.text).inTransit.length).to.be.above(0);
          done();
        });
    });

    // test 2
    it('should display \'Sorry, there are no parcels in transit\'', (done) => {
      chai.request(app)
        .get('/api/v1/users/000/parcels/in-transit')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(JSON.parse(res.text).error).to.be.equal('Sorry, there are no parcels in transit');
          done();
        });
    });
  }); // end of GET /api/v1/users/:userId/parcels/in-transit

  describe('GET /api/v1/users/:userId/parcels/delivered', () => {
    before(async () => {
      try {
        await db.query('UPDATE orders SET status=\'delivered\';');
      } catch (error) {
        console.log(error);
        exit();
      }
    });

    // test 1
    it('should return all delivered parcels of the user 1', (done) => {
      chai.request(app)
        .get('/api/v1/users/1/parcels/delivered')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(JSON.parse(res.text).delivered.length).to.be.above(0);
          done();
        });
    });

    // test 2
    it('should display \'Sorry, there are no delivered parcels\'', (done) => {
      chai.request(app)
        .get('/api/v1/users/000/parcels/delivered')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(JSON.parse(res.text).error).to.be.equal('Sorry, there are no delivered parcels');
          done();
        });
    });
  }); // end of GET /api/v1/users/:userId/parcels/delivered
});