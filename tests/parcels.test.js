import fs from 'fs';
import chai from 'chai';
import Parcel from '../src/controllers/Parcel';

const { expect } = chai;
const parcels = JSON.parse(fs.readFileSync('src/models/parcels.json'));

describe('Parcel class', () => {
  /** ****get a specific parcel delivery order details***** */
  describe('getDetails method', () => {
    // test 1
    it('should return details of a specific parcel delivery order based on the given id', () => {
      const pId = '001';
      const parcel = new Parcel(parcels);

      expect(parcel.getDetails(pId) instanceof Object).to.be.true;
    });

    // test 2
    it('should display \'Sorry, there is no parcel delivery order with this id : 12345\'', () => {
      const pId = '12345';
      const parcel = new Parcel(parcels);

      parcel.getDetails(pId);

      expect(parcel.error).to.equal('Sorry, there is no parcel delivery order with this id : 12345');
    });

    // test 3
    it('should display \'Please, provide a parcel delivery order id to check!\'', () => {
      const parcel = new Parcel(parcels);

      parcel.getDetails();

      expect(parcel.error).to.equal('Please, provide a parcel delivery order id to check!');
    });
  }); // end of getDetails method tests


  /** ****get all parcel delivery orders***** */
  describe('getAll method', () => {
    // test 1
    it('should return all parcel delivery orders', () => {
      const parcel = new Parcel(parcels);

      expect(parcel.getAll() instanceof Object).to.be.true;
    });

    // test 2
    it('should display \'Sorry, there are no parcel delivery orders\'', () => {
      const parcel = new Parcel();

      parcel.getAll();

      expect(parcel.error).to.equal('Sorry, there are no parcel delivery orders');
    });

    // test 3
    it('should return all parcel delivery orders of a specific user', () => {
      const userId = '001';
      const parcel = new Parcel(parcels);

      expect(parcel.getAll(userId) instanceof Object).to.be.true;
    });

    // test 4
    it('should display \'Sorry, you don\'t have any parcel delivery order\'', () => {
      const userId = '001';
      const parcel = new Parcel();

      parcel.getAll(userId);

      expect(parcel.error).to.equal('Sorry, you don\'t have any parcel delivery order');
    });
  }); // end of getAll method tests


  /** ****get all pending parcel delivery orders***** */
  describe('getPending method', () => {
    // test 1
    it('should return all pending parcel delivery orders', () => {
      const parcel = new Parcel(parcels);

      expect(parcel.getPending() instanceof Object).to.be.true;
    });

    // test 2
    it('should display \'Sorry, there are no pending parcel delivery orders\'', () => {
      const parcel = new Parcel();

      parcel.getPending();

      expect(parcel.error).to.equal('Sorry, there are no pending parcel delivery orders');
    });

    // test 3
    it('should return all pending parcel delivery orders by a specific user', () => {
      const userId = '001';
      const parcel = new Parcel(parcels);

      expect(parcel.getPending(userId) instanceof Object).to.be.true;
    });

    // test 3
    it('should display \'Sorry, you don\'t have pending parcel delivery orders\'', () => {
      const userId = '001';
      const parcel = new Parcel();

      parcel.getPending(userId);

      expect(parcel.error).to.equal('Sorry, you don\'t have pending parcel delivery orders');
    });
  }); // end of getPending method tests


  /** ****get all parcel delivery orders that are yet to be delivered (in transit)***** */
  describe('getInTransit method', () => {
    // test 1
    it('should return all parcel delivery order that are yet to be delivered', () => {
      const parcel = new Parcel(parcels);

      expect(parcel.getInTransit() instanceof Object).to.be.true;
    });

    // test 2
    it('should display \'Sorry, there are no parcels in transit\'', () => {
      const parcel = new Parcel();

      parcel.getInTransit();

      expect(parcel.error).to.equal('Sorry, there are no parcels in transit');
    });

    // test 3
    it('should return all parcel delivery order that are yet to be delivered of a specific user', () => {
      const userId = '001';
      const parcel = new Parcel(parcels);

      expect(parcel.getInTransit(userId) instanceof Object).to.be.true;
    });

    // test 3
    it('should display \'Sorry, you don\'t have parcels in transit\'', () => {
      const userId = '001';
      const parcel = new Parcel();

      parcel.getInTransit(userId);

      expect(parcel.error).to.equal('Sorry, you don\'t have parcels in transit');
    });
  }); // end of getInTransit method tests


  /** ****get all parcel delivery orders that are already delivered***** */
  describe('getDelivered method', () => {
    // test 1
    it('should return all parcel delivery order that are already delivered', () => {
      const parcel = new Parcel(parcels);

      expect(parcel.getDelivered() instanceof Object).to.be.true;
    });

    // test 2
    it('should display \'Sorry, no parcel has been delivered\'', () => {
      const parcel = new Parcel();

      parcel.getDelivered();

      expect(parcel.error).to.equal('Sorry, no parcel has been delivered');
    });

    // test 3
    it('should return all parcel delivery orders that are already delivered of a specific user', () => {
      const userId = '001';
      const parcel = new Parcel(parcels);

      expect(parcel.getDelivered(userId) instanceof Object).to.be.true;
    });

    // test 3
    it('should display \'Sorry, you don\'t have delivered parcels\'', () => {
      const userId = '001';
      const parcel = new Parcel();

      parcel.getDelivered(userId);

      expect(parcel.error).to.equal('Sorry, you don\'t have delivered parcels');
    });
  }); // end of getDelivered method tests


  describe('changeOrder method', () => {
    // test 1
    it('should return the changed order', () => {
      const parcel = new Parcel(parcels);
      const pId = '001';
      const form = {
        new_status: 'Delivered',
        new_country: 'Uganda',
        new_city: 'Kampala',
        new_address: 'Downtown',
      };

      expect(parcel.changeOrder(pId, form) instanceof Object).to.be.true;
    });

    // test 2
    it('should display \'Sorry, this order was not successfully changed\'', () => {
      const parcel = new Parcel(parcels);
      const pId = '0000';
      const form = {
        new_status: 'Delivered',
        new_country: 'Uganda',
        new_city: 'Kampala',
        new_address: 'Downtown',
      };

      parcel.changeOrder(pId, form);

      expect(parcel.error).to.equal('Sorry, this order was not successfully changed');
    });

    // test 3
    it('should return the changed order by a specific user', () => {
      const parcel = new Parcel(parcels);
      const pId = '001';
      const userId = '001';
      const form = {
        new_country: 'Uganda',
        new_city: 'Kampala',
        new_address: 'Downtown',
      };

      expect(parcel.changeOrder(pId, form, userId) instanceof Object).to.be.true;
    });

    // test 4
    it('should display \'Sorry, this order was not successfully changed\'', () => {
      const parcel = new Parcel(parcels);
      const pId = '0000';
      const userId = '001';
      const form = {
        new_country: 'Uganda',
        new_city: 'Kampala',
        new_address: 'Downtown',
      };

      parcel.changeOrder(pId, form, userId);

      expect(parcel.error).to.equal('Sorry, this order was not successfully changed');
    });
  }); // end of changeOrder method tests

  describe('createOrder method', () => {
    // test 1
    it('should return the created parcel delivery order', () => {
      const parcel = new Parcel(parcels);

      const user = {
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
      };

      const form = {
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
      };

      expect(parcel.createOrder(form, user) instanceof Object).to.be.true;
    });

    // test 2
    it('should display \'Please enter the required information to create an order!\'', () => {
      const parcel = new Parcel(parcels);

      const user = {
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
      };

      const form = {
        rname: '',
        rphone: '',
        remail: 'johnsmith@gmail.com',
        product: '',
        weight: '1.5 Kg',
        quantity: '',
        sender_country: 'Rwanda',
        sender_city: 'Gisenyi',
        sender_address: 'Mbugangari',
        dest_country: '',
        dest_city: 'Ney-York',
        dest_address: 'Near Central Park',
      };

      parcel.createOrder(form, user);

      expect(parcel.error).to.equal('Please enter the required information to create an order!');
    });

    // test 3
    it('should display \'Please, sign-in to create an order!\'', () => {
      const parcel = new Parcel(parcels);

      const user = {};

      const form = {
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
      };

      parcel.createOrder(form, user);

      expect(parcel.error).to.equal('Please, sign-in to create an order!');
    });
  }); // end of createOrder method tests


  describe('cancelOrder method', () => {
    // test 1
    it('should display \'Cancelled\' if the order was successfully cancelled', () => {
      const parcel = new Parcel(parcels);
      const pId = '001';
      const userId = '001';

      expect(parcel.cancelOrder(pId, userId)).to.be.equal('Cancelled');
    });

    // test 2
    it('should display \'Please, provide the id of the order to cancel!\'', () => {
      const parcel = new Parcel(parcels);
      const pId = '';
      const userId = '001';

      parcel.cancelOrder(pId, userId);

      expect(parcel.error).to.equal('Please, provide the id of the order to cancel!');
    });

    // test 3
    it('should display \'Sorry, you can only cancel order that you created\'', () => {
      const parcel = new Parcel(parcels);
      const pId = '005';
      const userId = '001';

      parcel.cancelOrder(pId, userId);

      expect(parcel.error).to.equal('Sorry, you can only cancel order that you created');
    });

    // test 3
    it('should display \'Sorry, you can not cancel this order\'', () => {
      const parcel = new Parcel(parcels);
      const pId = '001';
      const userId = '';

      parcel.cancelOrder(pId, userId);

      expect(parcel.error).to.equal('Sorry, you can not cancel this order');
    });
  }); // end of cancelOrder method
});
