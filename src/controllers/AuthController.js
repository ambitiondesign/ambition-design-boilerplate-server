import jwt from 'jsonwebtoken';
import validator from 'validator';
import crypto from 'crypto';
import UserService from '../services/UserService';
import Util from '../util/Utils';

const util = new Util();

class AuthController {
  static async signup(req, res) {
    const { email, password, firstName, lastName } = req.body;
    if ( !validator.isEmail(email) || !String(password) || !String(firstName)|| !String(lastName)) {
      util.setError(400, 'Please input a valid value');
      return util.send(res);
    }

    try {
      const user = await UserService.register(req.body);
      user.password = undefined;
      const token = jwt.sign({id: user.id, email: user.email}, process.env.JWT_KEY, { expiresIn: 36000 });
      util.setSuccess(201, 'User is successfully signed up', {
        user: user,
        token: token
      })
      return util.send(res);
    } catch (error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async signin(req, res) {
    try {
      const { email, password } = req.body;
      const user = await UserService.getUser(email);
      if (!user) {
        util.setError(401, 'Login failed! Check authentication credentials');
        return util.send(res);
      }

      const isPasswordMatch = await UserService.validatePassword(password, user.password)
      if (!isPasswordMatch) {
        util.setError(401, 'Login failed! Check authentication credentials');
        return util.send(res);
      }
      user.password = undefined;

      const token = jwt.sign({id: user.id, email: user.email}, process.env.JWT_KEY, { expiresIn: 36000 });
      util.setSuccess(200, 'User is successfully signed in', {
        user: user,
        token: token
      })
  
      return util.send(res);
    } catch(error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async passwordChange(req, res) {
    try {
      const { email, currentPassword, newPassword, verifyPassword } = req.body;
      const user = await UserService.getUser(email);
      if (!user) {
        util.setError(400, 'No account with that email has been found');
        return util.send(res);
      }

      const isPasswordMatch = await UserService.validatePassword(currentPassword, user.password)
      if (!isPasswordMatch) {
        util.setError(401, 'Current password is incorrect');
        return util.send(res);
      }

      if (newPassword === verifyPassword) {
        user.password = newPassword;
        await UserService.updateUser(user);
  
        // send password updated email
  
        util.setSuccess(200, 'Password reset email has been sent.')
        return util.send(res);
      } else {
        throw 'Passwords do not match';
      }
    } catch(error) {
      util.setError(400, error);
      return util.send(res);
    }
  }


  static async forgot(req, res) {
    try {
      const { email } = req.body;
      const user = await UserService.getUser(email);
      if (!user) {
        util.setError(400, 'No account with that email has been found');
        return util.send(res);
      }

      //generating random reset token
      const token = await new Promise((res, rej) => {
        crypto.randomBytes(10, (err, buffer) => {
          if (err) {
            rej(err);
          }
          res(buffer.toString("hex"));
        });
      });

      user.resetPasswordToken = token;
      user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour

      await UserService.updateUser(user);

      // send email

      util.setSuccess(200, 'Password reset email has been sent.')
      return util.send(res);
    } catch(error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async validateResetToken(req, res) {
    try {
      const { token } = req.params;
      const user = await UserService.getResetUser(token, new Date());
      if (!user) {
        util.setError(400, 'Password reset token is invalid or has expired.');
        return util.send(res);
      }

      util.setSuccess(200, 'Token was found successfully.');
      return util.send(res);
    } catch(error) {
      util.setError(400, error);
      return util.send(res);
    }
  }

  static async reset(req, res) {
    try {
      const { newPassword, verifyPassword } = req.body;
      const user = await UserService.getResetUser(req.params.token, new Date());
      if (!user) {
        util.setError(400, 'Password reset token is invalid or has expired.');
        return util.send(res);
      }
      
      if (newPassword === verifyPassword) {
        user.password = newPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpires = undefined // 1 hour
  
        await UserService.updateUser(user);
  
        // send password updated email
  
        util.setSuccess(200, 'Password reset email has been sent.')
        return util.send(res);
      } else {
        throw 'Passwords do not match';
      }
    } catch(error) {
      util.setError(400, error);
      return util.send(res);
    }
  }
}

export default AuthController;
