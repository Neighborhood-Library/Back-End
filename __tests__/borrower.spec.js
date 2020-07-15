const request = require('supertest');

const server = require('../server.js'); // Routes
const db = require('../database/dbConfig.js'); // DB

const baseURI = '/api/borrower-wishlist';

//TEST ROUTES
describe('Borrower routes', () => {
  let createdRecID = undefined;

  // clear db before tests
  beforeAll(async () => {
    await db('borrower_wishlist').truncate();
  });

  // POST
  describe('insert()', () => {
    it('insert borrower wishlist book', async () => {
      await request(server)
        .post(`${baseURI}/`)
        .send({
          borrower_id: 1,
          google_book_id: "12345",
          isbn: 12345678912345,
          request_to_borrow: true
        })
        .then(async (res) => {
          // save id for delete
          createdRecID = res.body[0].id;

          expect(res.status).toBe(201);
          expect(res.type).toBe('application/json');
        });
    });

    it('return 500', async () => {
      await request(server)
        .post(`${baseURI}/`)
        .send({
          google_book_id: "12345",
          isbn: 12345678912345,
          request_to_borrow: true
        })
        .then(async (res) => {
          expect(res.status).toBe(500);
        });
    });
  });

  // GET
  describe('get()', () => {
    it('return books by borrower', async () => {
      const borrowerID = 1;

      const res = await request(server).get(`${baseURI}/${borrowerID}`);

      expect(res.body).toHaveLength(1);
    });

    it('return blank array', async () => {
      const borrowerID = 0;

      const res = await request(server).get(`${baseURI}/${borrowerID}`);

      expect(res.body).toHaveLength(0);
    })
  });

  // PUT
  describe('put()', () => {
    it('update book request for borrower', async () => {
      await request(server)
        .put(`${baseURI}/${createdRecID}`)
        .then(res => {
          expect(res.body[0].request_to_borrow).toBe(false);
        });
    });

    it('return 404', async () => {
      await request(server)
        .put(`${baseURI}/${createdRecID + 1}`)
        .then(res => {
          expect(res.status).toBe(404);
        });
    });
  });
  
  // DELETE
  describe('delete()', () => {
    it('delete borrower book record', async () => {
      await request(server)
        .del(`${baseURI}/${createdRecID}`)
        .then(async (res) => {
          expect(res.status).toBe(200);
        });
    });

    it('return 500', async () => {
      await request(server)
        .del(`${baseURI}/${createdRecID + 1}`)
        .then(async (res) => {
          expect(res.status).toBe(404);
        });
    });
  });

});