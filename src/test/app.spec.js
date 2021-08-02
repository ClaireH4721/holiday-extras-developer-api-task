const ls = require('local-storage');
const request = require('supertest');

const { BAD_REQUEST, NOT_FOUND } = require('../main/constants/error');

const app = require('../main/app');

jest.mock('uuid', () => ({ v4: () => 'testId' }));

describe('App', () => {
  let res;
  let server;
  const testUsers = [{
    id: '1',
    email: 'testuser1@test.com',
    givenName: 'test1',
    familyName: 'user1',
    created: '2017-07-31T11:20:59.489Z',
  },
  {
    id: '2',
    email: 'testuser2@test.com',
    givenName: 'test2',
    familyName: 'user2',
    created: '2017-07-29T11:43:59.489Z',
  }];

  beforeEach(() => {
    server = app.listen(3000, () => {});
  });
  afterEach(() => {
    server.close();
  });

  describe('GET /api/users', () => {
    describe('200 SUCCESS', () => {
      beforeAll(async () => {
        ls.set('users', testUsers);

        res = await request(app)
          .get('/api/users');
      });

      it('should respond with 200 status code', () => {
        expect(res.statusCode).toEqual(200);
      });
      it('should respond with body containing users array', () => {
        expect(res.body).toEqual(testUsers);
      });
    });
  });

  describe('POST /api/users', () => {
    describe('200 SUCCESS', () => {
      beforeAll(async () => {
        ls.set('users', testUsers);
        jest.spyOn(global.Date, 'now').mockImplementationOnce(() => new Date('2019-05-14T11:01:58.135Z').valueOf());

        res = await request(app)
          .post('/api/users')
          .send({
            email: 'testuser3@test.com',
            givenName: 'test3',
            familyName: 'user3',
          });
      });

      it('should respond with 200 status code', () => {
        expect(res.statusCode).toEqual(200);
      });
      it('should respond with body containing users array with new user added', () => {
        expect(res.body).toEqual([...testUsers, {
          id: 'testId',
          email: 'testuser3@test.com',
          givenName: 'test3',
          familyName: 'user3',
          created: '2019-05-14T11:01:58.135Z',
        }]);
      });
      it('should update local storage with new user', () => {
        expect(ls.get('users')).toEqual([...testUsers, {
          id: 'testId',
          email: 'testuser3@test.com',
          givenName: 'test3',
          familyName: 'user3',
          created: '2019-05-14T11:01:58.135Z',
        }]);
      });
    });

    describe('400 BAD REQUEST', () => {
      beforeAll(async () => {
        ls.set('users', testUsers);
        jest.spyOn(global.Date, 'now').mockImplementationOnce(() => new Date('2019-05-14T11:01:58.135Z').valueOf());
      });

      describe('Email Format Validation', () => {
        beforeAll(async () => {
          res = await request(app)
            .post('/api/users')
            .send({
              email: 'testuser3@test',
              givenName: 'test3',
              familyName: 'user3',
            });
        });

        it('should respond with 400 status code', () => {
          expect(res.statusCode).toEqual(400);
        });

        it('should respond with BAD_REQUEST email validation error', () => {
          expect(res.body).toEqual({
            ...BAD_REQUEST,
            message: 'Validation error: \"email\" must be a valid email',
          });
        });
      });

      describe('String Validation', () => {
        describe('Non string format e.g. number', () => {
          beforeAll(async () => {
            res = await request(app)
              .post('/api/users')
              .send({
                email: 'testuser3@test.com',
                givenName: 3,
                familyName: 'user3',
              });
          });

          it('should respond with 400 status code', () => {
            expect(res.statusCode).toEqual(400);
          });

          it('should respond with BAD_REQUEST string format validation error', () => {
            expect(res.body).toEqual({
              ...BAD_REQUEST,
              message: 'Validation error: \"givenName\" must be a string',
            });
          });
        });

        describe('Empty String', () => {
          beforeAll(async () => {
            res = await request(app)
              .post('/api/users')
              .send({
                email: 'testuser3@test.com',
                givenName: '',
                familyName: 'user3',
              });
          });

          it('should respond with 400 status code', () => {
            expect(res.statusCode).toEqual(400);
          });

          it('should respond with BAD_REQUEST empty string validation error', () => {
            expect(res.body).toEqual({
              ...BAD_REQUEST,
              message: 'Validation error: \"givenName\" is not allowed to be empty',
            });
          });
        });
      });

      describe('Required Field Validation', () => {
        beforeAll(async () => {
          res = await request(app)
            .post('/api/users')
            .send({
              email: 'testuser3@test.com',
              givenName: 'test3',
            });
        });

        it('should respond with 400 status code', () => {
          expect(res.statusCode).toEqual(400);
        });

        it('should respond with BAD_REQUEST required field validation error', () => {
          expect(res.body).toEqual({
            ...BAD_REQUEST,
            message: 'Validation error: \"familyName\" is required',
          });
        });
      });
    });
  });
  describe('PUT /api/users/:id', () => {
    describe('200 SUCCESS', () => {
      beforeAll(async () => {
        ls.set('users', testUsers);
        jest.spyOn(global.Date, 'now').mockImplementationOnce(() => new Date('2019-05-14T11:01:58.135Z').valueOf());

        res = await request(app)
          .put('/api/users/1')
          .send({
            email: 'testuser3@test.com',
            givenName: 'test3',
            familyName: 'user3',
          });
      });

      it('should respond with 200 status code', () => {
        expect(res.statusCode).toEqual(200);
      });

      it('should respond with body containing updated user', () => {
        expect(res.body).toEqual({
          id: '1',
          email: 'testuser3@test.com',
          givenName: 'test3',
          familyName: 'user3',
          created: '2017-07-31T11:20:59.489Z',
          updated: '2019-05-14T11:01:58.135Z',
        });
      });
      it('should update local storage with new user', () => {
        expect(ls.get('users')).toEqual([{
          id: '1',
          email: 'testuser3@test.com',
          givenName: 'test3',
          familyName: 'user3',
          created: '2017-07-31T11:20:59.489Z',
          updated: '2019-05-14T11:01:58.135Z',
        }, testUsers[1]]);
      });
    });

    describe('400 BAD REQUEST', () => {
      beforeAll(async () => {
        ls.set('users', testUsers);
        jest.spyOn(global.Date, 'now').mockImplementationOnce(() => new Date('2019-05-14T11:01:58.135Z').valueOf());
      });

      describe('Email Format Validation', () => {
        beforeAll(async () => {
          res = await request(app)
            .put('/api/users/1')
            .send({
              email: 'testuser3@test',
              givenName: 'test3',
              familyName: 'user3',
            });
        });

        it('should respond with 400 status code', () => {
          expect(res.statusCode).toEqual(400);
        });

        it('should respond with BAD_REQUEST email validation error', () => {
          expect(res.body).toEqual({
            ...BAD_REQUEST,
            message: 'Validation error: \"email\" must be a valid email',
          });
        });
      });

      describe('String Validation', () => {
        describe('Non string format e.g. number', () => {
          beforeAll(async () => {
            res = await request(app)
              .put('/api/users/1')
              .send({
                email: 'testuser3@test.com',
                givenName: 3,
                familyName: 'user3',
              });
          });

          it('should respond with 400 status code', () => {
            expect(res.statusCode).toEqual(400);
          });

          it('should respond with BAD_REQUEST string format validation error', () => {
            expect(res.body).toEqual({
              ...BAD_REQUEST,
              message: 'Validation error: \"givenName\" must be a string',
            });
          });
        });

        describe('Empty String', () => {
          beforeAll(async () => {
            res = await request(app)
              .put('/api/users/1')
              .send({
                email: 'testuser3@test.com',
                givenName: '',
                familyName: 'user3',
              });
          });

          it('should respond with 400 status code', () => {
            expect(res.statusCode).toEqual(400);
          });

          it('should respond with BAD_REQUEST empty string validation error', () => {
            expect(res.body).toEqual({
              ...BAD_REQUEST,
              message: 'Validation error: \"givenName\" is not allowed to be empty',
            });
          });
        });
      });

      describe('Required Field Validation', () => {
        beforeAll(async () => {
          res = await request(app)
            .put('/api/users/1')
            .send({
              email: 'testuser3@test.com',
              givenName: 'test3',
            });
        });

        it('should respond with 400 status code', () => {
          expect(res.statusCode).toEqual(400);
        });

        it('should respond with BAD_REQUEST required field validation error', () => {
          expect(res.body).toEqual({
            ...BAD_REQUEST,
            message: 'Validation error: \"familyName\" is required',
          });
        });
      });
    });

    describe('404 NOT FOUND', () => {
      beforeAll(async () => {
        ls.set('users', testUsers);

        res = await request(app)
          .put('/api/users/4')
          .send({
            email: 'testuser3@test.com',
            givenName: 'test3',
            familyName: 'user3',
          });
      });

      it('should respond with 400 status code', () => {
        expect(res.statusCode).toEqual(404);
      });

      it('should respond with BAD_REQUEST required field validation error', () => {
        expect(res.body).toEqual({
          ...NOT_FOUND,
          message: 'The user with the given ID was not found.',
        });
      });
    });
  });

  describe('DELETE /api/users/:id', () => {
    describe('200 SUCCESS', () => {
      beforeAll(async () => {
        ls.set('users', testUsers);
        res = await request(app)
          .delete('/api/users/1');
      });

      it('should respond with 200 status code', () => {
        expect(res.statusCode).toEqual(200);
      });

      it('should respond with body containing deleted user', () => {
        expect(res.body).toEqual(testUsers[0]);
      });

      it('should remove deleted user from local storage', () => {
        expect(ls.get('users')).toEqual([testUsers[1]]);
      });
    });

    describe('404 NOT FOUND', () => {
      beforeAll(async () => {
        ls.set('users', testUsers);

        res = await request(app)
          .delete('/api/users/4');
      });

      it('should respond with 400 status code', () => {
        expect(res.statusCode).toEqual(404);
      });

      it('should respond with BAD_REQUEST required field validation error', () => {
        expect(res.body).toEqual({
          ...NOT_FOUND,
          message: 'The user with the given ID was not found.',
        });
      });
    });
  });
});
