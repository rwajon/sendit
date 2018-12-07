import db from '../models/index';

class Parcel {
  constructor() {
    this.parcel = {};
    this.parcels = [];
    this.error = '';
  }

  validateEmail(email) {
    this.re = /\S+@\S+\.\S+/;
    return this.re.test(email);
  }

  async createOrder(form, userId) {
    if (form.receiverName && form.receiverPhone
      && this.validateEmail(form.receiverEmail)
      && form.receiverCountry
      && form.product
      && form.quantity
      && form.price) {

      const text = `INSERT INTO
              orders("userId", "receiverName", "receiverPhone", "receiverEmail", "receiverCountry", "receiverCity", "receiverAddress", product, weight, qty, price, status, location) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING *`;

      const values = [
        userId,
        form.receiverName,
        form.receiverPhone,
        form.receiverEmail,
        form.receiverCountry,
        form.receiverCity,
        form.receiverAddress,
        form.product,
        form.weight,
        Math.abs(form.quantity),
        Math.abs(form.price),
        'pending',
        `${form.senderCountry}, ${form.senderCity} - ${form.senderAddress}`,
      ];

      try {
        const { rows } = await db.query(text, values);

        if (rows.length > 0) {
          [this.parcel] = rows;
        }
      } catch (error) {
        console.log(error);
      }

      return this.parcel;
    }

    this.error = 'Please enter the required information to create an order!';
    return {};
  } // end of createOrder method

  async getOrder(pId, userId) {
    try {
      const order = await db.query('SELECT * FROM orders WHERE id=$1', [pId]);
      if (order.rows.length > 0) {
        const sender = await db.query('SELECT * FROM users WHERE id=$1', [order.rows[0].userId]);

        this.parcel = {
          orderId: order.rows[0].id,
          sender: {
            id: sender.rows[0].id,
            firstName: sender.rows[0].firstName,
            lastName: sender.rows[0].lastName,
            userName: sender.rows[0].userName,
            phone: sender.rows[0].phone,
            email: sender.rows[0].email,
            country: sender.rows[0].country,
            city: sender.rows[0].city,
            address: sender.rows[0].address,
          },
          receiver: {
            name: order.rows[0].receiverName,
            phone: order.rows[0].receiverPhone,
            email: order.rows[0].receiverEmail,
            country: order.rows[0].receiverCountry,
            city: order.rows[0].receiverCity,
            address: order.rows[0].receiverAddress,
          },
          product: order.rows[0].product,
          weight: order.rows[0].weight,
          quantity: order.rows[0].qty,
          price: order.rows[0].price,
          status: order.rows[0].status,
          location: order.rows[0].location,
          createdDate: order.rows[0].createdDate,
        };

        if (userId && userId === sender.rows[0].id) {
          return this.parcel;
        }
        if (!userId) {
          return this.parcel;
        }
      }
    } catch (error) {
      console.log(error);
    }
    this.error = `Sorry, there is no parcel delivery order with this id: ${pId}`;
    return {};
  } // end of get method

  async getAll(userId) {
    try {
      if (userId) {
        const { rows } = await db.query('SELECT * FROM orders WHERE "userId"=$1', [userId]);
        if (rows.length > 0) {
          return rows;
        }
      }
      const { rows } = await db.query('SELECT * FROM orders');
      if (rows.length > 0) {
        return rows;
      }
    } catch (error) {
      console.log(error);
    }
    this.error = 'Sorry, there are no parcel delivery orders';
    return {};
  } // end of getAll method

  async getPending(userId) {
    try {
      if (userId) {
        const { rows } = await db.query('SELECT * FROM orders WHERE status=\'pending\' AND "userId"=$1', [userId]);
        if (rows.length > 0) {
          return rows;
        }
      }
      const { rows } = await db.query('SELECT * FROM orders WHERE status=\'pending\'');
      if (rows.length > 0) {
        return rows;
      }
    } catch (error) {
      console.log(error);
    }
    this.error = 'Sorry, there are no pending parcel delivery orders';
    return {};
  } // end of getPending method

