const request = require('supertest');

const server = require('../server.js'); // Routes
const db = require('../database/dbConfig.js'); // DB

const baseURI = '/api/lender-collection';

describe('lender routes', () => {
  let currBookID = 0;

  // clear db before tests
  beforeAll(async () => {
    await db('lender_collection').truncate();
  });

  // POST
  describe('insert lender book', () => {
    it('add book to DB', async () => {
      await request(server)
        .post(`${baseURI}/`)
        .send({
          google_book_id: 1591984,
          lender_id: 1,
          isbn: 6265581337
        })
        .then(res => {
          currBookID = res.body[0].id;

          expect(res.status).toBe(201);
          expect(res.body).toHaveLength(1);
        });
    });

    it('deny adding book', async () => {
      await request(server)
        .post(`${baseURI}/`)
        .send({
          google_book_id: 1591984
        })
        .then(res => {
          expect(res.status).toBe(500);
        });
    });
  });

  // GET
  describe('return lender books', () => {
    it('get books', async () => {
      await request(server)
        .get(`${baseURI}/1`)
        .then(res => {
          expect(res.status).toBe(200);
          expect(res.body).toHaveLength(1);
        });
    });

    it('return no books', async () => {
      await request(server)
        .get(`${baseURI}/00`)
        .then(res => {
          expect(res.body).toHaveLength(0);
        });
    });
  });

  // PUT
  describe('update lender book status', () => {
    it('change is_available to true', async () => {
      await request(server)
        .put(`${baseURI}/${currBookID}`)
        .then(res => {
          expect(res.body[0].is_available).toBe(true);
        });
    });

    it('book not available', async () => {
      await request(server)
        .put(`${baseURI}/${currBookID + 2}`)
        .then(res => {
          expect(res.status).toBe(404);
        });
    });
  });

  // DELETE
  describe('delete lender book', () => {
    it('deletes book', async () => {
      await request(server)
        .delete(`${baseURI}/${currBookID}`)
        .then(res => {
          expect(res.status).toBe(200);
        });
    });

    it('book not available', async () => {
      await request(server)
        .delete(`${baseURI}/${currBookID + 2}`)
        .then(res => {
          expect(res.status).toBe(404);
        });
    });
  });
})