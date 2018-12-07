class Validate {
  constructor() {

  }

  static email(input) {
    this.re = /\S+@\S+\.\S+/;
    return this.re.test(input);
  }
}

export default Validate;