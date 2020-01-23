import chai from 'chai';
import chatHttp from 'chai-http';
import 'chai/register-should';
import app from '../src/index';
import makeDb from '../src/util/database';

chai.use(chatHttp);
const { expect, should } = chai;

export default function authTest() {
  //init db user table
  describe('Testing the Authentication endpoints:', () => {
    describe('Testing the signup endpoints:', () => {
      it('It should create a user.', async () => {
        const user = {
          firstName: "Olivia",
          lastName: "Doe",
          email: "test4@test.com",
          password : "password"
        }
        // inserting admin user
        let res = await chai.request(app)
        .post('/api/auth/signup')
        .set('Accept', 'application/json')
        .send(user);
    
        expect(res.status).to.equal(201);
        const data = res.body.data;
        expect(data).to.have.property('user');
        expect(data).to.have.property('token');
      });
    
      it('It should not create a user.', async () => {
        const user = {
            firstName: "John",
            lastName: "Doe",
            email: "test1@test.com",
            password : "password"
        }
        let res = await chai.request(app)
          .post('/api/auth/signup')
          .set('Accept', 'application/json')
          .send(user);
    
        expect(res.status).to.equal(400);

        const user2 = {
          firstName: "John",
          lastName: "Doe",
          email: "123456",
          password : "password"
        }
        res = await chai.request(app)
          .post('/api/auth/signup')
          .set('Accept', 'application/json')
          .send(user2);

        expect(res.status).to.equal(400);
      });
    });

    describe('Testing the signin endpoints:', () => {
      it('It should not signin a user.', async () => {
        const user = {
            email: "invalid@test.com",
            password : "password"
        }
        let res = await chai.request(app)
          .post('/api/auth/signin')
          .set('Accept', 'application/json')
          .send(user);
    
        expect(res.status).to.equal(401);

        const user2 = {
          email: "test1@test.com",
          password : "password4"
        }
        res = await chai.request(app)
          .post('/api/auth/signin')
          .set('Accept', 'application/json')
          .send(user2);

        expect(res.status).to.equal(401);
      });

      it('It should signin a user.', async () => {
        const user = {
            email: "test1@test.com",
            password : "password"
        }
        let res = await chai.request(app)
          .post('/api/auth/signin')
          .set('Accept', 'application/json')
          .send(user);
    
        expect(res.status).to.equal(200);
        const data = res.body.data;
        expect(data).to.have.property('user');
        expect(data).to.have.property('token');
      });
    });

    describe('Testing the passwordChange endpoints:', () => {
      it('It should change the password.', async () => {
        const user = {
            email: "test1@test.com",
            password : "password"
        }
        let res = await chai.request(app)
          .post('/api/auth/signin')
          .set('Accept', 'application/json')
          .send(user);
    
        expect(res.status).to.equal(200);
        const token = res.body.data.token;

        const passwordDetail = {
          email: "test1@test.com", 
          currentPassword: "password", 
          newPassword: "newpassword", 
          verifyPassword: "newpassword"
        }
        res = await chai.request(app)
          .post('/api/auth/password')
          .set("Authorization", "Bearer " + token)
          .set('Accept', 'application/json')
          .send(passwordDetail);

        expect(res.status).to.equal(200);
      });

      it('It should change the password because of admin role.', async () => {
        const user = {
            email: "admin@test.com",
            password : "password"
        }
        let res = await chai.request(app)
          .post('/api/auth/signin')
          .set('Accept', 'application/json')
          .send(user);
    
        expect(res.status).to.equal(200);
        const token = res.body.data.token;

        const passwordDetail = {
          email: "test1@test.com", 
          currentPassword: "password", 
          newPassword: "newpassword", 
          verifyPassword: "newpassword"
        }
        res = await chai.request(app)
          .post('/api/auth/password')
          .set("Authorization", "Bearer " + token)
          .set('Accept', 'application/json')
          .send(passwordDetail);

        expect(res.status).to.equal(200);
      });

      it('It should not change password because current password is wrong.', async () => {
        const user = {
            email: "test1@test.com",
            password : "password"
        }
        let res = await chai.request(app)
          .post('/api/auth/signin')
          .set('Accept', 'application/json')
          .send(user);
    
        expect(res.status).to.equal(200);
        const token = res.body.data.token;

        const passwordDetail = {
          email: "test1@test.com", 
          currentPassword: "password123", 
          newPassword: "newpassword", 
          verifyPassword: "newpassword"
        }
        res = await chai.request(app)
          .post('/api/auth/password')
          .set("Authorization", "Bearer " + token)
          .set('Accept', 'application/json')
          .send(passwordDetail);

        expect(res.status).to.equal(401);
      });

      it('It should not change password because passwords do not match.', async () => {
        const user = {
            email: "test1@test.com",
            password : "password"
        }
        let res = await chai.request(app)
          .post('/api/auth/signin')
          .set('Accept', 'application/json')
          .send(user);
    
        expect(res.status).to.equal(200);
        const token = res.body.data.token;

        const passwordDetail = {
          email: "test1@test.com", 
          currentPassword: "password", 
          newPassword: "newpassword2", 
          verifyPassword: "newpassword1"
        }
        res = await chai.request(app)
          .post('/api/auth/password')
          .set("Authorization", "Bearer " + token)
          .set('Accept', 'application/json')
          .send(passwordDetail);

        expect(res.status).to.equal(400);
      });

      it('It should not change password because user have no authorization.', async () => {
        const user = {
            email: "test1@test.com",
            password : "password"
        }
        let res = await chai.request(app)
          .post('/api/auth/signin')
          .set('Accept', 'application/json')
          .send(user);
    
        expect(res.status).to.equal(200);
        const token = res.body.data.token;

        const passwordDetail = {
          email: "test2@test.com", 
          currentPassword: "password", 
          newPassword: "newpassword2", 
          verifyPassword: "newpassword1"
        }
        res = await chai.request(app)
          .post('/api/auth/password')
          .set("Authorization", "Bearer " + token)
          .set('Accept', 'application/json')
          .send(passwordDetail);

        expect(res.status).to.equal(403);
      });
    });

    describe('Testing the forgot endpoints:', () => {
      it('It should generate reset token.', async () => {
        const user = {
          email: "test1@test.com",
          password : "password"
        }

        let res = await chai.request(app)
          .post('/api/auth/forgot')
          .set('Accept', 'application/json')
          .send(user);

        expect(res.status).to.equal(200);

        res = await chai.request(app)
          .post('/api/auth/signin')
          .set('Accept', 'application/json')
          .send(user);
        
        expect(res.status).to.equal(200);
        const resetToken = res.body.data.user.resetPasswordToken;
        res = await chai.request(app)
          .get('/api/auth/reset/'+resetToken);

        expect(res.status).to.equal(200);
      });

      it('It should not generate reset token.', async () => {
        const user = {
          email: "invalid@test.com",
          password : "password"
        }

        let res = await chai.request(app)
          .post('/api/auth/forgot')
          .set('Accept', 'application/json')
          .send(user);

        expect(res.status).to.equal(400);
      });

      it('It should not validate the reset toekn.', async () => {
        const resetToken = 'invalidResetToken';
        let res = await chai.request(app)
          .get('/api/auth/reset/'+resetToken);

        expect(res.status).to.equal(400);
      })
    });

    describe('Testing the reset endpoints:', () => {
      it('It should reset user password.', async () => {
        const user = {
          email: "test1@test.com",
          password : "password"
        }

        const passwordDetails = {
          newPassword: "password2", 
          verifyPassword: "password2"
        }

        let res = await chai.request(app)
          .post('/api/auth/forgot')
          .set('Accept', 'application/json')
          .send(user);

        expect(res.status).to.equal(200);

        res = await chai.request(app)
          .post('/api/auth/signin')
          .set('Accept', 'application/json')
          .send(user);
        
        expect(res.status).to.equal(200);
        const resetToken = res.body.data.user.resetPasswordToken;

        res = await chai.request(app)
          .post('/api/auth/reset/'+resetToken)
          .set('Accept', 'application/json')
          .send(passwordDetails);

        expect(res.status).to.equal(200);
      });

      it('It should not reset user password.', async () => {
        const user = {
          email: "test1@test.com",
          password : "password"
        }
        const passwordDetails = {
          newPassword: "password2", 
          verifyPassword: "password2"
        }

        let res = await chai.request(app)
          .post('/api/auth/forgot')
          .set('Accept', 'application/json')
          .send(user);

        expect(res.status).to.equal(200);

        res = await chai.request(app)
          .post('/api/auth/signin')
          .set('Accept', 'application/json')
          .send(user);
        
        expect(res.status).to.equal(200);
        const resetToken = res.body.data.user.resetPasswordToken;

        res = await chai.request(app)
          .post('/api/auth/reset/'+resetToken+'123')
          .set('Accept', 'application/json')
          .send(passwordDetails);

        expect(res.status).to.equal(400);
      });
    });
  });
}



