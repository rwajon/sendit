import fs from 'fs';
import chai from 'chai';
import User from './src/controllers/User';

const { expect } = chai;
const users = JSON.parse(fs.readFileSync('JSONFiles/users.json'));

describe('User class', () => {
  /** ****get user tests***** */
  describe('getInfo method', () => {
    // test 1
    it('should return the corresponding user information based on the given id', () => {
      const id = '001';
      const user = new User(users);

      expect(user.getInfo(id) instanceof Object).to.be.true;
    });

    // test 2
    it('should display \'Sorry, there is no user that corresponds to this id: 0000\'', () => {
      const id = '0000';
      const user = new User(users);

      user.getInfo(id);

      expect(user.error).to.equal('Sorry, there is no user that corresponds to this id: 0000');
    });

    // test 3
    it('should display \'Please, provide a user id to check!\'', () => {
      const id = null;
      const user = new User(users);

      user.getInfo(id);

      expect(user.error).to.equal('Please, provide a user id to check!');
    });
  }); // end of getInfo method tests

  /** ****signin method***** */
  describe('signin method', () => {
    // test 1
    it('should return the user information if the account exists', () => {
      const user = new User(users);

      const form = {
        uname: 'rwajon',
        password: '12345',
      };

      expect(user.signin(form) instanceof Object).to.be.true;
    });

    // test 2
    it('should display \'Sorry, your username or password is incorrect\'', () => {
      const user = new User(users);

      const form = {
        uname: 'rwajon',
        password: '1234',
      };

      user.signin(form);

      expect(user.error).to.equal('Sorry, your username or password is incorrect');
    });

    // test 3
    it('should display \'Please, enter your username and your password!\'', () => {
      const user = new User(users);

      const form = {
        uname: '',
        password: '',
      };

      user.signin(form);

      expect(user.error).to.equal('Please, enter your username and your password!');
    });

    // test 4
    it('should display \'Please, enter your username and your password!\'', () => {
      const user = new User(users);

      user.signin();

      expect(user.error).to.equal('Please, enter your username and your password!');
    });
  }); // end of signin method tests

  /** *****signup method****** */
  describe('signup method', () => {
    // test 1
    it('should return the user information if the registration has succeeded', () => {
      const user = new User(users);

      const form = {
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

      expect(user.signup(form) instanceof Object).to.be.true;
    });

    // test 2
    it('should display \'Please, enter the required information to sign-up!\'', () => {
      const user = new User(users);

      const form = {
        id: '001',
        fname: 'Jonathan',
        lname: '',
        uname: 'rwajon',
        password: '',
        phone: '+250781146646',
        email: 'jonathanrwabahizi@gmail.com',
        country: 'Rwanda',
        city: 'Gisenyi',
        address: 'Mbugangari',
      };

      user.signup(form);

      expect(user.error).to.equal('Please, enter the required information to sign-up!');
    });

    // test 4
    it('should display \'Please, enter the required information to sign-up!\'', () => {
      const user = new User(users);

      user.signup();

      expect(user.error).to.equal('Please, enter the required information to sign-up!');
    });
  }); // end of signup method tests
});
