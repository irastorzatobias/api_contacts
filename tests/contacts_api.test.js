const bcrypt = require('bcrypt');
const supertest = require('supertest');

const app = require('../app');

const { User } = require('../models');
const { Contact } = require('../models');
const db = require('../models');
const { login } = require('./helpers');

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

            const token = await login(api, 'test', 'test');

            await api
                .get('/api/contacts')
                .set('Authorization', `bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /application\/json/);
        });

        it('getAllContacts catch branch', async () => {
            const mock = jest.spyOn(Contact, 'findAll').mockRejectedValue(new Error('test error'));

            const token = await login(api, 'test', 'test');

            await api
                .get('/api/contacts')
                .set('Authorization', `bearer ${token}`)
                .expect(500);

            mock.mockRestore();

        });
    });

    describe('getContactById', () => {
        it('getContactById without token', async () => {
            await api
                .get('/api/contacts/1')
                .expect(401)
                .expect('Content-Type', /application\/json/);
        });

        it('getContactById not found with token', async () => {
            const token = await login(api, 'test', 'test');

            const response = await api
                .get('/api/contacts/1')
                .set('Authorization', `bearer ${token}`)
                .expect('Content-Type', /application\/json/)
                .expect(404);

            expect(response.body.error).toBe('Contact not found');
        });

        it('getContactById with token', async () => {
            const token = await login(api, 'test', 'test');

            await Contact.create({
                userId: 1,
                name: 'pepe',
                phone: '3585329897',
                mail: 'pepe@gmail.com'
            });

            const response = await api
                .get('/api/contacts/1')
                .set('Authorization', `bearer ${token}`)
                .expect(200)
                .expect('Content-Type', /application\/json/);

            expect(response.body.name).toBe('pepe');
        });

        it('getContactById catch branch', async () => {
            const token = await login(api, 'test', 'test');

            const mock = jest.spyOn(Contact, 'findOne').mockRejectedValue(new Error('test error'));

            await api
                .get('/api/contacts/1')
                .set('Authorization', `bearer ${token}`)
                .expect(500)
                .expect('Content-Type', /application\/json/);

            mock.mockRestore();
        });

    });
    describe('createContact', () => {
        it('createContact success', async () => {
            const token = await login(api, 'test', 'test');

            const response = await api
                .post('/api/contacts')
                .set('Authorization', `bearer ${token}`)
                .send({
                    name: 'pepa',
                    phone: '3585329897',
                    mail: ''
                })
                .expect(201);

            expect(response.body.name).toBe('pepa');
        });

        it('createContact missing name', async () => {
            const token = await login(api, 'test', 'test');

            const response = await api
                .post('/api/contacts')
                .set('Authorization', `bearer ${token}`)
                .send({
                    phone: '3585329897',
                    mail: ''
                })
                .expect(400);

            expect(response.body.error).toBe('Missing required fields: name or phone');
        });

        it('createContact missing phone', async () => {
            const token = await login(api, 'test', 'test');

            const response = await api
                .post('/api/contacts')
                .set('Authorization', `bearer ${token}`)
                .send({
                    name: 'tuher',
                    mail: ''
                })
                .expect(400);

            expect(response.body.error).toBe('Missing required fields: name or phone');
        });

        it('createContact existing contact', async () => {
            const token = await login(api, 'test', 'test');

            const response = await api
                .post('/api/contacts')
                .set('Authorization', `bearer ${token}`)
                .send({
                    name: 'pepe',
                    phone: '3585329897',
                    mail: ''
                })
                .expect(409);

            expect(response.body.error).toBe('Contact already exists');
        });

        it('createContact catch branch', async () => {
            const token = await login(api, 'test', 'test');

            const mock = jest.spyOn(Contact, 'create').mockRejectedValue(new Error('test error'));

            await api
                .post('/api/contacts')
                .set('Authorization', `bearer ${token}`)
                .send({
                    name: 'trembolona',
                    phone: '3585329897',
                    mail: ''
                })
                .expect(500);

            mock.mockRestore();
        });
    });

    describe('updateContact', () => {
        it('updateContact success', async () => {
            const token = await login(api, 'test', 'test');

            const updatedUser = await api
                .put('/api/contacts/1')
                .set('Authorization', `bearer ${token}`)
                .send({
                    name: 'pepa',
                })
                .expect(200);

            expect(updatedUser.body.name).toBe('pepa');
        });

        it('updateContact not found', async () => {
            const token = await login(api, 'test', 'test');

            const response = await api
                .put('/api/contacts/737')
                .set('Authorization', `bearer ${token}`)
                .expect(404);

            expect(response.body.error).toBe('Contact not found');

        });

        it('updateContact catch branch', async () => {
            const token = await login(api, 'test', 'test');

            const mock = jest.spyOn(Contact, 'update').mockRejectedValue(new Error('test error'));

            await api
                .put('/api/contacts/1')
                .set('Authorization', `bearer ${token}`)
                .send({
                    name: 'pepa',
                })
                .expect(500);

            mock.mockRestore();
        });
    });

    describe('deleteContact', () => {
        it('deleteContact success', async () => {
            const token = await login(api, 'test', 'test');

            await Contact.create({
                userId: 1,
                name: 'hitler',
                phone: '3585329897'
            });

            await api
                .delete('/api/contacts/3')
                .set('Authorization', `bearer ${token}`)
                .expect(200);


        });

        it('deleteContact not found', async () => {
            const token = await login(api, 'test', 'test');

            const response = await api
                .delete('/api/contacts/737')
                .set('Authorization', `bearer ${token}`)
                .expect(404);

            expect(response.body.error).toBe('Contact not found');

        });

        it('deleteContact catch branch', async () => {
            const token = await login(api, 'test', 'test');

            const mock = jest.spyOn(Contact, 'destroy').mockRejectedValue(new Error('test error'));

            await api
                .delete('/api/contacts/2')
                .set('Authorization', `bearer ${token}`)
                .expect(500);

            mock.mockRestore();
        });
    });


    describe('login', () => {
        it('login username error', async () => {
            const response = await api
                .post('/api/login')
                .send({
                    username: 'dexametasona',
                    password: 'dexametasona'
                })
                .expect(401);

            expect(response.body.error).toBe('invalid username or password');
        });
    });


    describe('createUser', () => {
        it('succcess', async () => {
            const user = {
                username: 'test3',
                password: 'test3'
            };

            const response = await api
                .post('/api/users')
                .send(user)
                .expect(201);

            expect(response.body.username).toBe('test3');
        });

        it('missing data', async () => {
            const user = {
                username: 'test3',
            };

            const response = await api
                .post('/api/users')
                .send(user)
                .expect(400);

            expect(response.body.error).toBe('username or password missing');
        });

        it('username already exists', async () => {
            const user = {
                username: 'test',
                password: 'test'
            };

            const response = await api
                .post('/api/users')
                .send(user)
                .expect(400);

            expect(response.body.error).toBe('username already exists');
        });

        it('password length < 3', async () => {
            const user = {
                username: 'tuhermana',
                password: 'te'
            };

            const response = await api
                .post('/api/users')
                .send(user)
                .expect(400);

            expect(response.body.error).toBe('password is shorter than the minimum allowed length (3)');
        });

        it('catch branch', async () => {
            const user = {
                username: 'test666',
                password: 'test666'
            };

            const mock = jest.spyOn(User, 'create').mockRejectedValue(new Error('test error'));

            await api
                .post('/api/users')
                .send(user)
                .expect(500);

            mock.mockRestore();
        });

        it('getAllUsers success', async () => {
            const response = await api
                .get('/api/users')
                .expect(200);

            expect(response.body.length).toBe(2);
        });

        it('getAllUsers catch branch', async () => {
            const mock = jest.spyOn(User, 'findAll').mockRejectedValue(new Error('test error'));

            await api
                .get('/api/users')
                .expect(500);

            mock.mockRestore();
        });
    });

    afterAll(async () => {
        await thisDb.sequelize.close();
    });
});
