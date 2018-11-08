class Parcel {
  constructor(parcels) {
    this.parcel = {};
    this.parcels = parcels || {};
    this.userParcels = {};
    this.newCreatedParcels = {};
    this.parcelsInTransit = {};
    this.parcelsDelivered = {};
    this.error = '';
  }

  getDetails(pId) {
    if (!pId) {
      this.error = 'Please, provide a parcel delivery order id to check!';
      return this.error;
    }

    Object.keys(this.parcels).forEach((key) => {
      if (this.parcels[key].orderId === pId) {
        this.parcel = this.parcels[key];
      }
    });

    if (Object.keys(this.parcel).length > 0) {
      return this.parcel;
    }

    this.error = `Sorry, there is no parcel delivery order with this id : ${pId}`;
    return this.error;
  } // end of get method

  getAll(userId) {
    if (userId) {
      Object.keys(this.parcels).forEach((key) => {
        if (this.parcels[key].sender.id === userId) {
          this.userParcels[key] = this.parcels[key];
        }
      });

      if (Object.keys(this.userParcels).length > 0) {
        return this.userParcels;
      }

      this.error = 'Sorry, you don\'t have any parcel delivery order';
      return this.error;
    }
    if (Object.keys(this.parcels).length > 0) {
      return this.parcels;
    }

    this.error = 'Sorry, there are no parcel delivery orders';
    return this.error;
  } // end fo getAll method

  getNewCreated(userId) {
    if (userId) {
      Object.keys(this.parcels).forEach((key) => {
        if (this.parcels[key].status === 'Unprocessed' && this.parcels[key].sender.id === userId) {
          this.newCreatedParcels[key] = this.parcels[key];
        }
      });

      if (Object.keys(this.newCreatedParcels).length > 0) {
        return this.newCreatedParcels;
      }

      this.error = 'Sorry, you don\'t have new created parcel delivery orders';
      return this.error;
    }
    Object.keys(this.parcels).forEach((key) => {
      if (this.parcels[key].status === 'Unprocessed') {
        this.newCreatedParcels[key] = this.parcels[key];
      }
    });

    if (Object.keys(this.newCreatedParcels).length > 0) {
      return this.newCreatedParcels;
    }

    this.error = 'Sorry, there are no new created parcel delivery orders';
    return this.error;
  } // end of getNewCreated method

  getInTransit(userId) {
    if (userId) {
      Object.keys(this.parcels).forEach((key) => {
        if (this.parcels[key].status === 'In transit' && this.parcels[key].sender.id === userId) {
          this.parcelsInTransit[key] = this.parcels[key];
        }
      });

      if (Object.keys(this.parcelsInTransit).length > 0) {
        return this.parcelsInTransit;
      }

      this.error = 'Sorry, you don\'t have parcels in transit';
      return this.error;
    }
    Object.keys(this.parcels).forEach((key) => {
      if (this.parcels[key].status === 'In transit') {
        this.parcelsInTransit[key] = this.parcels[key];
      }
    });

    if (Object.keys(this.parcelsInTransit).length > 0) {
      return this.parcelsInTransit;
    }

    this.error = 'Sorry, there are no parcels in transit';
    return this.error;
  } // end of getInTransit method

  getDelivered(userId) {
    if (userId) {
      Object.keys(this.parcels).forEach((key) => {
        if (this.parcels[key].status === 'Delivered' && this.parcels[key].sender.id === userId) {
          this.parcelsDelivered[key] = this.parcels[key];
        }
      });

      if (Object.keys(this.parcelsDelivered).length > 0) {
        return this.parcelsDelivered;
      }

      this.error = 'Sorry, you don\'t have delivered parcels';
      return this.error;
    }
    Object.keys(this.parcels).forEach((key) => {
      if (this.parcels[key].status === 'Delivered') {
        this.parcelsDelivered[key] = this.parcels[key];
      }
    });

    if (Object.keys(this.parcelsDelivered).length > 0) {
      return this.parcelsDelivered;
    }

    this.error = 'Sorry, no parcel has been delivered';
    return this.error;
  } // end of getDelivered method

  changeOrder(pId, form, userId) {
    if (userId) {
      Object.keys(this.parcels).forEach((key) => {
        if (this.parcels[key].orderId === pId && this.parcels[key].sender.id === userId) {
          if (form.new_country) {
            this.parcels[key].receiver.country = form.new_country;
          }
          if (form.new_city) {
            this.parcels[key].receiver.city = form.new_city;
          }
          if (form.new_address) {
            this.parcels[key].receiver.address = form.new_address;
          }

          this.parcel = this.parcels[key];
        }
      });

      if (Object.keys(this.parcel).length > 0) {
        return this.parcel;
      }

      this.error = 'Sorry, this order was not successfully changed';
      return this.error;
    }
    Object.keys(this.parcels).forEach((key) => {
      if (this.parcels[key].orderId === pId) {
        if (form.new_status) {
          this.parcels[key].status = form.new_status;
        }
        if (form.new_country) {
          this.parcels[key].presentLocation = form.new_country;
        }
        if (form.new_city) {
          this.parcels[key].presentLocation += `, ${form.new_city}`;
        }
        if (form.new_address) {
          this.parcels[key].presentLocation += ` - ${form.new_address}`;
        }

        this.parcel = this.parcels[key];
      }
    });

    if (Object.keys(this.parcel).length > 0) {
      return this.parcel;
    }

    this.error = 'Sorry, this order was not successfully changed';
    return this.error;
  } // end of changeOrder method

  createOrder(form, user) {
    if (Object.keys(user).length > 0) {
      if (form.rname && form.rphone && form.dest_country && form.product && form.quantity) {
        const orderId = Math.random().toString().substr(2, 3);
        const price = Math.ceil(Math.random() * 100);

        this.parcels[`order${orderId}`] = {
          orderId,
          sender: {
            id: user.id,
            name: `${user.fname} ${user.lname}`,
            phone: user.phone,
            email: user.email,
            country: form.sender_country,
            city: form.sender_city,
            address: form.sender_address,
          },
          receiver: {
            name: form.rname,
            phone: form.rphone,
            email: form.remail,
            country: form.dest_country,
            city: form.dest_city,
            address: form.dest_address,
          },
          product: form.product,
          weight: form.weight,
          quantity: form.quantity,
          price: `USD ${price}`,
          status: 'Unprocessed',
          presentLocation: `${form.sender_country}, ${form.sender_city} - ${form.sender_address}`,
        };

        if (Object.keys(this.parcels[`order${orderId}`]).length > 0) {
          return this.parcels[`order${orderId}`];
        }

        this.error = 'Sorry, the order was not successfully. Please try again!';
        return this.error;
      }

      this.error = 'Please enter the required information to create an order!';
      return this.error;
    }

    this.error = this.error || 'Please, sign-in to create an order!';
    return this.error;
  } // end of createOrder method

  cancelOrder(pId, userId) {
    if (pId) {
      if (userId) {
        Object.keys(this.parcels).forEach((key) => {
          if (this.parcels[key].orderId === pId && this.parcels[key].sender.id === userId) {
            this.parcel = this.parcels[key];
            delete this.parcels[key];
          }
        });

        if (Object.keys(this.parcel).length > 0) {
          return true;
        }

        this.error = 'Sorry, you can only cancel order that you created';
        return this.error;
      }

      this.error = 'Sorry, you can not cancel this order';
      return this.error;
    }

    this.error = 'Please, provide the id of the order to cancel!';
    return this.error;
  }
}

export default Parcel;
