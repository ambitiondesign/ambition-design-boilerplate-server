import chai from 'chai';
import chatHttp from 'chai-http';
import 'chai/register-should';
import app from '../src/index';
import makeDb from '../src/util/database';

chai.use(chatHttp);
const { expect, should } = chai;

export default function userTest() {
  //init db user table
  describe('Testing the User endpoints:', () => {
    describe('Testing the getUser endpoints:', () => {
      it('It should get a user.', async () => {
        const user = {
          email: "test1@test.com",
          password : "password"
        }
        // inserting admin user
        let res = await chai.request(app)
        .post('/api/auth/signin')
        .set('Accept', 'application/json')
        .send(user);
    
        expect(res.status).to.equal(200);
        const token = res.body.data.token;

        res = await chai.request(app)
        .get('/api/user/test1@test.com')
        .set("Authorization", "Bearer " + token)
        .set('Accept', 'application/json');

        expect(res.status).to.equal(200);
      });
    
      it('It should not get a user.', async () => {
        const user = {
          email: "admin@test.com",
          password : "password"
        }
        
        // inserting admin user
        let res = await chai.request(app)
        .post('/api/auth/signin')
        .set('Accept', 'application/json')
        .send(user);
    
        expect(res.status).to.equal(200);
        const token = res.body.data.token;

        res = await chai.request(app)
        .get('/api/user/1234567')
        .set("Authorization", "Bearer " + token)
        .set('Accept', 'application/json');

        expect(res.status).to.equal(400);

        res = await chai.request(app)
        .get('/api/user/invalid@test.com')
        .set("Authorization", "Bearer " + token)
        .set('Accept', 'application/json');

        expect(res.status).to.equal(400);
      });

      it('It should not get a user.', async () => {
        const user = {
          email: "test1@test.com",
          password : "password"
        }
        
        // inserting admin user
        let res = await chai.request(app)
        .post('/api/auth/signin')
        .set('Accept', 'application/json')
        .send(user);
    
        expect(res.status).to.equal(200);
        const token = res.body.data.token;

        res = await chai.request(app)
        .get('/api/user/test2@test.com')
        .set("Authorization", "Bearer " + token)
        .set('Accept', 'application/json');

        expect(res.status).to.equal(403);
      });
    });

    describe('Testing the signin endpoints:', () => {
      it('It should update a user.', async () => {
        const user = {
          email: "test1@test.com",
          password : "password",
          firstName: 'Test',
          lastName: 'Update'
        }
        // inserting admin user
        let res = await chai.request(app)
        .post('/api/auth/signin')
        .set('Accept', 'application/json')
        .send(user);
    
        expect(res.status).to.equal(200);
        const token = res.body.data.token;

        res = await chai.request(app)
        .post('/api/user')
        .set("Authorization", "Bearer " + token)
        .set('Accept', 'application/json')
        .send(user);

        expect(res.status).to.equal(200);
      });
    
      it('It should not update a user with admin.', async () => {
        const user = {
          email: "admin@test.com",
          password : "password"
        }
        
        // inserting admin user
        let res = await chai.request(app)
        .post('/api/auth/signin')
        .set('Accept', 'application/json')
        .send(user);
    
        expect(res.status).to.equal(200);
        const token = res.body.data.token;

        const user2 = {
          email: "1234567",
          password : "password",
          firstName: "Test",
          lastName: "Update"
        }
        res = await chai.request(app)
        .post('/api/user')
        .set("Authorization", "Bearer " + token)
        .set('Accept', 'application/json')
        .send(user2);

        expect(res.status).to.equal(400);


        const user3 = {
          email: "invalid@test.com",
          password : "password",
          firstName: "Test",
          lastName: "Update"
        }
        res = await chai.request(app)
        .post('/api/user')
        .set("Authorization", "Bearer " + token)
        .set('Accept', 'application/json')
        .send(user3);

        expect(res.status).to.equal(400);
      });

      it('It should not update a user.', async () => {
        const user = {
          email: "test1@test.com",
          password : "password",
          firstName: 'Test',
          lastName: 'Update'
        }
        
        // inserting admin user
        let res = await chai.request(app)
        .post('/api/auth/signin')
        .set('Accept', 'application/json')
        .send(user);
    
        expect(res.status).to.equal(200);
        const token = res.body.data.token;

        const user2 = {
          email: "test2@test.com",
          password : "password",
          firstName: 'Test',
          lastName: 'Update'
        }

        res = await chai.request(app)
        .post('/api/user/')
        .set("Authorization", "Bearer " + token)
        .set('Accept', 'application/json')
        .send(user2);

        expect(res.status).to.equal(403);
      });
    });
  });
}



