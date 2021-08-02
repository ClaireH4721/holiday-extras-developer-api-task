const { NOT_FOUND, BAD_REQUEST } = require('../../main/constants/error');
const { notFoundError, badRequestError } = require('../../main/utils/errorUtils');

describe('Error Utils', () => {
    describe('notFoundError()', () => {
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res),
        };

        beforeAll(() => {
            notFoundError(res, 'test error');
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
                message: 'test error',
            });
        });
    });

    describe('badRequestError()', () => {
        const res = {
            send: jest.fn(),
            status: jest.fn(() => res),
        };

        beforeAll(() => {
            badRequestError(res, 'test error');
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

        it('should call res.send with BAD REQUEST EXCEPTION', () => {
            expect(res.send).toHaveBeenCalledWith({
                ...BAD_REQUEST,
                message: 'test error',
            });
        });
    });
});