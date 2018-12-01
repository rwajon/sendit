import chai from 'chai';
import chaiHttp from 'chai-http';
import db from '../models/index';
import app from '../app';

const { assert } = chai;
const { expect } = chai;

chai.use(chaiHttp);

describe('User', () => {
  // clear users table
  before(async () => {
    try {
      await db.query('TRUNCATE users CASCADE; ALTER SEQUENCE users_id_seq RESTART WITH 1;');
      await db.query('TRUNCATE orders; ALTER SEQUENCE orders_id_seq RESTART WITH 1;');
    } catch (error) {
      console.log(error);
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
    describe('POST /api/v1/auth/login', () => {
      // test 1
      it('should return the user information if the account exists', (done) => {
        chai.request(app)
          .post('/api/v1/auth/login')
          .send({
            uname: 'rwajon',
            password: '12345',
          })
          .end((err, res) => {
            expect(res.status).to.equal(202);
            expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);
            done();
          });
      });

      // test 2
      it('should display \'Sorry, your username or password is incorrect\'', (done) => {
        chai.request(app)
          .post('/api/v1/auth/login')
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
          .post('/api/v1/auth/login')
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

  /** ***************TESTS WITH POPULATED TABLES************************ */
  // Get all parcels
  describe('GET /api/v1/users/:userId/parcels', () => {
    // test 1
    before(async () => {
      try {
        await db.query('INSERT INTO orders VALUES(DEFAULT, 1,\'John Smith\', \'+123456789\', \'johnsmith@gmail.com\', \'USA\', \'Ney-York\', \'Near Central Park\', \'Sandals\', \'1.5 Kg\', 2, 111, \'pending\', \'USA, Ney-York - Central Park Av\', DEFAULT)');
      } catch (error) {
        console.log(error);
      }
    });

    it('should return all parcel delivery orders of the user 1', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/auth/login')
        .send({
          uname: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.get('/api/v1/users/1/parcels')
            .set('x-access-token', token)
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(JSON.parse(res.text).parcels.length).to.be.above(0);
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });

    // test 2
    it('should display \'Sorry, you can not view these orders\'', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/auth/login')
        .send({
          uname: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.get('/api/v1/users/2/parcels')
            .set('x-access-token', token)
            .then((res) => {
              expect(res.status).to.equal(401);
              expect(JSON.parse(res.text).error).to.be.equal('Sorry, you can not view these orders');
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });

    // test 3
    it('should display \'Sorry, you don\'t have access to this route\'', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/admins/login')
        .send({
          uname: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).admin).length).to.be.above(0);

          return agent.get('/api/v1/users/1/parcels')
            .set('x-access-token', token)
            .then((res) => {
              expect(res.status).to.equal(401);
              expect(JSON.parse(res.text).error).to.be.equal('Sorry, you don\'t have access to this route');
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });
  }); // end of GET /api/v1/users/:userId/parcels

  describe('GET /api/v1/users/:userId/parcels/pending', () => {
    before(async () => {
      try {
        await db.query('UPDATE orders SET status=\'pending\';');
      } catch (error) {
        console.log(error);
      }
    });

    it('should return all pending parcel delivery orders of user 1', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/auth/login')
        .send({
          uname: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.get('/api/v1/users/1/parcels/pending')
            .set('x-access-token', token)
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(JSON.parse(res.text).pending.length).to.be.above(0);
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });

    // test 2
    it('should display \'Sorry, you can not view these orders\'', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/auth/login')
        .send({
          uname: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.get('/api/v1/users/2/parcels/pending')
            .set('x-access-token', token)
            .then((res) => {
              expect(res.status).to.equal(401);
              expect(JSON.parse(res.text).error).to.be.equal('Sorry, you can not view these orders');
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });

    // test 3
    it('should display \'Sorry, you don\'t have access to this route\'', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/admins/login')
        .send({
          uname: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).admin).length).to.be.above(0);

          return agent.get('/api/v1/users/1/parcels/pending')
            .set('x-access-token', token)
            .then((res) => {
              expect(res.status).to.equal(401);
              expect(JSON.parse(res.text).error).to.be.equal('Sorry, you don\'t have access to this route');
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });
  });

  describe('GET /api/v1/users/:userId/parcels/in-transit', () => {
    before(async () => {
      try {
        await db.query('UPDATE orders SET status=\'in transit\';');
      } catch (error) {
        console.log(error);
      }
    });

    // test 1
    it('should return all parcels in transit of the user 1', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/auth/login')
        .send({
          uname: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.get('/api/v1/users/1/parcels/in-transit')
            .set('x-access-token', token)
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(JSON.parse(res.text).inTransit.length).to.be.above(0);
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });

    // test 2
    it('should display \'Sorry, you can not view these orders\'', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/auth/login')
        .send({
          uname: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.get('/api/v1/users/2/parcels/in-transit')
            .set('x-access-token', token)
            .then((res) => {
              expect(res.status).to.equal(401);
              expect(JSON.parse(res.text).error).to.be.equal('Sorry, you can not view these orders');
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });

    // test 3
    it('should display \'Sorry, you don\'t have access to this route\'', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/admins/login')
        .send({
          uname: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).admin).length).to.be.above(0);

          return agent.get('/api/v1/users/1/parcels/in-transit')
            .set('x-access-token', token)
            .then((res) => {
              expect(res.status).to.equal(401);
              expect(JSON.parse(res.text).error).to.be.equal('Sorry, you don\'t have access to this route');
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });
  }); // end of GET /api/v1/users/:userId/parcels/in-transit

  describe('GET /api/v1/users/:userId/parcels/delivered', () => {
    before(async () => {
      try {
        await db.query('UPDATE orders SET status=\'delivered\';');
      } catch (error) {
        console.log(error);
      }
    });

    // test 1
    it('should return all delivered parcels of the user 1', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/auth/login')
        .send({
          uname: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.get('/api/v1/users/1/parcels/delivered')
            .set('x-access-token', token)
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(JSON.parse(res.text).delivered.length).to.be.above(0);
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });

    // test 2
    it('should display \'Sorry, you can not view these orders\'', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/auth/login')
        .send({
          uname: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.get('/api/v1/users/2/parcels/delivered')
            .set('x-access-token', token)
            .then((res) => {
              expect(res.status).to.equal(401);
              expect(JSON.parse(res.text).error).to.be.equal('Sorry, you can not view these orders');
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });

    // test 3
    it('should display \'Sorry, you don\'t have access to this route\'', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/admins/login')
        .send({
          uname: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).admin).length).to.be.above(0);

          return agent.get('/api/v1/users/1/parcels/delivered')
            .set('x-access-token', token)
            .then((res) => {
              expect(res.status).to.equal(401);
              expect(JSON.parse(res.text).error).to.be.equal('Sorry, you don\'t have access to this route');
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });
  }); // end of GET /api/v1/users/:userId/parcels/delivered

  /** ***************TESTS WITH EMPTY TABLES************************ */
  // Get all parcels
  describe('GET /api/v1/users/:userId/parcels', () => {
    // test 1
    before(async () => {
      try {
        await db.query('TRUNCATE orders; ALTER SEQUENCE orders_id_seq RESTART WITH 1;');
      } catch (error) {
        console.log(error);
      }
    });

    it('should display \'Sorry, there are no parcel delivery orders\'', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/auth/login')
        .send({
          uname: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.get('/api/v1/users/1/parcels')
            .set('x-access-token', token)
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(JSON.parse(res.text).error).to.be.equal('Sorry, there are no parcel delivery orders');
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });
  }); // end of GET /api/v1/users/:userId/parcels

  describe('GET /api/v1/users/:userId/parcels/pending', () => {
    before(async () => {
      try {
        await db.query('TRUNCATE orders; ALTER SEQUENCE orders_id_seq RESTART WITH 1;');
      } catch (error) {
        console.log(error);
      }
    });

    it('should display \'Sorry, there are no pending parcel delivery orders\'', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/auth/login')
        .send({
          uname: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.get('/api/v1/users/1/parcels/pending')
            .set('x-access-token', token)
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(JSON.parse(res.text).error).to.be.equal('Sorry, there are no pending parcel delivery orders');
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });
  });

  describe('GET /api/v1/users/:userId/parcels/in-transit', () => {
    before(async () => {
      try {
        await db.query('TRUNCATE orders; ALTER SEQUENCE orders_id_seq RESTART WITH 1;');
      } catch (error) {
        console.log(error);
      }
    });

    // test 1
    it('should display \'Sorry, there are no parcels in transit\'', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/auth/login')
        .send({
          uname: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.get('/api/v1/users/1/parcels/in-transit')
            .set('x-access-token', token)
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(JSON.parse(res.text).error).to.be.equal('Sorry, there are no parcels in transit');
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });
  }); // end of GET /api/v1/users/:userId/parcels/in-transit

  describe('GET /api/v1/users/:userId/parcels/delivered', () => {
    before(async () => {
      try {
        await db.query('TRUNCATE orders; ALTER SEQUENCE orders_id_seq RESTART WITH 1;');
      } catch (error) {
        console.log(error);
      }
    });

    // test 1
    it('should display \'Sorry, there are no delivered parcels\'', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/auth/login')
        .send({
          uname: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.get('/api/v1/users/1/parcels/delivered')
            .set('x-access-token', token)
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(JSON.parse(res.text).error).to.be.equal('Sorry, there are no delivered parcels');
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });
  }); // end of GET /api/v1/users/:userId/parcels/delivered
});
