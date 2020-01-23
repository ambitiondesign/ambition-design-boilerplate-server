import chai from 'chai';
import chatHttp from 'chai-http';
import bcrypt from 'bcrypt';
import 'chai/register-should';
import app from '../src/index';
import makeDb from '../src/util/database';
import authTest from './AuthControllerTest';
import userTest from './UserControllerTest';

chai.use(chatHttp);
const { expect, should } = chai;

//init db user table
describe('Testing the All Controller endpoints:', () => {
  beforeEach(async () => {
    const db = makeDb();
    await db.query('DELETE FROM `user`');
    await db.query('DELETE FROM `role`');
    await db.query('ALTER TABLE `user` auto_increment 1');
    const passwordHash = await bcrypt.hash("password", 10);
    await db.query('INSERT INTO  `user` (email, password, first_name, last_name, updated, created) VALUES ' + 
    '("admin@test.com", "'+ passwordHash +'", "Admin", "Admin", NOW(), NOW()),'+
    '("test1@test.com", "'+ passwordHash +'", "John", "Doe", NOW(), NOW()),'+
    '("test2@test.com", "'+ passwordHash +'", "Jane", "Doe", NOW(), NOW()),'+
    '("test3@test.com", "'+ passwordHash +'", "James", "Doe", NOW(), NOW())');

    await db.query('INSERT INTO  `role` (user_id, role_type_id) VALUES ' + 
    '(1, 1), (1, 2), (2, 2), (3, 2), (4, 2)');
    await db.close();
  });
  authTest();
  userTest();
});


