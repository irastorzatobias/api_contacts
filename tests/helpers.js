const login = async (api, username, password) => {
    const userData = await api.post('/api/login').send({
        username,
        password,
    });

    return userData.body.token;
};

module.exports = {
    login
};