const { findUser, getNewUser, getUpdatedUser } = require('../../main/utils/userUtils');

describe('User Utils', () => {
    describe('findUser()', () => {

        let res;
        const users = [{
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

        describe('user exists', () => {

            beforeAll(() => {
                res = findUser(users, '1');
            });

            it('should return an object', () => {
                expect(res).toBeInstanceOf(Object);
            });

            it('should return an object matching user with id 1', () => {
                expect(res).toEqual(users[0]);
            });
        });

        describe('user does not exist', () => {

            beforeAll(() => {
                res = findUser(users, '100');
            });

            it('should return an object', () => {
                expect(res).not.toBeInstanceOf(Object);
            });

            it('should return an object matching user with id 1', () => {
                expect(res).toBeUndefined()
            });
        });
    });

    describe('getNewUser()', () => {

        let res;
        const body = {
            email: 'testuser3@test.com',
            givenName: 'test3',
            familyName: 'user3'
        };

        beforeAll(() => {
            res = getNewUser(body);
        });

        it('should return an object', () => {
            expect(res).toBeInstanceOf(Object);
        });

        it('should return an object with the correct email', () => {
            expect(res.email).toEqual(body.email);
        });

        it('should return an object with the correct given name', () => {
            expect(res.givenName).toEqual(body.givenName);
        });

        it('should return an object with the correct family name', () => {
            expect(res.familyName).toEqual(body.familyName);
        });

        it('should return an object with an id', () => {
            expect(res.id).toBeDefined();
        });

        it('should return an object with a created time', () => {
            expect(res.created).toBeDefined();
        });
    });

    describe('getUpdatedUser()', () => {
        let res;
        const user = {
            id: '1',
            email: 'testuser1@test.com',
            givenName: 'test1',
            familyName: 'user1',
            created: '2017-07-31T11:20:59.489Z',
        };

        const body = {
            email: 'testuser3@test.com',
            givenName: 'test3',
            familyName: 'user3'
        };

        beforeAll(() => {
            res = getUpdatedUser(user, body);
        });

        it('should return an object', () => {
            expect(res).toBeInstanceOf(Object);
        });

        it('should return an object with the correct email', () => {
            expect(res.email).toEqual(body.email);
        });

        it('should return an object with the correct given name', () => {
            expect(res.givenName).toEqual(body.givenName);
        });

        it('should return an object with the correct family name', () => {
            expect(res.familyName).toEqual(body.familyName);
        });

        it('should return an object with an id matching original user', () => {
            expect(res.id).toEqual(user.id)
        });

        it('should return an object with a created time that matches original user', () => {
            expect(res.created).toEqual(user.created)
        });

        it('should return an object with a updated time', () => {
            expect(res.updated).toBeDefined();
        });
    });
});