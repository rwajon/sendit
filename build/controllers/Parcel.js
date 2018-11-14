'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Parcel = function () {
  function Parcel(parcels) {
    _classCallCheck(this, Parcel);

    this.parcel = {};
    this.parcels = parcels || {};
    this.userParcels = {};
    this.newCreatedParcels = {};
    this.parcelsInTransit = {};
    this.parcelsDelivered = {};
    this.error = '';
  }

  _createClass(Parcel, [{
    key: 'getDetails',
    value: function getDetails(pId) {
      var _this = this;

      if (!pId) {
        this.error = 'Please, provide a parcel delivery order id to check!';
        return {};
      }

      Object.keys(this.parcels).forEach(function (key) {
        if (_this.parcels[key].orderId === pId) {
          _this.parcel = _this.parcels[key];
        }
      });

      if (Object.keys(this.parcel).length > 0) {
        return this.parcel;
      }

      this.error = 'Sorry, there is no parcel delivery order with this id : ' + pId;
      return {};
    } // end of get method

  }, {
    key: 'getAll',
    value: function getAll(userId) {
      var _this2 = this;

      if (userId) {
        Object.keys(this.parcels).forEach(function (key) {
          if (_this2.parcels[key].sender.id === userId) {
            _this2.userParcels[key] = _this2.parcels[key];
          }
        });

        if (Object.keys(this.userParcels).length > 0) {
          return this.userParcels;
        }

        this.error = 'Sorry, you don\'t have any parcel delivery order';
        return {};
      }

      if (Object.keys(this.parcels).length > 0) {
        return this.parcels;
      }

      this.error = 'Sorry, there are no parcel delivery orders';
      return {};
    } // end fo getAll method

  }, {
    key: 'getPending',
    value: function getPending(userId) {
      var _this3 = this;

      if (userId) {
        Object.keys(this.parcels).forEach(function (key) {
          if (_this3.parcels[key].status === 'Pending' && _this3.parcels[key].sender.id === userId) {
            _this3.newCreatedParcels[key] = _this3.parcels[key];
          }
        });

        if (Object.keys(this.newCreatedParcels).length > 0) {
          return this.newCreatedParcels;
        }

        this.error = 'Sorry, you don\'t have pending parcel delivery orders';
        return {};
      }
      Object.keys(this.parcels).forEach(function (key) {
        if (_this3.parcels[key].status === 'Pending') {
          _this3.newCreatedParcels[key] = _this3.parcels[key];
        }
      });

      if (Object.keys(this.newCreatedParcels).length > 0) {
        return this.newCreatedParcels;
      }

      this.error = 'Sorry, there are no pending parcel delivery orders';
      return {};
    } // end of getPending method

  }, {
    key: 'getInTransit',
    value: function getInTransit(userId) {
      var _this4 = this;

      if (userId) {
        Object.keys(this.parcels).forEach(function (key) {
          if (_this4.parcels[key].status === 'In transit' && _this4.parcels[key].sender.id === userId) {
            _this4.parcelsInTransit[key] = _this4.parcels[key];
          }
        });

        if (Object.keys(this.parcelsInTransit).length > 0) {
          return this.parcelsInTransit;
        }

        this.error = 'Sorry, you don\'t have parcels in transit';
        return {};
      }
      Object.keys(this.parcels).forEach(function (key) {
        if (_this4.parcels[key].status === 'In transit') {
          _this4.parcelsInTransit[key] = _this4.parcels[key];
        }
      });

      if (Object.keys(this.parcelsInTransit).length > 0) {
        return this.parcelsInTransit;
      }

      this.error = 'Sorry, there are no parcels in transit';
      return {};
    } // end of getInTransit method

  }, {
    key: 'getDelivered',
    value: function getDelivered(userId) {
      var _this5 = this;

      if (userId) {
        Object.keys(this.parcels).forEach(function (key) {
          if (_this5.parcels[key].status === 'Delivered' && _this5.parcels[key].sender.id === userId) {
            _this5.parcelsDelivered[key] = _this5.parcels[key];
          }
        });

        if (Object.keys(this.parcelsDelivered).length > 0) {
          return this.parcelsDelivered;
        }

        this.error = 'Sorry, you don\'t have delivered parcels';
        return {};
      }
      Object.keys(this.parcels).forEach(function (key) {
        if (_this5.parcels[key].status === 'Delivered') {
          _this5.parcelsDelivered[key] = _this5.parcels[key];
        }
      });

      if (Object.keys(this.parcelsDelivered).length > 0) {
        return this.parcelsDelivered;
      }

      this.error = 'Sorry, no parcel has been delivered';
      return {};
    } // end of getDelivered method

  }, {
    key: 'changeOrder',
    value: function changeOrder(pId, form, userId) {
      var _this6 = this;

      if (userId) {
        Object.keys(this.parcels).forEach(function (key) {
          if (_this6.parcels[key].orderId === pId && _this6.parcels[key].sender.id === userId) {
            if (form.new_country) {
              _this6.parcels[key].receiver.country = form.new_country;
            }
            if (form.new_city) {
              _this6.parcels[key].receiver.city = form.new_city;
            }
            if (form.new_address) {
              _this6.parcels[key].receiver.address = form.new_address;
            }

            _this6.parcel = _this6.parcels[key];
          }
        });

        if (Object.keys(this.parcel).length > 0) {
          return this.parcel;
        }

        this.error = 'Sorry, this order was not successfully changed';
        return {};
      }
      Object.keys(this.parcels).forEach(function (key) {
        if (_this6.parcels[key].orderId === pId) {
          if (form.new_status) {
            _this6.parcels[key].status = form.new_status;
          }
          if (form.new_country) {
            _this6.parcels[key].presentLocation = form.new_country;
          }
          if (form.new_city) {
            _this6.parcels[key].presentLocation += ', ' + form.new_city;
          }
          if (form.new_address) {
            _this6.parcels[key].presentLocation += ' - ' + form.new_address;
          }

          _this6.parcel = _this6.parcels[key];
        }
      });

      if (Object.keys(this.parcel).length > 0) {
        return this.parcel;
      }

      this.error = 'Sorry, this order was not successfully changed';
      return {};
    } // end of changeOrder method

  }, {
    key: 'createOrder',
    value: function createOrder(form, user) {
      if (Object.keys(user).length > 0) {
        if (form.rname && form.rphone && form.dest_country && form.product && form.quantity) {
          var orderId = Math.random().toString().substr(2, 3);
          var price = Math.ceil(Math.random() * 100);

          this.parcels['order' + orderId] = {
            orderId: orderId,
            sender: {
              id: user.id,
              name: user.fname + ' ' + user.lname,
              phone: user.phone,
              email: user.email,
              country: form.sender_country,
              city: form.sender_city,
              address: form.sender_address
            },
            receiver: {
              name: form.rname,
              phone: form.rphone,
              email: form.remail,
              country: form.dest_country,
              city: form.dest_city,
              address: form.dest_address
            },
            product: form.product,
            weight: form.weight,
            quantity: Math.abs(form.quantity),
            price: 'USD ' + price,
            status: 'Pending',
            presentLocation: form.sender_country + ', ' + form.sender_city + ' - ' + form.sender_address
          };

          if (Object.keys(this.parcels['order' + orderId]).length > 0) {
            return this.parcels['order' + orderId];
          }
        }

        this.error = 'Please enter the required information to create an order!';
        return {};
      }

      this.error = this.error || 'Please, sign-in to create an order!';
      return {};
    } // end of createOrder method

  }, {
    key: 'cancelOrder',
    value: function cancelOrder(pId, userId) {
      var _this7 = this;

      if (pId) {
        if (userId) {
          Object.keys(this.parcels).forEach(function (key) {
            if (_this7.parcels[key].orderId === pId && _this7.parcels[key].sender.id === userId) {
              _this7.parcel = _this7.parcels[key];
              delete _this7.parcels[key];
            }
          });

          if (Object.keys(this.parcel).length > 0) {
            return true;
          }

          this.error = 'Sorry, you can only cancel order that you created';
          return {};
        }

        this.error = 'Sorry, you can not cancel this order';
        return {};
      }

      this.error = 'Please, provide the id of the order to cancel!';
      return {};
    }
  }]);

  return Parcel;
}();

exports.default = Parcel;