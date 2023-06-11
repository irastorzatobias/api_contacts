const bcrypt = require('bcrypt');
const supertest = require('supertest');

const app = require('../app');

const { User } = require('../models');
const { Contact } = require('../models');
const db = require('../models');

const api = supertest(app);

describe('Contact API', () => {
    let thisDb = db;
    beforeAll(async () => {
        await thisDb.sequelize.sync({ force: true });
    });

    describe('getAllContacts', () => {
        it('getAllContacts without token', () => {
            return api
                .get('/api/contacts')
                .expect(401)
                .expect('Content-Type', /application\/json/);
        });



        it('getAllContacts with token', async () => {
            await User.create({
                username: 'test',
                passwordHash: await bcrypt.hash('test', 10),
            });

            const userData = await api.post('/api/login').send({
                username: 'test',
                password: 'test',
            });

            const token = userData.body.token;

            await api
                .get('/api/contacts')
                .set('Authorization', `bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /application\/json/);
        });

        it('getAllContacts catch branch', async () => {
            const mock = jest.spyOn(Contact, 'findAll').mockRejectedValue(new Error('test error'));

            const userData = await api.post('/api/login').send({
                username: 'test',
                password: 'test',
            });

            const token = userData.body.token;

            await api
                .get('/api/contacts')
                .set('Authorization', `bearer ${token}`)
                .expect(500);

            mock.mockRestore();

        });
    });

    afterAll(async () => {
        await thisDb.sequelize.close();
    });
});
