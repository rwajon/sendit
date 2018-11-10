import fs from 'fs';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../app';
import Parcel from '../private/Parcel';

const { assert } = chai;
const { expect } = chai;
const parcels = JSON.parse(fs.readFileSync('private/parcels.json'));

chai.use(chaiHttp);

describe('Parcel', () => {
  describe('GET /api/v1/parcels', () => {
    it('should return all parcel delivery orders', (done) => {
      chai.request(app)
        .get('/api/v1/parcels')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(Object.keys(JSON.parse(res.text).allParcels).length).to.be.above(0);
          done();
        });
    });
  }); // end of GET /api/v1/parcels

  describe('GET /api/v1/parcels/:pId', () => {
    it('should return details of a specific parcel delivery order with the id: 002', (done) => {
      chai.request(app)
        .get('/api/v1/parcels/002')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(Object.keys(JSON.parse(res.text).parcelDetails).length).to.be.above(0);
          done();
        });
    });
  }); // end of GET /api/v1/parcels/:pId

  describe('GET /api/v1/parcels/pending', () => {
    it('should return all pending parcel delivery orders', (done) => {
      chai.request(app)
        .get('/api/v1/parcels/pending')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(Object.keys(JSON.parse(res.text).pending).length).to.be.above(0);
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

  describe('POST /api/v1/parcels/:pId/change', () => {
    it('change the status and present location of a specific parcel delivery order with the id: 002', (done) => {
      chai.request(app)
        .post('/api/v1/parcels/002/change')
        .send({
          new_status: 'In transit',
          new_country: 'Uganda',
          new_city: 'Kampala',
          new_address: '',
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(Object.keys(JSON.parse(res.text).changed).length).to.be.above(0);
          done();
        });
    });
  }); // end of POST /api/v1/parcels/:pId/change

  describe('GET /api/v1/users/:id/parcels', () => {
    it('should return all parcel delivery orders of the user 001', (done) => {
      chai.request(app)
        .get('/api/v1/users/001/parcels')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(Object.keys(JSON.parse(res.text).allParcels).length).to.be.above(0);
          done();
        });
    });
  }); // end of GET /api/v1/users/:id/parcels

  describe('GET /api/v1/users/:id/parcels/:pId', () => {
    it('should return details of a specific parcel delivery order with the id: 002 of the user 001', (done) => {
      chai.request(app)
        .get('/api/v1/users/001/parcels/002')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(Object.keys(JSON.parse(res.text).parcelDetails).length).to.be.above(0);
          done();
        });
    });
  }); // end of GET /api/v1/users/:id/parcels/:pId

  describe('GET /api/v1/users/:id/parcels/pending', () => {
    it('should return all pending parcel delivery orders of the user 001', (done) => {
      chai.request(app)
        .get('/api/v1/users/001/parcels/pending')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(Object.keys(JSON.parse(res.text).pending).length).to.be.above(0);
          done();
        });
    });
  }); // end of GET /api/v1/users/:id/parcels/pending

  describe('GET /api/v1/users/:id/parcels/in-transit', () => {
    it('should return all parcels in transit of the user 001', (done) => {
      chai.request(app)
        .get('/api/v1/users/001/parcels/in-transit')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(Object.keys(JSON.parse(res.text).inTransit).length).to.be.above(0);
          done();
        });
    });
  }); // end of GET /api/v1/users/:id/parcels/in-transit

  describe('GET /api/v1/users/:id/parcels/delivered', () => {
    it('should return all delivered parcels of the user 001', (done) => {
      chai.request(app)
        .get('/api/v1/users/001/parcels/delivered')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(Object.keys(JSON.parse(res.text).delivered).length).to.be.above(0);
          done();
        });
    });
  }); // end of GET /api/v1/users/:id/parcels/delivered

  describe('POST /api/v1/users/:id/parcels/:pId/change', () => {
    it('change the destination of a specific parcel delivery order with the id: 002 of the user 001', (done) => {
      chai.request(app)
        .post('/api/v1/users/001/parcels/002/change')
        .send({
          new_country: 'England',
          new_city: 'London',
          new_address: 'Downtown',
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(Object.keys(JSON.parse(res.text).changed).length).to.be.above(0);
          done();
        });
    });
  }); // end of POST /api/v1/users/:id/parcels/:pId/change

  describe('GET /api/v1/users/:id/parcels/:pId/cancel', () => {
    it('cancel a specific parcel delivery order with the id: 003', (done) => {
      chai.request(app)
        .get('/api/v1/users/001/parcels/003/cancel')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(Object.keys(JSON.parse(res.text).cancel).length).to.be.above(0);
          done();
        });
    });
  }); // end of GET /api/v1/users/:id/parcels/:pId/cancel

  describe('POST /api/v1/users/:id/parcels/create', () => {
    it('create a parcel delivery order', (done) => {
      chai.request(app)
        .post('/api/v1/users/001/parcels/create')
        .send({
          rname: 'John Smith',
          rphone: '+123456789',
          remail: 'johnsmith@gmail.com',
          product: 'Sandals',
          weight: '1.5 Kg',
          quantity: '2',
          sender_country: 'Rwanda',
          sender_city: 'Gisenyi',
          sender_address: 'Mbugangari',
          dest_country: 'USA',
          dest_city: 'Ney-York',
          dest_address: 'Near Central Park',
        })
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(Object.keys(JSON.parse(res.text).createdOrder).length).to.be.above(0);
          done();
        });
    });
  }); // end of POST /api/v1/users/:id/parcels/create
});
