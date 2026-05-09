const express = require('express');
const bcrypt = require('bcryptjs');
const users = require('../data/users');

const router = express.Router();

router.post('/register', async (req, res) => {
    try {
        const username = req.body.username.trim();
        const password = req.body.password.trim();

       const user = users.find(
    u => u.username.trim().toLowerCase() === username.trim().toLowerCase()
);

        if (existingUser) {
            return res.status(400).json({ message: "Kullanıcı zaten var." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = {
            id: users.length + 1,
            username,
            password: hashedPassword
        };

        users.push(newUser);

        res.status(201).json({ message: "Kayıt başarılı." });

    } catch (error) {
        res.status(500).json({ message: "Sunucu hatası." });
    }
});

module.exports = router;