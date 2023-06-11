const { info, error } = require('../utils/logger');

describe('info and error functions', () => {
    let originalEnv;

    beforeEach(() => {
        originalEnv = process.env.NODE_ENV;
        global.console = {
            log: jest.fn(),
            error: jest.fn(),
        };
    });

    afterEach(() => {
        process.env.NODE_ENV = originalEnv;
        jest.restoreAllMocks();
    });

    it('should console.log when NODE_ENV is not test', () => {
        process.env.NODE_ENV = 'development';
        info('info');
        expect(console.log).toHaveBeenCalledWith('info');
    });

    it('should not console.log when NODE_ENV is test', () => {
        process.env.NODE_ENV = 'test';
        info('info');
        expect(console.log).not.toHaveBeenCalled();
    });

    it('should console.error when NODE_ENV is not test', () => {
        process.env.NODE_ENV = 'development';
        error('error');
        expect(console.error).toHaveBeenCalledWith('error');
    });

    it('should not console.error when NODE_ENV is test', () => {
        process.env.NODE_ENV = 'test';
        error('error');
        expect(console.error).not.toHaveBeenCalled();
    });
});
