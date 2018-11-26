import fs from 'fs';
import chai from 'chai';
import chaiHttp from 'chai-http';
import db from '../models/index';
import app from '../app';

const { assert } = chai;
const { expect } = chai;
const parcels = JSON.parse(fs.readFileSync('src/models/parcels.json'));

chai.use(chaiHttp);

describe('Parcel', () => {
  // clear orders table
  before(async () => {
    try {
      await db.query('TRUNCATE orders; ALTER SEQUENCE orders_id_seq RESTART WITH 1;');
    } catch (error) {
      console.log(error);
      exit();
    }
  });

  describe('POST /api/v1/parcels', () => {
    // test 1
    it('should create a parcel delivery order', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/users/signin')
        .send({
          uname: 'rwajon',
          password: '12345',
        })
        .then(res => {
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.post('/api/v1/parcels')
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

      agent.post('/api/v1/users/signin')
        .send({
          uname: 'rwajon',
          password: '12345',
        })
        .then(res => {
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.post('/api/v1/parcels')
            .send({
              rname: "",
              rphone: "",
              remail: "johnsmith@gmail.com",
              product: "",
              weight: "1.5 Kg",
              quantity: "",
              sender_country: "Rwanda",
              sender_city: "Gisenyi",
              sender_address: "Mbugangari",
              dest_country: "",
              dest_city: "Ney-York",
              dest_address: "Near Central Park"
            })
            .then(res => {
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
    it('should display \`Please, sign-in to create an order!\`', (done) => {
      chai.request(app)
        .post('/api/v1/parcels')
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
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(JSON.parse(res.text).error).to.be.equal('Please, sign-in to create an order!');
          done();
        });
    });
  }); // end of POST /api/v1/users/:id/parcels

  describe('GET /api/v1/parcels', () => {
    it('should return all parcel delivery orders', (done) => {
      chai.request(app)
        .get('/api/v1/parcels')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(JSON.parse(res.text).parcels.length).to.be.above(0);
          done();
        });
    });
  }); // end of GET /api/v1/parcels

  describe('GET /api/v1/parcels/pending', () => {
    before(async () => {
      try {
        await db.query('UPDATE orders SET status=\'pending\';');
      } catch (error) {
        console.log(error);
        exit();
      }
    });

    it('should return all pending parcel delivery orders', (done) => {
      chai.request(app)
        .get('/api/v1/parcels/pending')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(JSON.parse(res.text).pending.length).to.be.above(0);
          done();
        });
    });
  }); // end of GET /api/v1/parcels/pending

  describe('GET /api/v1/parcels/in-transit', () => {
    before(async () => {
      try {
        await db.query('UPDATE orders SET status=\'in transit\';');
      } catch (error) {
        console.log(error);
        exit();
      }
    });

    it('should return all parcels in transit', (done) => {
      chai.request(app)
        .get('/api/v1/parcels/in-transit')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(JSON.parse(res.text).inTransit.length).to.be.above(0);
          done();
        });
    });
  }); // end of GET /api/v1/parcels/in-transit

  describe('GET /api/v1/parcels/delivered', () => {
    before(async () => {
      try {
        await db.query('UPDATE orders SET status=\'delivered\';');
      } catch (error) {
        console.log(error);
        exit();
      }
    });

    it('should return all delivered parcels', (done) => {
      chai.request(app)
        .get('/api/v1/parcels/delivered')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(JSON.parse(res.text).delivered.length).to.be.above(0);
          done();
        });
    });
  }); // end of GET /api/v1/parcels/delivered

  describe('GET /api/v1/parcels/:pId', () => {
    it('should return details of a specific parcel delivery order with id: 1', (done) => {
      chai.request(app)
        .get('/api/v1/parcels/1')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(Object.keys(JSON.parse(res.text).order).length).to.be.above(0);
          done();
        });
    });

    it('should display \'Sorry, there is no parcel delivery order with this id: 0000\'', (done) => {
      chai.request(app)
        .get('/api/v1/parcels/0000')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(JSON.parse(res.text).error).to.be.equal('Sorry, there is no parcel delivery order with this id: 0000');
          done();
        });
    });
  }); // end of GET /api/v1/parcels/:pId

  describe('PUT /api/v1/parcels/:pId/destination', () => {
    // test 1
    it('should change the destination of a specific parcel delivery order with the id: 1', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/users/signin')
        .send({
          uname: 'rwajon',
          password: '12345',
        })
        .then(res => {
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.put('/api/v1/parcels/1/destination')
            .send({
              new_country: 'Uganda',
              new_city: 'Kampala',
              new_address: 'Downtown',
            })
            .then(res => {
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
    it('should change the destination of a specific parcel delivery order with the id: 1', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/users/signin')
        .send({
          uname: 'rwajon',
          password: '12345',
        })
        .then(res => {
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.put('/api/v1/parcels/1/destination')
            .send({
              new_country: '',
              new_city: 'Kampala',
              new_address: 'Downtown',
            })
            .then(res => {
              expect(res.status).to.equal(200);
              expect(Object.keys(JSON.parse(res.text).changed).length).to.be.above(0);
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

      agent.post('/api/v1/users/signin')
        .send({
          uname: 'rwajon',
          password: '12345',
        })
        .then(res => {
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.put('/api/v1/parcels/1/destination')
            .send({
              new_country: 'Uganda',
              new_city: '',
              new_address: 'Downtown',
            })
            .then(res => {
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

      agent.post('/api/v1/users/signin')
        .send({
          uname: 'rwajon',
          password: '12345',
        })
        .then(res => {
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.put('/api/v1/parcels/1/destination')
            .send({
              new_country: 'Uganda',
              new_city: 'Kampala',
              new_address: '',
            })
            .then(res => {
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
    it('should display \'Sorry, this order was not changed\'', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/users/signin')
        .send({
          uname: 'rwajon',
          password: '12345',
        })
        .then(res => {
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.put('/api/v1/parcels/1/destination')
            .send({
              new_country: '',
              new_city: '',
              new_address: '',
            })
            .then(res => {
              expect(res.status).to.equal(200);
              expect(JSON.parse(res.text).error).to.be.equal('Sorry, this order was not changed');
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });

    // test 6
    it('should display \'Sorry, you can not change this order\'', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/users/signin')
        .send({
          uname: 'rwajon',
          password: '12345',
        })
        .then(res => {
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.put('/api/v1/parcels/111/destination')
            .send({
              new_country: 'Uganda',
              new_city: 'Kampala',
              new_address: 'Downtown',
            })
            .then(res => {
              expect(res.status).to.equal(200);
              expect(JSON.parse(res.text).error).to.be.equal('Sorry, you can not change this order');
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });

    // test 7
    it('should display \'Sorry, you can not change this order\'', (done) => {
      chai.request(app)
        .put('/api/v1/parcels/1/destination')
        .send({
          new_country: 'Rwanda',
          new_city: 'Gisenyi',
          new_address: 'Mbugangari',
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(JSON.parse(res.text).error).to.be.equal('Sorry, you can not change this order');
          done();
        });
    });
  }); // end of PUT /api/v1/parcels/:pId/destination

  describe('PUT /api/v1/parcels/:pId/status', () => {
    // test 1
    it('should change the status of a specific parcel delivery order with the id: 1', (done) => {
      chai.request(app)
        .put('/api/v1/parcels/1/status')
        .send({
          new_status: 'delivered',
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(Object.keys(JSON.parse(res.text).changed).length).to.be.above(0);
          done();
        });
    });

    // test 2
    it('should display \'Sorry, this order was not changed\'', (done) => {
      chai.request(app)
        .put('/api/v1/parcels/1/status')
        .send({
          new_status: '',
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(JSON.parse(res.text).error).to.be.equal('Sorry, this order was not changed');
          done();
        });
    });

    // test 3
    it('should display \'Sorry, no order with id 111 was found\'', (done) => {
      chai.request(app)
        .put('/api/v1/parcels/111/status')
        .send({
          new_status: 'delivered',
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(JSON.parse(res.text).error).to.be.equal('Sorry, no order with id 111 was found');
          done();
        });
    });
  }); // end of PUT /api/v1/parcels/:pId/status

  describe('PUT /api/v1/parcels/:pId/presentLocation', () => {
    // test 1
    it('should change the present location of a specific parcel delivery order with the id: 1', (done) => {
      chai.request(app)
        .put('/api/v1/parcels/1/presentLocation')
        .send({
          new_country: 'Rwanda',
          new_city: 'Gisenyi',
          new_address: 'Mbugangari',
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(Object.keys(JSON.parse(res.text).changed).length).to.be.above(0);
          done();
        });
    });

    // test 2
    it('should display \'Sorry, this order was not changed\'', (done) => {
      chai.request(app)
        .put('/api/v1/parcels/1/presentLocation')
        .send({
          new_country: '',
          new_city: '',
          new_address: '',
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(JSON.parse(res.text).error).to.be.equal('Sorry, this order was not changed');
          done();
        });
    });

    // test 3
    it('should display \'Sorry, no order with id 111 was found\'', (done) => {
      chai.request(app)
        .put('/api/v1/parcels/111/presentLocation')
        .send({
          new_country: 'Rwanda',
          new_city: 'Gisenyi',
          new_address: 'Mbugangari',
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(JSON.parse(res.text).error).to.be.equal('Sorry, no order with id 111 was found');
          done();
        });
    });
  }); // end of PUT /api/v1/parcels/:pId/presentLocation

  describe('PUT /api/v1/parcels/:pId/cancel', () => {
    // test1
    it('should cancel a specific parcel delivery order with the id: 1', (done) => {
      const agent = chai.request.agent(app);

      agent.post('/api/v1/users/signin')
        .send({
          uname: 'rwajon',
          password: '12345',
        })
        .then(res => {
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.put('/api/v1/parcels/1/cancel')
            .send({
              new_status: 'cancelled',
            })
            .then(res => {
              expect(res.status).to.equal(200);
              expect(Object.keys(JSON.parse(res.text).cancelled).length).to.be.above(0);
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

      agent.post('/api/v1/users/signin')
        .send({
          uname: 'rwajon',
          password: '12345',
        })
        .then(res => {
          expect(res.status).to.equal(202);
          expect(Object.keys(JSON.parse(res.text).user).length).to.be.above(0);

          return agent.put('/api/v1/parcels/111/cancel')
            .send({
              new_status: 'cancelled',
            })
            .then(res => {
              expect(res.status).to.equal(200);
              expect(JSON.parse(res.text).error).to.be.equal('Sorry, you can not cancel this order');
            })
            .then(() => {
              done();
              agent.close();
            });
        });
    });

    // test 3
    it('should display \'Sorry, you can not cancel this order\'', (done) => {
      chai.request(app)
        .put('/api/v1/parcels/1/cancel')
        .send({
          new_status: 'cancelled',
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(JSON.parse(res.text).error).to.be.equal('Sorry, you can not cancel this order');
          done();
        });
    });
  }); // end of PUT /api/v1/parcels/:pId/cancel


  /******************Clear all records in table orders********************/

  describe('GET /api/v1/parcels', () => {
    it('should display \'Sorry, there are no parcel delivery orders\'', (done) => {
      db.query('TRUNCATE orders; ALTER SEQUENCE orders_id_seq RESTART WITH 1;');
      chai.request(app)
        .get('/api/v1/parcels')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(JSON.parse(res.text).error).to.be.equal('Sorry, there are no parcel delivery orders');
          done();
        });
    });
  }); // end of GET /api/v1/parcels

  describe('GET /api/v1/parcels/pending', () => {
    it('should display \'Sorry, there are no pending parcel delivery orders\'', (done) => {
      db.query('TRUNCATE orders; ALTER SEQUENCE orders_id_seq RESTART WITH 1;');
      chai.request(app)
        .get('/api/v1/parcels/pending')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(JSON.parse(res.text).error).to.be.equal('Sorry, there are no pending parcel delivery orders');
          done();
        });
    });
  }); // end of GET /api/v1/parcels/pending

  describe('GET /api/v1/parcels/in-transit', () => {
    it('should display \'Sorry, there are no parcels in transit\'', (done) => {
      db.query('TRUNCATE orders; ALTER SEQUENCE orders_id_seq RESTART WITH 1;');
      chai.request(app)
        .get('/api/v1/parcels/in-transit')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(JSON.parse(res.text).error).to.be.equal('Sorry, there are no parcels in transit');
          done();
        });
    });
  }); // end of GET /api/v1/parcels/in-transit

  describe('GET /api/v1/parcels/delivered', () => {
    it('should display \'Sorry, there are no delivered parcels\'', (done) => {
      db.query('TRUNCATE orders; ALTER SEQUENCE orders_id_seq RESTART WITH 1;');
      chai.request(app)
        .get('/api/v1/parcels/delivered')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(JSON.parse(res.text).error).to.be.equal('Sorry, there are no delivered parcels');
          done();
        });
    });
  }); // end of GET /api/v1/parcels/delivered
});