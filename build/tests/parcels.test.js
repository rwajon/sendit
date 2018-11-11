'use strict';

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _chai = require('chai');

var _chai2 = _interopRequireDefault(_chai);

var _Parcel = require('../private/Parcel');

var _Parcel2 = _interopRequireDefault(_Parcel);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var expect = _chai2.default.expect;

var parcels = JSON.parse(_fs2.default.readFileSync('private/parcels.json'));

describe('Parcel class', function () {
  /** ****get a specific parcel delivery order details***** */
  describe('getDetails method', function () {
    // test 1
    it('should return details of a specific parcel delivery order based on the given id', function () {
      var pId = '001';
      var parcel = new _Parcel2.default(parcels);

      expect(parcel.getDetails(pId) instanceof Object).to.be.true;
    });

    // test 2
    it('should display \'Sorry, there is no parcel delivery order with this id : 12345\'', function () {
      var pId = '12345';
      var parcel = new _Parcel2.default(parcels);

      parcel.getDetails(pId);

      expect(parcel.error).to.equal('Sorry, there is no parcel delivery order with this id : 12345');
    });

    // test 3
    it('should display \'Please, provide a parcel delivery order id to check!\'', function () {
      var parcel = new _Parcel2.default(parcels);

      parcel.getDetails();

      expect(parcel.error).to.equal('Please, provide a parcel delivery order id to check!');
    });
  }); // end of getDetails method tests


  /** ****get all parcel delivery orders***** */
  describe('getAll method', function () {
    // test 1
    it('should return all parcel delivery orders', function () {
      var parcel = new _Parcel2.default(parcels);

      expect(parcel.getAll() instanceof Object).to.be.true;
    });

    // test 2
    it('should display \'Sorry, there are no parcel delivery orders\'', function () {
      var parcel = new _Parcel2.default();

      parcel.getAll();

      expect(parcel.error).to.equal('Sorry, there are no parcel delivery orders');
    });

    // test 3
    it('should return all parcel delivery orders of a specific user', function () {
      var userId = '001';
      var parcel = new _Parcel2.default(parcels);

      expect(parcel.getAll(userId) instanceof Object).to.be.true;
    });

    // test 4
    it('should display \'Sorry, you don\'t have any parcel delivery order\'', function () {
      var userId = '001';
      var parcel = new _Parcel2.default();

      parcel.getAll(userId);

      expect(parcel.error).to.equal('Sorry, you don\'t have any parcel delivery order');
    });
  }); // end of getAll method tests


  /** ****get all pending parcel delivery orders***** */
  describe('getPending method', function () {
    // test 1
    it('should return all pending parcel delivery orders', function () {
      var parcel = new _Parcel2.default(parcels);

      expect(parcel.getPending() instanceof Object).to.be.true;
    });

    // test 2
    it('should display \'Sorry, there are no pending parcel delivery orders\'', function () {
      var parcel = new _Parcel2.default();

      parcel.getPending();

      expect(parcel.error).to.equal('Sorry, there are no pending parcel delivery orders');
    });

    // test 3
    it('should return all pending parcel delivery orders by a specific user', function () {
      var userId = '001';
      var parcel = new _Parcel2.default(parcels);

      expect(parcel.getPending(userId) instanceof Object).to.be.true;
    });

    // test 3
    it('should display \'Sorry, you don\'t have pending parcel delivery orders\'', function () {
      var userId = '001';
      var parcel = new _Parcel2.default();

      parcel.getPending(userId);

      expect(parcel.error).to.equal('Sorry, you don\'t have pending parcel delivery orders');
    });
  }); // end of getPending method tests


  /** ****get all parcel delivery orders that are yet to be delivered (in transit)***** */
  describe('getInTransit method', function () {
    // test 1
    it('should return all parcel delivery order that are yet to be delivered', function () {
      var parcel = new _Parcel2.default(parcels);

      expect(parcel.getInTransit() instanceof Object).to.be.true;
    });

    // test 2
    it('should display \'Sorry, there are no parcels in transit\'', function () {
      var parcel = new _Parcel2.default();

      parcel.getInTransit();

      expect(parcel.error).to.equal('Sorry, there are no parcels in transit');
    });

    // test 3
    it('should return all parcel delivery order that are yet to be delivered of a specific user', function () {
      var userId = '001';
      var parcel = new _Parcel2.default(parcels);

      expect(parcel.getInTransit(userId) instanceof Object).to.be.true;
    });

    // test 3
    it('should display \'Sorry, you don\'t have parcels in transit\'', function () {
      var userId = '001';
      var parcel = new _Parcel2.default();

      parcel.getInTransit(userId);

      expect(parcel.error).to.equal('Sorry, you don\'t have parcels in transit');
    });
  }); // end of getInTransit method tests


  /** ****get all parcel delivery orders that are already delivered***** */
  describe('getDelivered method', function () {
    // test 1
    it('should return all parcel delivery order that are already delivered', function () {
      var parcel = new _Parcel2.default(parcels);

      expect(parcel.getDelivered() instanceof Object).to.be.true;
    });

    // test 2
    it('should display \'Sorry, no parcel has been delivered\'', function () {
      var parcel = new _Parcel2.default();

      parcel.getDelivered();

      expect(parcel.error).to.equal('Sorry, no parcel has been delivered');
    });

    // test 3
    it('should return all parcel delivery orders that are already delivered of a specific user', function () {
      var userId = '001';
      var parcel = new _Parcel2.default(parcels);

      expect(parcel.getDelivered(userId) instanceof Object).to.be.true;
    });

    // test 3
    it('should display \'Sorry, you don\'t have delivered parcels\'', function () {
      var userId = '001';
      var parcel = new _Parcel2.default();

      parcel.getDelivered(userId);

      expect(parcel.error).to.equal('Sorry, you don\'t have delivered parcels');
    });
  }); // end of getDelivered method tests


  describe('changeOrder method', function () {
    // test 1
    it('should return the changed order', function () {
      var parcel = new _Parcel2.default(parcels);
      var pId = '001';
      var form = {
        new_status: 'Delivered',
        new_country: 'Uganda',
        new_city: 'Kampala',
        new_address: 'Downtown'
      };

      expect(parcel.changeOrder(pId, form) instanceof Object).to.be.true;
    });

    // test 2
    it('should display \'Sorry, this order was not successfully changed\'', function () {
      var parcel = new _Parcel2.default(parcels);
      var pId = '0000';
      var form = {
        new_status: 'Delivered',
        new_country: 'Uganda',
        new_city: 'Kampala',
        new_address: 'Downtown'
      };

      parcel.changeOrder(pId, form);

      expect(parcel.error).to.equal('Sorry, this order was not successfully changed');
    });

    // test 3
    it('should return the changed order by a specific user', function () {
      var parcel = new _Parcel2.default(parcels);
      var pId = '001';
      var userId = '001';
      var form = {
        new_country: 'Uganda',
        new_city: 'Kampala',
        new_address: 'Downtown'
      };

      expect(parcel.changeOrder(pId, form, userId) instanceof Object).to.be.true;
    });

    // test 4
    it('should display \'Sorry, this order was not successfully changed\'', function () {
      var parcel = new _Parcel2.default(parcels);
      var pId = '0000';
      var userId = '001';
      var form = {
        new_country: 'Uganda',
        new_city: 'Kampala',
        new_address: 'Downtown'
      };

      parcel.changeOrder(pId, form, userId);

      expect(parcel.error).to.equal('Sorry, this order was not successfully changed');
    });
  }); // end of changeOrder method tests

  describe('createOrder method', function () {
    // test 1
    it('should return the created parcel delivery order', function () {
      var parcel = new _Parcel2.default(parcels);

      var user = {
        id: '001',
        fname: 'Jonathan',
        lname: 'Rwabahizi',
        uname: 'rwajon',
        password: '12345',
        phone: '+250781146646',
        email: 'jonathanrwabahizi@gmail.com',
        country: 'Rwanda',
        city: 'Gisenyi',
        address: 'Mbugangari'
      };

      var form = {
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
        dest_address: 'Near Central Park'
      };

      expect(parcel.createOrder(form, user) instanceof Object).to.be.true;
    });

    // test 2
    it('should display \'Please enter the required information to create an order!\'', function () {
      var parcel = new _Parcel2.default(parcels);

      var user = {
        id: '001',
        fname: 'Jonathan',
        lname: 'Rwabahizi',
        uname: 'rwajon',
        password: '12345',
        phone: '+250781146646',
        email: 'jonathanrwabahizi@gmail.com',
        country: 'Rwanda',
        city: 'Gisenyi',
        address: 'Mbugangari'
      };

      var form = {
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
        dest_address: 'Near Central Park'
      };

      parcel.createOrder(form, user);

      expect(parcel.error).to.equal('Please enter the required information to create an order!');
    });

    // test 3
    it('should display \'Please, sign-in to create an order!\'', function () {
      var parcel = new _Parcel2.default(parcels);

      var user = {};

      var form = {
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
        dest_address: 'Near Central Park'
      };

      parcel.createOrder(form, user);

      expect(parcel.error).to.equal('Please, sign-in to create an order!');
    });
  }); // end of createOrder method tests


  describe('cancelOrder method', function () {
    // test 1
    it('should return true if the order was successfully cancelled', function () {
      var parcel = new _Parcel2.default(parcels);
      var pId = '001';
      var userId = '001';

      expect(parcel.cancelOrder(pId, userId)).to.be.true;
    });

    // test 2
    it('should display \'Please, provide the id of the order to cancel!\'', function () {
      var parcel = new _Parcel2.default(parcels);
      var pId = '';
      var userId = '001';

      parcel.cancelOrder(pId, userId);

      expect(parcel.error).to.equal('Please, provide the id of the order to cancel!');
    });

    // test 3
    it('should display \'Sorry, you can only cancel order that you created\'', function () {
      var parcel = new _Parcel2.default(parcels);
      var pId = '005';
      var userId = '001';

      parcel.cancelOrder(pId, userId);

      expect(parcel.error).to.equal('Sorry, you can only cancel order that you created');
    });

    // test 3
    it('should display \'Sorry, you can not cancel this order\'', function () {
      var parcel = new _Parcel2.default(parcels);
      var pId = '001';
      var userId = '';

      parcel.cancelOrder(pId, userId);

      expect(parcel.error).to.equal('Sorry, you can not cancel this order');
    });
  }); // end of cancelOrder method
});