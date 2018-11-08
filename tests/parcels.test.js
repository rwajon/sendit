import fs from 'fs';
import chai from 'chai';
import Parcel from '../private/Parcel';

const { expect } = chai;
const parcels = JSON.parse(fs.readFileSync('private/parcels.json'));

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

      expect(parcel.getDetails(pId)).to.equal('Sorry, there is no parcel delivery order with this id : 12345');
    });

    // test 3
    it('should display \'Please, provide a parcel delivery order id to check!\'', () => {
      const parcel = new Parcel(parcels);

      expect(parcel.getDetails()).to.equal('Please, provide a parcel delivery order id to check!');
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

      expect(parcel.getAll()).to.equal('Sorry, there are no parcel delivery orders');
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

      expect(parcel.getAll(userId)).to.equal('Sorry, you don\'t have any parcel delivery order');
    });
  }); // end of getAll method tests


  /** ****get all new created parcel delivery orders***** */
  describe('getNewCreated method', () => {
    // test 1
    it('should return all new created parcel delivery orders', () => {
      const parcel = new Parcel(parcels);

      expect(parcel.getNewCreated() instanceof Object).to.be.true;
    });

    // test 2
    it('should display \'Sorry, there are no new created parcel delivery orders\'', () => {
      const parcel = new Parcel();

      expect(parcel.getNewCreated()).to.equal('Sorry, there are no new created parcel delivery orders');
    });

    // test 3
    it('should return all new created parcel delivery orders by a specific user', () => {
      const userId = '001';
      const parcel = new Parcel(parcels);

      expect(parcel.getNewCreated(userId) instanceof Object).to.be.true;
    });

    // test 3
    it('should display \'Sorry, you don\'t have new created parcel delivery orders\'', () => {
      const userId = '001';
      const parcel = new Parcel();

      expect(parcel.getNewCreated(userId)).to.equal('Sorry, you don\'t have new created parcel delivery orders');
    });
  }); // end of getNewCreated method tests


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

      expect(parcel.getInTransit()).to.equal('Sorry, there are no parcels in transit');
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

      expect(parcel.getInTransit(userId)).to.equal('Sorry, you don\'t have parcels in transit');
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

      expect(parcel.getDelivered()).to.equal('Sorry, no parcel has been delivered');
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

      expect(parcel.getDelivered(userId)).to.equal('Sorry, you don\'t have delivered parcels');
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
        new_address: '',
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
        new_address: '',
      };

      expect(parcel.changeOrder(pId, form)).to.equal('Sorry, this order was not successfully changed');
    });

    // test 3
    it('should return the changed order by a specific user', () => {
      const parcel = new Parcel(parcels);
      const pId = '001';
      const userId = '001';
      const form = {
        new_country: 'Uganda',
        new_city: 'Kampala',
        new_address: '',
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
        new_address: '',
      };

      expect(parcel.changeOrder(pId, form, userId)).to.equal('Sorry, this order was not successfully changed');
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

      expect(parcel.createOrder(form, user)).to.equal('Please enter the required information to create an order!');
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

      expect(parcel.createOrder(form, user)).to.equal('Please, sign-in to create an order!');
    });
  }); // end of createOrder method tests


  describe('cancelOrder method', () => {
    // test 1
    it('should return true if the order was successfully cancelled', () => {
      const parcel = new Parcel(parcels);
      const pId = '001';
      const userId = '001';

      expect(parcel.cancelOrder(pId, userId)).to.be.true;
    });

    // test 2
    it('should display \'Please, provide the id of the order to cancel!\'', () => {
      const parcel = new Parcel(parcels);
      const pId = '';
      const userId = '001';

      expect(parcel.cancelOrder(pId, userId)).to.equal('Please, provide the id of the order to cancel!');
    });

    // test 3
    it('should display \'Sorry, you can only cancel order that you created\'', () => {
      const parcel = new Parcel(parcels);
      const pId = '005';
      const userId = '001';

      expect(parcel.cancelOrder(pId, userId)).to.equal('Sorry, you can only cancel order that you created');
    });

    // test 3
    it('should display \'Sorry, you can not cancel this order\'', () => {
      const parcel = new Parcel(parcels);
      const pId = '001';
      const userId = '';

      expect(parcel.cancelOrder(pId, userId)).to.equal('Sorry, you can not cancel this order');
    });
  }); // end of cancelOrder method
});
