import jwt from 'jsonwebtoken';
import validator from 'validator';
import UserService from '../services/UserService';
import Util from '../util/Utils';

const util = new Util();

class UserController {
  static async getUser(req, res) {
    const { email } = req.params;
    if (!validator.isEmail(email)) {
      util.setError(400, 'Please input a valid value');
      return util.send(res);
    }

    try {
      const user = await UserService.getUser(email);
      user.password = undefined;

      util.setSuccess(200, 'User is successfully retrieved', user);
      return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
  }

  static async updateUser(req, res) {
    const { email, firstName, lastName } = req.body;

    if ( !validator.isEmail(email) || !String(firstName)|| !String(lastName)) {
      util.setError(400, 'Please input a valid value');
      return util.send(res);
    }

    try {
        const user = await UserService.getUser(email);
        user.firstName = firstName;
        user.lastName = lastName;
        await UserService.updateUser(user);
        util.setSuccess(200, 'User is successfully updated.');
        return util.send(res);
    } catch (error) {
      util.setError(404, error);
      return util.send(res);
    }
    
  }
}

export default UserController;
