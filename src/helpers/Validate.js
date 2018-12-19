class Validate {
  static email(input) {
    if (input) {
      this.re = /\S+@\S+\.\S+/;
      return this.re.test(input);
    }
    return true;
  }
}

export default Validate;
