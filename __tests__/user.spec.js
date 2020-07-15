const request = require('supertest');
const bcrypt = require('bcryptjs');

const server = require('../server.js'); // Routes
const db = require('../database/dbConfig.js'); // DB

const userURI = '/api/users';
const authURI = '/auth';

describe('user routes', () => {
  let currUserID = 0;

  // REGISTER
  describe('insert user', () => {
    it('add user', async () => {
      const userName = "testAccount";

      await db('users').insert({
        "user_name": userName,
        "user_email": "testAccount@test.com",
        "user_identity": "tester",
        "user_credential": "testPass"
      });

      const newUser = await db('users').where('user_name', userName);

      await request(server)
        .get(`${userURI}/${newUser[0].id}`)
        .then(res => {
          currUserID = res.body.id;
    
          expect(res.body.user_name).toBe(userName);
        });       
    });
  });

  // PUT
  describe('update user info', () => {
    it('change password', async () => {
      await request(server)
        .put(`${authURI}/${currUserID}`)
        .send({
          user_credential: "newPassword"
        })
        .then(async res => {
          const hashPass = await db('users').where('id', currUserID);

          const newPassword = bcrypt.compareSync("newPassword", hashPass.user_credential);

          expect(res.status).toBe(200);
          expect(newPassword).toBe(true);
        })
        .catch(err => console.log(err.body));
    });
  });

  // DELETE
  describe('delete user', () => {
    it('delete user', async () => {
      await request(server)
        .delete(`${userURI}/${currUserID}`)
        .then(res => {
          expect(res.body.message).toBe('User deleted');
        })

    });
  });
});