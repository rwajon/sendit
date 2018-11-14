import fs from 'fs';
import chai from 'chai';
import chaiHttp from 'chai-http';
import app from 'src/app';

const { assert } = chai;
const { expect } = chai;
const parcels = JSON.parse(fs.readFileSync('JSONFiles/parcels.json'));

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

  describe('GET /api/v1/parcels/:pId/change', () => {
    it('should return the current info of the order to change', (done) => {
      chai.request(app)
        .get('/api/v1/parcels/002/change')
        .end((err, res) => {
          expect(res.status).to.equal(200);
          expect(Object.keys(JSON.parse(res.text).parcelDetails).length).to.be.above(0);
          done();
        });
    });
  }); // end of GET /api/v1/parcels/:pId/change

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
});
