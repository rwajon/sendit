class Admin {
  constructor(admins) {
    this.admin = {};
    this.admins = admins || {};
    this.error = '';
  }

  signin(form) {
    if (!form) {
      this.error = 'Please, enter your username and your password!';
      return this.error;
    }

    if (Object.keys(form).length === 2 && form.uname !== '' && form.password !== '') {
      Object.keys(this.admins).forEach((key) => {
        if (this.admins[key].uname === form.uname && this.admins[key].password === form.password) {
          this.admin = {
            id: this.admins[key].id,
            uname: this.admins[key].uname,
          };
        }
      });

      if (Object.keys(this.admin).length > 0) {
        return this.admin;
      }

      this.error = 'Sorry, your username or password is incorrect';
      return this.error;
    }

    this.error = 'Please, enter your username and your password!';
    return this.error;
  } // end of signin method
} // end of Admin class


export default Admin;