  async getInTransit(userId) {
    try {
      if (userId) {
        const { rows } = await db.query('SELECT * FROM orders WHERE status=\'in transit\' AND "userId"=$1', [userId]);
        if (rows.length > 0) {
          return rows;
        }
      }
      const { rows } = await db.query('SELECT * FROM orders WHERE status=\'in transit\'');
      if (rows.length > 0) {
        return rows;
      }
    } catch (error) {
      console.log(error);
    }
    this.error = 'Sorry, there are no parcels in transit';
    return {};
  } // end of getInTransit method

  async getDelivered(userId) {
    try {
      if (userId) {
        const { rows } = await db.query('SELECT * FROM orders WHERE status=\'delivered\' AND "userId"=$1', [userId]);
        if (rows.length > 0) {
          return rows;
        }
      }
      const { rows } = await db.query('SELECT * FROM orders WHERE status=\'delivered\'');
      if (rows.length > 0) {
        return rows;
      }
    } catch (error) {
      console.log(error);
    }
    this.error = 'Sorry, there are no delivered parcels';
    return {};
  } // end of getDelivered method

  async changeDestination(pId, form, userId) {
    if (form.country || form.city || form.address) {
      try {
        const order = await db.query('SELECT * FROM orders WHERE id=$1 AND "userId"=$2', [pId, userId]);

        if (order.rows.length <= 0) {
          this.error = 'Sorry, you can not change this order';
          return {};
        }

        order.rows[0].receiverCountry = form.country || order.rows[0].receiverCountry;
        order.rows[0].receiverCity = form.city || order.rows[0].receiverCity;
        order.rows[0].receiverAddress = form.address || order.rows[0].receiverAddress;

        const text = `UPDATE orders SET "receiverCountry"=$1, "receiverCity"=$2, "receiverAddress"=$3 WHERE id=${pId} RETURNING *`;
        const values = [
          order.rows[0].receiverCountry,
          order.rows[0].receiverCity,
          order.rows[0].receiverAddress,
        ];

        const changed = await db.query(text, values);

        if (changed.rowCount > 0) {
          return changed.rows[0];
        }
      } catch (error) {
        console.log(error);
      }
    }
    this.error = 'Sorry, this order was not changed';
    return {};
  } // end of changeDestination method

  async changeStatus(pId, form) {
    if (form.status) {
      try {
        const order = await db.query('SELECT * FROM orders WHERE id=$1', [pId]);

        if (order.rows.length <= 0) {
          this.error = `Sorry, no order with id ${pId} was found`;
          return {};
        }

        order.rows[0].status = form.status || order.rows[0].status;

        const text = `UPDATE orders SET status=$1 WHERE id=${order.rows[0].id} RETURNING *`;
        const values = [order.rows[0].status];

        const changed = await db.query(text, values);

        if (changed.rowCount > 0) {
          return changed.rows[0];
        }
      } catch (error) {
        console.log(error);
      }
    }
    this.error = 'Sorry, this order was not changed';
    return {};
  } // end of changeStatus method

  async changePresentLocation(pId, form) {
    if (form.country || form.city || form.address) {
      try {
        const order = await db.query('SELECT * FROM orders WHERE id=$1', [pId]);

        if (order.rows.length <= 0) {
          this.error = `Sorry, no order with id ${pId} was found`;
          return {};
        }
        if (form.country) {
          order.rows[0].location = form.country;
        }
        if (form.city) {
          order.rows[0].location += `, ${form.city}`;
        }
        if (form.address) {
          order.rows[0].location += ` - ${form.address}`;
        }

        const text = `UPDATE orders SET location=$1 WHERE id=${order.rows[0].id} RETURNING *`;
        const values = [order.rows[0].location];

        const changed = await db.query(text, values);

        if (changed.rowCount > 0) {
          return changed.rows[0];
        }
      } catch (error) {
        console.log(error);
      }
    }
    this.error = 'Sorry, this order was not changed';
    return {};
  } // end of changePresentLocation method

  async cancelOrder(pId, userId) {
    try {
      const order = await db.query('SELECT * FROM orders WHERE id=$1 AND "userId"=$2', [pId, userId]);

      if (order.rows.length > 0) {
        const cancelled = await db.query(`UPDATE orders SET status='cancelled' WHERE id=${order.rows[0].id} RETURNING *`);

        if (cancelled.rowCount > 0) {
          return cancelled.rows[0];
        }
      }
    } catch (error) {
      console.log(error);
    }
    this.error = 'Sorry, you can not cancel this order';
    return {};
  } // end of cancelOrder method
}

export default Parcel;
