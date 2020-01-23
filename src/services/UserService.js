import makeDb from '../util/database';
import User from '../models/User';
import bcrypt from 'bcrypt';

class UserService {
  static async register(user) {
    const db = makeDb();
    try {
      const passwordHash = await bcrypt.hash(user.password, 10);
      const date = new Date();
      const records = [
        [user.email, passwordHash, user.firstName, user.lastName, date, date]
      ]

      await db.beginTransaction();
      const users = await db.query('SELECT * FROM `user` WHERE `email` = ?',[user.email]);
      if (users.length > 0) {
        throw 'User already exists!!';
      }

      const result = await db.query(
        'INSERT INTO  `user` (email, password, first_name, last_name, updated, created) VALUES ?'
        , [records]);
      user.id = result.insertId;

      const roleRecords = [
        [user.id, 2]
      ];
      await db.query(
        'INSERT INTO  `role` (user_id, role_type_id) VALUES ?'
        , [roleRecords]);

      await db.commit();
      return new User(user.id, user.email, undefined, user.firstName, user.lastName, ['user'], undefined, undefined, date, date);
    } catch (error) {
      await db.rollback();
      throw error;
    } finally {
      await db.close();
    }
  }
  
  static async getUser(email) {
    const db = makeDb();
    try {
      const users = await db.query('SELECT * FROM `user` WHERE `email` = ?',[email]);
      if (users.length > 0) {
        // retrieving roles by userid
        const roles = await db.query(
          'SELECT rt.name AS name FROM `user` u ' +
          'JOIN `role` r ON u.id = r.user_id ' +
          'JOIN `role_type` rt on r.role_type_id = rt.id ' +
          'WHERE `user_id` = ?', [users[0].id]);
        let userRoles = [];
        if (roles) {
          for(const role of roles) {
            userRoles.push(role.name);
          }
        }
        return new User(users[0].id, users[0].email, users[0].password, users[0].first_name, users[0].last_name, userRoles, users[0].reset_password_token, users[0].reset_password_expires, users[0].updated, users[0].created);
      } else {
        return undefined;
      }
    } catch (error) {
      throw error;
    } finally {
      await db.close();
    }
  }

  static async getResetUser(token, date) {
    const db = makeDb();
    try {
      const users = await db.query('SELECT * FROM `user` WHERE `reset_password_token` = ? AND `reset_password_expires` > ?',[token, date]);
      if (users.length > 0) {
        // retrieving roles by userid
        const roles = await db.query(
          'SELECT rt.name AS name FROM `user` u ' +
          'JOIN `role` r ON u.id = r.user_id ' +
          'JOIN `role_type` rt on r.role_type_id = rt.id ' +
          'WHERE `user_id` = ?', [users[0].id]);
        let userRoles = [];
        if (roles) {
          for(const role of roles) {
            userRoles.push(role.name);
          }
        }
        return new User(users[0].id, users[0].email, undefined, users[0].first_name, users[0].last_name, userRoles, users[0].updated, users[0].created);
      } else {
        return undefined;
      }
    } catch (error) {
      throw error;
    } finally {
      await db.close();
    }
  }

  static async updateUser(user) {
    const db = makeDb();
    try {
      const passwordHash = await bcrypt.hash(user.password, 10);
      await db.query(
        'UPDATE `user` SET ' +
        '`first_name` = ?, ' +
        '`last_name` = ?, ' +
        '`password` = ?, ' +
        '`reset_password_token` = ?, ' +
        '`reset_password_expires` = ?, ' +
        '`updated` = ? ' +
        'WHERE `email` = ?'
        , [user.firstName, user.lastName, passwordHash, user.resetPasswordToken, user.resetPasswordExpires, new Date(), user.email]);
    } catch (error) {
      throw error;
    } finally {
      await db.close();
    }
  }

  static async updateUserResetToken(user) {
    const db = makeDb();
    try {
      const passwordHash = await bcrypt.hash(user.password, 10);
      await db.query(
        'UPDATE `user` SET ' +
        '`reset_password_token` = ?, ' +
        '`reset_password_expires` = ?, ' +
        '`updated` = ? ' +
        'WHERE `email` = ?'
        , [user.resetPasswordToken, user.resetPasswordExpires, new Date(), user.email]);
    } catch (error) {
      throw error;
    } finally {
      await db.close();
    }
  }

  static async validatePassword(password, passwordHash) {
    return await bcrypt.compare(password, passwordHash);
  }
}

export default UserService;
