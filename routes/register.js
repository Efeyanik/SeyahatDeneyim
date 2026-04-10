const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

// TEST DB (şimdilik fake)
const users = [];

router.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;

        const existingUser = users.find(u => u.username === username);
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
