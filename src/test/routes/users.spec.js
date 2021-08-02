const ls = require('local-storage');

const { BAD_REQUEST, NOT_FOUND } = require('../../main/constants/error');
const {
  createUser, readUsers, updateUser, deleteUser, validateUser,
} = require('../../main/routes/users');

jest.mock('uuid', () => ({ v4: () => 'testId' }));

describe('Users', () => {
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

  describe('createUser()', () => {
    const req = {
      body: {
        email: 'testuser3@test.com',
        givenName: 'test3',
        familyName: 'user3',
      },
    };

    const res = {
      send: jest.fn(),
    };

    beforeAll(() => {
      jest.spyOn(global.Date, 'now').mockImplementationOnce(() => new Date('2019-05-14T11:01:58.135Z').valueOf());
      createUser(req, res);
    });

    it('should have add user to local storage', () => {
      expect(ls.get('users')).toEqual([{
        id: 'testId',
        email: 'testuser3@test.com',
        givenName: 'test3',
        familyName: 'user3',
        created: '2019-05-14T11:01:58.135Z',
      }]);
    });

    it('should call res.send once', () => {
      expect(res.send).toHaveBeenCalledTimes(1);
    });

    it('should call res.send with updated users', () => {
      expect(res.send).toHaveBeenCalledWith([{
        id: 'testId',
        email: 'testuser3@test.com',
        givenName: 'test3',
        familyName: 'user3',
        created: '2019-05-14T11:01:58.135Z',
      }]);
    });
  });

  describe('readUsers()', () => {
    describe('Exsiting users', () => {
      const req = {};

      const res = {
        send: jest.fn(),
      };

      beforeAll(() => {
        ls.remove('users');
        readUsers(req, res);
      });

      it('should call res.send once', () => {
        expect(res.send).toHaveBeenCalledTimes(1);
      });

      it('should call res.send with empty array', () => {
        expect(res.send).toHaveBeenCalledWith([]);
      });
    });

    describe('No exsiting users', () => {
      const req = {};

      const res = {
        send: jest.fn(),
      };

      beforeAll(() => {
        ls.set('users', testUsers);
        readUsers(req, res);
      });

      afterAll(() => {
        ls.remove('users');
      });

      it('should call res.send once', () => {
        expect(res.send).toHaveBeenCalledTimes(1);
      });

      it('should call res.send with array of exicting test users', () => {
        expect(res.send).toHaveBeenCalledWith(testUsers);
      });
    });
  });

  describe('updateUser()', () => {
    describe('User Exists', () => {
      const req = {
        params: {
          id: '1',
        },
        body: {
          email: 'testuser3@test.com',
          givenName: 'test3',
          familyName: 'user3',
        },
      };

      const res = {
        send: jest.fn(),
      };

      beforeAll(() => {
        jest.spyOn(global.Date, 'now').mockImplementationOnce(() => new Date('2019-05-14T11:01:58.135Z').valueOf());
        ls.set('users', testUsers);
        updateUser(req, res);
      });

      afterAll(() => {
        ls.remove('users');
      });

      it('should update user in local storage', () => {
        expect(ls.get('users')).toEqual([{
          id: '1',
          email: 'testuser3@test.com',
          givenName: 'test3',
          familyName: 'user3',
          created: '2017-07-31T11:20:59.489Z',
          updated: '2019-05-14T11:01:58.135Z',
        }, testUsers[1]]);
      });

      it('should call res.send once', () => {
        expect(res.send).toHaveBeenCalledTimes(1);
      });

      it('should call res.send with updated users', () => {
        expect(res.send).toHaveBeenCalledWith({
          id: '1',
          email: 'testuser3@test.com',
          givenName: 'test3',
          familyName: 'user3',
          created: '2017-07-31T11:20:59.489Z',
          updated: '2019-05-14T11:01:58.135Z',
        });
      });
    });

    describe('User Does Not Exist', () => {
      const req = {
        params: {
          id: '1',
        },
        body: {
          email: 'testuser3@test.com',
          givenName: 'test3',
          familyName: 'user3',
        },
      };

      const res = {
        send: jest.fn(),
        status: jest.fn(() => res),
      };

      beforeAll(() => {
        jest.spyOn(global.Date, 'now').mockImplementationOnce(() => new Date('2019-05-14T11:01:58.135Z').valueOf());
        ls.remove('users');
        updateUser(req, res);
      });

      it('should not update user in local storage', () => {
        expect(ls.get('users')).toEqual([]);
      });

      it('should call res.status once', () => {
        expect(res.status).toHaveBeenCalledTimes(1);
      });

      it('should call res.status with 404', () => {
        expect(res.status).toHaveBeenCalledWith(404);
      });

      it('should call res.send once', () => {
        expect(res.send).toHaveBeenCalledTimes(1);
      });

      it('should call res.send with NOT FOUND EXCEPTION', () => {
        expect(res.send).toHaveBeenCalledWith({
          ...NOT_FOUND,
          message: 'The user with the given ID was not found.',
        });
      });
    });
  });

  describe('validateUser()', () => {
    describe('User is Valid', () => {
      const req = {
        body: {
          email: 'testuser3@test.com',
          givenName: 'test3',
          familyName: 'user3',
        },
      };

      const res = {
        send: jest.fn(),
      };

      const next = jest.fn();

      beforeAll(() => {
        validateUser(req, res, next);
      });

      it('should call next once', () => {
        expect(next).toHaveBeenCalledTimes(1);
      });
    });

    describe('User Is Not Valid', () => {
      const req = {
        body: {
          email: 'testuser3@test',
          givenName: 'test3',
          familyName: 'user3',
        },
      };

      const res = {
        send: jest.fn(),
        status: jest.fn(() => res),
      };

      beforeAll(() => {
        validateUser(req, res);
      });

      it('should call res.status once', () => {
        expect(res.status).toHaveBeenCalledTimes(1);
      });

      it('should call res.status with 400', () => {
        expect(res.status).toHaveBeenCalledWith(400);
      });

      it('should call res.send once', () => {
        expect(res.send).toHaveBeenCalledTimes(1);
      });

      it('should call res.send with NOT FOUND EXCEPTION', () => {
        expect(res.send).toHaveBeenCalledWith({
          ...BAD_REQUEST,
          message: 'Validation error: \"email\" must be a valid email',
        });
      });
    });
  });

  describe('deleteUser()', () => {
    describe('User Exists', () => {
      const req = {
        params: {
          id: '1',
        },
        body: {
          email: 'testuser3@test.com',
          givenName: 'test3',
          familyName: 'user3',
        },
      };

      const res = {
        send: jest.fn(),
      };

      beforeAll(() => {
        jest.spyOn(global.Date, 'now').mockImplementationOnce(() => new Date('2019-05-14T11:01:58.135Z').valueOf());
        ls.set('users', testUsers);
        deleteUser(req, res);
      });

      afterAll(() => {
        ls.remove('users');
      });

      it('should delete user in local storage', () => {
        expect(ls.get('users')).toEqual([testUsers[1]]);
      });

      it('should call res.send once', () => {
        expect(res.send).toHaveBeenCalledTimes(1);
      });

      it('should call res.send with updated users', () => {
        expect(res.send).toHaveBeenCalledWith(testUsers[0]);
      });
    });

    describe('User Does Not Exist', () => {
      const req = {
        params: {
          id: '1',
        },
        body: {
          email: 'testuser3@test.com',
          givenName: 'test3',
          familyName: 'user3',
        },
      };

      const res = {
        send: jest.fn(),
        status: jest.fn(() => res),
      };

      beforeAll(() => {
        jest.spyOn(global.Date, 'now').mockImplementationOnce(() => new Date('2019-05-14T11:01:58.135Z').valueOf());
        ls.remove('users');
        deleteUser(req, res);
      });

      it('should not update user in local storage', () => {
        expect(ls.get('users')).toEqual([]);
      });

      it('should call res.status once', () => {
        expect(res.status).toHaveBeenCalledTimes(1);
      });

      it('should call res.status with 404', () => {
        expect(res.status).toHaveBeenCalledWith(404);
      });

      it('should call res.send once', () => {
        expect(res.send).toHaveBeenCalledTimes(1);
      });

      it('should call res.send with NOT FOUND EXCEPTION', () => {
        expect(res.send).toHaveBeenCalledWith({
          ...NOT_FOUND,
          message: 'The user with the given ID was not found.',
        });
      });
    });
  });
});
