class User {
  constructor(users) {
    this.user = {};
    this.users = users || {};
    this.error = '';
  }

  getInfo(id) {
    if (!id) {
      this.error = 'Please, provide a user id to check!';
      return {};
    }

    Object.keys(this.users).forEach((key) => {
      if (this.users[key].id === id) {
        this.user = this.users[key];
      }
    });

    if (Object.keys(this.user).length > 0) {
      return this.user;
    }

    this.error = `Sorry, there is no user that corresponds to this id: ${id}`;
    return {};
  } // end of get method

  signup(form) {
    if (!form) {
      this.error = 'Please, enter the required information to sign-up!';
      return {};
    }

    if (form.fname && form.lname && form.uname && form.password && form.phone && form.country) {
      const id = Math.random().toString().substr(2, 3);

      this.user = {
        id,
        fname: form.fname,
        lname: form.lname,
        uname: form.uname,
        password: form.password,
        phone: form.phone,
        email: form.email,
        country: form.country,
        city: form.city,
        address: form.address,
      };

      this.users[`user${id}`] = this.user;

      return this.user;
    }

    this.error = 'Please, enter the required information to sign-up!';
    return {};
  } // end of signup method

  signin(form) {
    if (!form) {
      this.error = 'Please, enter your username and your password!';
      return {};
    }

    if (Object.keys(form).length === 2 && form.uname !== '' && form.password !== '') {
      Object.keys(this.users).forEach((key) => {
        if (this.users[key].uname === form.uname && this.users[key].password === form.password) {
          this.user = this.users[key];
        }
      });

      if (Object.keys(this.user).length > 0) {
        return this.user;
      }

      this.error = 'Sorry, your username or password is incorrect';
      return {};
    }

    this.error = 'Please, enter your username and your password!';
    return {};
  } // end of signin method
} // end of User class


export default User;
