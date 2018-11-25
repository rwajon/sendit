import fs from 'fs';
import chai from 'chai';
import chaiHttp from 'chai-http';
import db from '../models/index';
import app from '../app';

const { assert } = chai;
const { expect } = chai;
const parcels = JSON.parse(fs.readFileSync('src/models/parcels.json'));

chai.use(chaiHttp);

// clear orders table
try {
  db.query('TRUNCATE orders; ALTER SEQUENCE orders_id_seq RESTART WITH 1;');
} catch (error) {
  console.log(error);
  exit();
}

describe('Parcel', () => {
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
    it('should return all parcels in transit', (done) => {
      chai.request(app)
        .get('/api/v1/parcels/in-transit')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(Object.keys(JSON.parse(res.text).inTransit).length).to.be.above(0);
          done();
        });
    });
  }); // end of GET /api/v1/parcels/in-transit

  describe('GET /api/v1/parcels/delivered', () => {
    it('should return all delivered parcels', (done) => {
      chai.request(app)
        .get('/api/v1/parcels/delivered')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(Object.keys(JSON.parse(res.text).delivered).length).to.be.above(0);
          done();
        });
    });
  }); // end of GET /api/v1/parcels/delivered

  describe('GET /api/v1/parcels/:pId', () => {
    it('should return details of a specific parcel delivery order with the id: 002', (done) => {
      chai.request(app)
        .get('/api/v1/parcels/002')
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

  describe('PUT /api/v1/parcels/:pId/change', () => {
    // test 1
    it('should change the status and present location of a specific parcel delivery order with the id: 001', (done) => {
      chai.request(app)
        .put('/api/v1/parcels/001/change')
        .send({
          new_status: 'In transit',
          new_country: 'Uganda',
          new_city: 'Kampala',
          new_address: 'Downtown',
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
        .put('/api/v1/parcels/001/change')
        .send({
          new_status: '',
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
  }); // end of PUT /api/v1/parcels/:pId/change

  describe('PUT /api/v1/parcels/:pId/cancel', () => {
    // test 1
    it('cancel a specific parcel delivery order with the id: 003', (done) => {
      chai.request(app)
        .put('/api/v1/parcels/003/cancel')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(JSON.parse(res.text).cancelled.status).to.be.equal('Cancelled');
          done();
        });
    });

    // test 2
    it('should display \'Sorry, this order was not cancelled\'', (done) => {
      chai.request(app)
        .put('/api/v1/parcels/0033/cancel')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(JSON.parse(res.text).error).to.be.equal('Sorry, this order was not cancelled');
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
});