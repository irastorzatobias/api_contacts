const bcrypt = require('bcrypt');
const { User } = require('../models');

// La parte de admin podria manejarse en un endpoint diferente, asi no todos pueden crear un admin.
// Sin embargo, el codigo seria exactamente igual, solo que con admin siempre en true.
const createUser = async (req, res) => {
    const { username, password, admin = false } = req.body;

    if(!username || !password){
        return res.status(400).json({ error: 'username or password missing' });
    }

    const checkUser = await User.findOne({ where: { username: username } });

    if (checkUser) {
        return res.status(400).json({ error: 'username already exists' });
    }

    if ( !password || password.length < 3) {
        return res.status(400).json({
            error: 'password is shorter than the minimum allowed length (3)'
        });
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    try {
        const user = await User.create({
            username: username,
            passwordHash: passwordHash,
            admin: admin,
        });

        res.status(201).json(user);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

// No es necesario, es un agregado para no tener que ir a chequear a DBeaver.
const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        res.status(200).json(users);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: error.message });
    }
};

module.exports = { createUser, getAllUsers };