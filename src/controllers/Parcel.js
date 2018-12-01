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
    if (form.rname && form.rphone
      && this.validateEmail(form.remail)
      && form.dest_country
      && form.product
      && form.quantity
      && form.price) {
      const text = `INSERT INTO
              orders(sender_id, receiver_name, receiver_phone, receiver_email, receiver_country, receiver_city, receiver_address, product, weight, qty, price, status, present_location) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) returning *`;

      const values = [
        userId,
        form.rname,
        form.rphone,
        form.remail,
        form.dest_country,
        form.dest_city,
        form.dest_address,
        form.product,
        form.weight,
        Math.abs(form.quantity),
        Math.abs(form.price),
        'pending',
        `${form.sender_country}, ${form.sender_city} - ${form.sender_address}`,
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
        const sender = await db.query('SELECT * FROM users WHERE id=$1', [order.rows[0].sender_id]);

        this.parcel = {
          orderId: order.rows[0].id,
          sender: {
            id: sender.rows[0].id,
            fname: sender.rows[0].fname,
            lname: sender.rows[0].lname,
            uname: sender.rows[0].uname,
            phone: sender.rows[0].phone,
            email: sender.rows[0].email,
            country: sender.rows[0].country,
            city: sender.rows[0].city,
            address: sender.rows[0].address,
          },
          receiver: {
            name: order.rows[0].receiver_name,
            phone: order.rows[0].receiver_phone,
            email: order.rows[0].receiver_email,
            country: order.rows[0].receiver_country,
            city: order.rows[0].receiver_city,
            address: order.rows[0].receiver_address,
          },
          product: order.rows[0].product,
          weight: order.rows[0].weight,
          quantity: order.rows[0].qty,
          price: `USD ${order.rows[0].price}`,
          status: order.rows[0].status,
          presentLocation: order.rows[0].present_location,
          created_date: order.rows[0].created_date,
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
        const { rows } = await db.query('SELECT * FROM orders WHERE sender_id=$1', [userId]);
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
        const { rows } = await db.query('SELECT * FROM orders WHERE status=\'pending\' AND sender_id=$1', [userId]);
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
        const { rows } = await db.query('SELECT * FROM orders WHERE status=\'in transit\' AND sender_id=$1', [userId]);
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
        const { rows } = await db.query('SELECT * FROM orders WHERE status=\'delivered\' AND sender_id=$1', [userId]);
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
    if (form.new_country || form.new_city || form.new_address) {
      try {
        const order = await db.query('SELECT * FROM orders WHERE id=$1 AND sender_id=$2', [pId, userId]);

        if (order.rows.length <= 0) {
          this.error = 'Sorry, you can not change this order';
          return {};
        }

        order.rows[0].reciver_country = form.new_country || order.rows[0].receiver_country;
        order.rows[0].reciver_city = form.new_city || order.rows[0].receiver_city;
        order.rows[0].reciver_address = form.new_address || order.rows[0].receiver_address;

        const text = `UPDATE orders SET receiver_country=$1, receiver_city=$2, receiver_address=$3 WHERE id=${pId}`;
        const values = [
          order.rows[0].reciver_country,
          order.rows[0].reciver_city,
          order.rows[0].reciver_address,
        ];

        const changed = await db.query(text, values);

        if (changed.rowCount > 0) {
          return {
            orderId: order.rows[0].id,
            senderId: order.rows[0].sender_id,
            receiver: {
              name: order.rows[0].receiver_name,
              phone: order.rows[0].receiver_phone,
              email: order.rows[0].receiver_email,
              country: order.rows[0].reciver_country,
              city: order.rows[0].reciver_city,
              address: order.rows[0].reciver_address,
            },
            product: order.rows[0].product,
            weight: order.rows[0].weight,
            quantity: order.rows[0].qty,
            price: `USD ${order.rows[0].price}`,
            status: order.rows[0].status,
            presentLocation: order.rows[0].present_location,
            created_date: order.rows[0].created_date,
          };
        }
      } catch (error) {
        console.log(error);
      }
    }
    this.error = 'Sorry, this order was not changed';
    return {};
  } // end of changeDestination method

  async changeStatus(pId, form) {
    if (form.new_status) {
      try {
        const order = await db.query('SELECT * FROM orders WHERE id=$1', [pId]);

        if (order.rows.length <= 0) {
          this.error = `Sorry, no order with id ${pId} was found`;
          return {};
        }

        order.rows[0].status = form.new_status || order.rows[0].status;

        const text = `UPDATE orders SET status=$1 WHERE id=${order.rows[0].id}`;
        const values = [order.rows[0].status];

        const changed = await db.query(text, values);

        if (changed.rowCount > 0) {
          return {
            orderId: order.rows[0].id,
            senderId: order.rows[0].sender_id,
            receiver: {
              name: order.rows[0].receiver_name,
              phone: order.rows[0].receiver_phone,
              email: order.rows[0].receiver_email,
              country: order.rows[0].receiver_country,
              city: order.rows[0].receiver_city,
              address: order.rows[0].receiver_address,
            },
            product: order.rows[0].product,
            weight: order.rows[0].weight,
            quantity: order.rows[0].qty,
            price: `USD ${order.rows[0].price}`,
            status: order.rows[0].status,
            presentLocation: order.rows[0].present_location,
            created_date: order.rows[0].created_date,
          };
        }
      } catch (error) {
        console.log(error);
      }
    }
    this.error = 'Sorry, this order was not changed';
    return {};
  } // end of changeStatus method

  async changePresentLocation(pId, form) {
    if (form.new_country || form.new_city || form.new_address) {
      try {
        const order = await db.query('SELECT * FROM orders WHERE id=$1', [pId]);

        if (order.rows.length <= 0) {
          this.error = `Sorry, no order with id ${pId} was found`;
          return {};
        }
        if (form.new_country) {
          order.rows[0].present_location = form.new_country;
        }
        if (form.new_city) {
          order.rows[0].present_location += `, ${form.new_city}`;
        }
        if (form.new_address) {
          order.rows[0].present_location += ` - ${form.new_address}`;
        }

        const text = `UPDATE orders SET present_location=$1 WHERE id=${order.rows[0].id}`;
        const values = [order.rows[0].present_location];

        const changed = await db.query(text, values);

        if (changed.rowCount > 0) {
          return {
            orderId: order.rows[0].id,
            senderId: order.rows[0].sender_id,
            receiver: {
              name: order.rows[0].receiver_name,
              phone: order.rows[0].receiver_phone,
              email: order.rows[0].receiver_email,
              country: order.rows[0].receiver_country,
              city: order.rows[0].receiver_city,
              address: order.rows[0].receiver_address,
            },
            product: order.rows[0].product,
            weight: order.rows[0].weight,
            quantity: order.rows[0].qty,
            price: `USD ${order.rows[0].price}`,
            status: order.rows[0].status,
            presentLocation: order.rows[0].present_location,
            created_date: order.rows[0].created_date,
          };
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
      const order = await db.query('SELECT * FROM orders WHERE id=$1 AND sender_id=$2', [pId, userId]);

      if (order.rows.length > 0) {
        const cancelled = await db.query(`UPDATE orders SET status='cancelled' WHERE id=${order.rows[0].id}`);

        if (cancelled.rowCount > 0) {
          return {
            orderId: order.rows[0].id,
            senderId: order.rows[0].sender_id,
            receiver: {
              name: order.rows[0].receiver_name,
              phone: order.rows[0].receiver_phone,
              email: order.rows[0].receiver_email,
              country: order.rows[0].receiver_country,
              city: order.rows[0].receiver_city,
              address: order.rows[0].receiver_address,
            },
            product: order.rows[0].product,
            weight: order.rows[0].weight,
            quantity: order.rows[0].qty,
            price: `USD ${order.rows[0].price}`,
            status: 'cancelled',
            presentLocation: order.rows[0].present_location,
            created_date: order.rows[0].created_date,
          };
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
