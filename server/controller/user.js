import BaseComponent from '../proptype/BaseComponent';

class User extends BaseComponent {
  signin(req, res) {
    console.log(1);
  }
}

export default new User();