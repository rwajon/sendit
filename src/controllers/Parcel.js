import db from '../models/index';

class Parcel {
  constructor(parcels) {
    this.parcel = {};
    this.parcels = parcels || {};
    this.userParcels = {};
    this.pendingParcels = {};
    this.parcelsInTransit = {};
    this.parcelsDelivered = {};
    this.error = '';
  }

  getOrder(pId) {
    Object.keys(this.parcels).forEach((key) => {
      if (this.parcels[key].orderId === pId) {
        this.parcel = this.parcels[key];
      }
    });

    if (Object.keys(this.parcel).length > 0) {
      return this.parcel;
    }

    this.error = `Sorry, there is no parcel delivery order with this id: ${pId}`;
    return {};
  } // end of get method

  async getAll(userId) {
    try {
      if (userId) {
        const { rows } = await db.query('SELECT * FROM orders WHERE sender_id=$1', [userId]);
        if (rows.length > 0) {
          return rows;
        } else {
          this.error = 'Sorry, there are no parcel delivery orders';
          return {};
        }
      } else {
        const { rows } = await db.query('SELECT * FROM orders');
        if (rows.length > 0) {
          return rows;
        } else {
          this.error = 'Sorry, there are no parcel delivery orders';
          return {};
        }
      }
    } catch (error) {
      console.log(error);
    }
  } // end fo getAll method

  getPending(userId) {
    if (userId) {
      Object.keys(this.parcels).forEach((key) => {
        if (this.parcels[key].status === 'Pending' && this.parcels[key].sender.id === userId) {
          this.pendingParcels[key] = this.parcels[key];
        }
      });

      if (Object.keys(this.pendingParcels).length > 0) {
        return this.pendingParcels;
      }

      this.error = 'Sorry, there are no pending parcel delivery orders';
      return {};
    }

    Object.keys(this.parcels).forEach((key) => {
      if (this.parcels[key].status === 'Pending') {
        this.pendingParcels[key] = this.parcels[key];
      }
    });

    if (Object.keys(this.pendingParcels).length > 0) {
      return this.pendingParcels;
    }

    this.error = 'Sorry, there are no pending parcel delivery orders';
    return {};
  } // end of getPending method

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

      this.error = 'Sorry, there are no parcels in transit';
      return {};
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
    return {};
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

      this.error = 'Sorry, no parcel has been delivered';
      return {};
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
    return {};
  } // end of getDelivered method

  changeOrder(pId, form, userId) {
    if (!(form.new_country || form.new_city || form.new_address || form.new_status)) {
      this.error = 'Sorry, this order was not changed';
      return false;
    }

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

      return this.parcel;
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

    return this.parcel;
  } // end of changeOrder method

  async createOrder(form, user) {
    if (Object.keys(user).length > 0) {
      if (form.rname && form.rphone && form.dest_country && form.product && form.quantity) {

        const text = `INSERT INTO
              orders(sender_id, receiver_name, receiver_phone, receiver_email, receiver_country, receiver_city, receiver_address, product, weight, qty, price, status, presentLocation) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) returning *`;

        const values = [
          user.id,
          form.rname,
          form.rphone,
          form.remail,
          form.dest_country,
          form.dest_city,
          form.dest_address,
          form.product,
          form.weight,
          Math.abs(form.quantity),
          Math.ceil(Math.random() * 100),
          'Pending',
          `${form.sender_country}, ${form.sender_city} - ${form.sender_address}`
        ];

        try {
          const { rows } = await db.query(text, values);

          if (rows.length > 0) {
            this.parcel = rows[0];
          }
        } catch (error) {
          console.log(error);
        }

        return this.parcel;
      }

      this.error = 'Please enter the required information to create an order!';
      return {};
    }

    this.error = this.error || 'Please, sign-in to create an order!';
    return {};
  } // end of createOrder method

  cancelOrder(pId) {
    Object.keys(this.parcels).forEach((key) => {
      if (this.parcels[key].orderId === pId) {
        this.parcel = this.parcels[key];
        this.parcel.status = 'Cancelled';
      }
    });

    if (Object.keys(this.parcel).length > 0) {
      return this.parcel;
    }

    this.error = 'Sorry, this order was not cancelled';
    return {};
  }
}

export default Parcel;