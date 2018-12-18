import chai from 'chai';
import chaiHttp from 'chai-http';
import db from '../models/index';
import app from '../app';

const { assert } = chai;
const { expect } = chai;

chai.use(chaiHttp);

describe('Parcel', () => {
  // clear orders table
  before(async () => {
    try {
      await db.query('TRUNCATE orders; ALTER SEQUENCE orders_id_seq RESTART WITH 1;');
    } catch (error) {
      console.log(error);
    }
  });

  describe('POST /api/v1/parcels', () => {
    // test 1
    it('should create a parcel delivery order', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/auth/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.post('/api/v1/parcels')
            .set('x-access-token', token)
            .send({
              receiverName: 'John Smith',
              receiverPhone: '+123456789',
              receiverEmail: 'johnsmith@gmail.com',
              product: 'Sandals',
              weight: '1.5 Kg',
              quantity: '2',
              price: 100,
              senderCountry: 'Rwanda',
              senderCity: 'Gisenyi',
              senderAddress: 'Mbugangari',
              receiverCountry: 'USA',
              receiverCity: 'Ney-York',
              receiverAddress: 'Near Central Park',
            })
            .then((res) => {
              expect(res.status).to.equal(201);
              expect(Object.keys(JSON.parse(res.text).order).length).to.be.above(0);
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });

    // test 2
    it('should display \`Please enter the required information to create an order!\`', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/auth/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.post('/api/v1/parcels')
            .set('x-access-token', token)
            .send({
              receiverName: '',
              receiverPhone: '',
              receiverEmail: 'johnsmith@gmail.com',
              product: '',
              weight: '1.5 Kg',
              quantity: '',
              price: 100,
              senderCountry: 'Rwanda',
              senderCity: 'Gisenyi',
              senderAddress: 'Mbugangari',
              receiverCountry: '',
              receiverCity: 'Ney-York',
              receiverAddress: 'Near Central Park',
            })
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(JSON.parse(res.text).error).to.be.equal('Please enter the required information to create an order!');
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
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).admin).length).to.be.above(0);

          return agent.post('/api/v1/parcels')
            .set('x-access-token', token)
            .send({})
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
  }); // end of POST /api/v1/parcels

  describe('GET /api/v1/parcels', () => {
    it('should return all parcel delivery orders', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/admins/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).admin).length).to.be.above(0);

          return agent.get('/api/v1/parcels')
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
    it('should display \'Sorry, you don\'t have access to this route\'', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/auth/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.get('/api/v1/parcels')
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
  }); // end of GET /api/v1/parcels

  describe('GET /api/v1/parcels/pending', () => {
    before(async () => {
      try {
        await db.query('UPDATE orders SET status=\'pending\';');
      } catch (error) {
        console.log(error);
      }
    });

    it('should return all pending parcel delivery orders', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/admins/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).admin).length).to.be.above(0);

          return agent.get('/api/v1/parcels/pending')
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
    it('should display \'Sorry, you don\'t have access to this route\'', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/auth/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.get('/api/v1/parcels/pending')
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
  }); // end of GET /api/v1/parcels/pending

  describe('GET /api/v1/parcels/inTransit', () => {
    before(async () => {
      try {
        await db.query('UPDATE orders SET status=\'in transit\';');
      } catch (error) {
        console.log(error);
      }
    });

    // test 1
    it('should return all parcels in transit', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/admins/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).admin).length).to.be.above(0);

          return agent.get('/api/v1/parcels/inTransit')
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
    it('should display \'Sorry, you don\'t have access to this route\'', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/auth/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.get('/api/v1/parcels/inTransit')
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
  }); // end of GET /api/v1/parcels/inTransit

  describe('GET /api/v1/parcels/delivered', () => {
    before(async () => {
      try {
        await db.query('UPDATE orders SET status=\'delivered\';');
      } catch (error) {
        console.log(error);
      }
    });

    // test 1
    it('should return all delivered parcels', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/admins/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).admin).length).to.be.above(0);

          return agent.get('/api/v1/parcels/delivered')
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
    it('should display \'Sorry, you don\'t have access to this route\'', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/auth/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.get('/api/v1/parcels/delivered')
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
  }); // end of GET /api/v1/parcels/delivered

  describe('GET /api/v1/parcels/:pId', () => {
    it('should return details of a specific parcel delivery order with id: 1', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/admins/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).admin).length).to.be.above(0);

          return agent.get('/api/v1/parcels/1')
            .set('x-access-token', token)
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(Object.keys(JSON.parse(res.text).order).length).to.be.above(0);
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });

    it('should display \'Sorry, there is no parcel delivery order with this id: 000\'', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/admins/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).admin).length).to.be.above(0);

          return agent.get('/api/v1/parcels/000')
            .set('x-access-token', token)
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(JSON.parse(res.text).error).to.be.equal('Sorry, there is no parcel delivery order with this id: 000');
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });
  }); // end of GET /api/v1/parcels/:pId

  describe('PUT /api/v1/parcels/:pId/destination', () => {
    // test 1
    it('should change the destination of a specific parcel delivery order with the id: 1', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/auth/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.put('/api/v1/parcels/1/destination')
            .set('x-access-token', token)
            .send({
              country: 'Uganda',
              city: 'Kampala',
              address: 'Downtown',
            })
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(Object.keys(JSON.parse(res.text).changed).length).to.be.above(0);
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });

    // test 2
    it('should display \'Sorry, you don\'t have access to this route\'', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/admins/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).admin).length).to.be.above(0);

          return agent.put('/api/v1/parcels/1/destination')
            .set('x-access-token', token)
            .send({
              country: 'Uganda',
              city: 'Kampala',
              address: 'Downtown',
            })
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

    // test 3
    it('should change the destination of a specific parcel delivery order with the id: 1', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/auth/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.put('/api/v1/parcels/1/destination')
            .set('x-access-token', token)
            .send({
              country: '',
              city: 'Kampala',
              address: 'Downtown',
            })
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(Object.keys(JSON.parse(res.text).changed).length).to.be.above(0);
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });

    // test 4
    it('should change the destination of a specific parcel delivery order with the id: 1', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/auth/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.put('/api/v1/parcels/1/destination')
            .set('x-access-token', token)
            .send({
              country: 'Uganda',
              city: '',
              address: 'Downtown',
            })
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(Object.keys(JSON.parse(res.text).changed).length).to.be.above(0);
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });

    // test 5
    it('should change the destination of a specific parcel delivery order with the id: 1', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/auth/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.put('/api/v1/parcels/1/destination')
            .set('x-access-token', token)
            .send({
              country: 'Uganda',
              city: 'Kampala',
              address: '',
            })
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(Object.keys(JSON.parse(res.text).changed).length).to.be.above(0);
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });

    // test 6
    it('should display \'Sorry, this order was not changed\'', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/auth/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.put('/api/v1/parcels/1/destination')
            .set('x-access-token', token)
            .send({
              country: '',
              city: '',
              address: '',
            })
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(JSON.parse(res.text).error).to.be.equal('Sorry, this order was not changed');
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });

    // test 7
    it('should display \'Sorry, you can not change this order\'', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/auth/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.put('/api/v1/parcels/111/destination')
            .set('x-access-token', token)
            .send({
              country: 'Uganda',
              city: 'Kampala',
              address: 'Downtown',
            })
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(JSON.parse(res.text).error).to.be.equal('Sorry, you can not change this order');
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });
  }); // end of PUT /api/v1/parcels/:pId/destination

  describe('PUT /api/v1/parcels/:pId/status', () => {
    // test 1
    it('should change the status of a specific parcel delivery order with the id: 1', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/admins/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).admin).length).to.be.above(0);

          return agent.put('/api/v1/parcels/1/status')
            .set('x-access-token', token)
            .send({
              status: 'delivered',
            })
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(Object.keys(JSON.parse(res.text).changed).length).to.be.above(0);
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });

    // test 2
    it('should display \'Sorry, you don\'t have access to this route\'', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/auth/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.put('/api/v1/parcels/1/status')
            .set('x-access-token', token)
            .send({
              status: 'delivered',
            })
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

    // test 3
    it('should display \'Sorry, this order was not changed\'', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/admins/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).admin).length).to.be.above(0);

          return agent.put('/api/v1/parcels/1/status')
            .set('x-access-token', token)
            .send({
              status: '',
            })
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(JSON.parse(res.text).error).to.be.equal('Sorry, this order was not changed');
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });

    // test 3
    it('should display \'Sorry, no order with id 000 was found\'', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/admins/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).admin).length).to.be.above(0);

          return agent.put('/api/v1/parcels/000/status')
            .set('x-access-token', token)
            .send({
              status: 'delivered',
            })
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(JSON.parse(res.text).error).to.be.equal('Sorry, no order with id 000 was found');
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });
  }); // end of PUT /api/v1/parcels/:pId/status

  describe('PUT /api/v1/parcels/:pId/presentLocation', () => {
    // test 1
    it('should change the present location of a specific parcel delivery order with the id: 1', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/admins/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).admin).length).to.be.above(0);

          return agent.put('/api/v1/parcels/1/presentLocation')
            .set('x-access-token', token)
            .send({
              country: 'Uganda',
              city: 'Kampala',
              address: 'Downtown',
            })
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(Object.keys(JSON.parse(res.text).changed).length).to.be.above(0);
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });

    // test 2
    it('should display \'Sorry, you don\'t have access to this route\'', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/auth/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.put('/api/v1/parcels/1/presentLocation')
            .set('x-access-token', token)
            .send({
              country: 'Uganda',
              city: 'Kampala',
              address: 'Downtown',
            })
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

    // test 3
    it('should display \'Sorry, this order was not changed\'', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/admins/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).admin).length).to.be.above(0);

          return agent.put('/api/v1/parcels/1/presentLocation')
            .set('x-access-token', token)
            .send({
              country: '',
              city: '',
              address: '',
            })
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(JSON.parse(res.text).error).to.be.equal('Sorry, this order was not changed');
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });

    // test 4
    it('should display \'Sorry, no order with id 000 was found\'', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/admins/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).admin).length).to.be.above(0);

          return agent.put('/api/v1/parcels/000/presentLocation')
            .set('x-access-token', token)
            .send({
              country: 'Uganda',
              city: 'Kampala',
              address: 'Downtown',
            })
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(JSON.parse(res.text).error).to.be.equal('Sorry, no order with id 000 was found');
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });
  }); // end of PUT /api/v1/parcels/:pId/presentLocation

  describe('PUT /api/v1/parcels/:pId/cancel', () => {
    // test1
    it('should cancel a specific parcel delivery order with the id: 1', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/auth/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.put('/api/v1/parcels/1/cancel')
            .set('x-access-token', token)
            .send({
              status: 'cancelled',
            })
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(Object.keys(JSON.parse(res.text).cancelled).length).to.be.above(0);
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });

    // test 2
    it('should display \'Sorry, you don\'t have access to this route\'', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/admins/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).admin).length).to.be.above(0);

          return agent.put('/api/v1/parcels/1/cancel')
            .set('x-access-token', token)
            .send({
              status: 'cancelled',
            })
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

    // test2
    it('should display \'Sorry, you can not cancel this order\'', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/auth/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.put('/api/v1/parcels/000/cancel')
            .set('x-access-token', token)
            .send({
              status: 'cancelled',
            })
            .then((res) => {
              expect(res.status).to.equal(200);
              expect(JSON.parse(res.text).error).to.be.equal('Sorry, you can not cancel this order');
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });
  }); // end of PUT /api/v1/parcels/:pId/cancel


  /** ***************TESTS WITH EMPTY TABLES************************ */
  // Get all parcels
  describe('GET /api/v1/parcels', () => {
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

      agent.post('/api/v1/admins/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).admin).length).to.be.above(0);

          return agent.get('/api/v1/parcels')
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
  }); // end of GET /api/v1/parcels

  describe('GET /api/v1/parcels/pending', () => {
    before(async () => {
      try {
        await db.query('TRUNCATE orders; ALTER SEQUENCE orders_id_seq RESTART WITH 1;');
      } catch (error) {
        console.log(error);
      }
    });

    it('should display \'Sorry, there are no pending parcel delivery orders\'', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/admins/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).admin).length).to.be.above(0);

          return agent.get('/api/v1/parcels/pending')
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
  }); // end of GET /api/v1/parcels/pending

  describe('GET /api/v1/parcels/inTransit', () => {
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

      agent.post('/api/v1/admins/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).admin).length).to.be.above(0);

          return agent.get('/api/v1/parcels/inTransit')
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
  }); // end of GET /api/v1/parcels/inTransit

  describe('GET /api/v1/parcels/delivered', () => {
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

      agent.post('/api/v1/admins/login')
        .send({
          userName: 'rwajon',
          password: '12345',
        })
        .then((res) => {
          const token = JSON.parse(res.text).token;
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).admin).length).to.be.above(0);

          return agent.get('/api/v1/parcels/delivered')
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
  }); // end of GET /api/v1/parcels/delivered
});
