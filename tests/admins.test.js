import fs from 'fs';
import chai from 'chai';
import Admin from '../private/Admin';

const { expect } = chai;
const admins = JSON.parse(fs.readFileSync('private/admins.json'));

describe('Admin class', () => {
  /** ****signin method***** */
  describe('signin method', () => {
    // test 1
    it('should return the admin information if the account exists', () => {
      const admin = new Admin(admins);

      const form = {
        uname: 'rwajon',
        password: '12345',
      };

      expect(admin.signin(form) instanceof Object).to.be.true;
    });

    // test 2
    it('should display \'Sorry, your username or password is incorrect\'', () => {
      const admin = new Admin(admins);

      const form = {
        uname: 'rwajon',
        password: '1234',
      };

      expect(admin.signin(form)).to.equal('Sorry, your username or password is incorrect');
    });

    // test 3
    it('should display \'Please, enter your username and your password!\'', () => {
      const admin = new Admin(admins);

      const form = {
        uname: '',
        password: '',
      };

      expect(admin.signin(form)).to.equal('Please, enter your username and your password!');
    });
  }); // end of signin method tests
});
