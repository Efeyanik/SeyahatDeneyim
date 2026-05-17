const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const users = require('../data/users');
const registerRoutes = require('./register');

const router = express.Router();

const SECRET_KEY = 'benim_cok_gizli_anahtarim';

router.use('/auth', registerRoutes);

router.get('/users-test', (req, res) => {
    res.json(users);
});

router.post('/login', async (req, res) => {
    try {
        const username = req.body.username?.trim();
        const password = req.body.password?.trim();

        const user = users.find(
            u => u.username.toLowerCase() === username.toLowerCase()
        );

        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Hatalı şifre.' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            SECRET_KEY,
            { expiresIn: '1h' }
        );

        res.json({
            message: 'Giriş başarılı.',
            token: token,
            user: {
                id: user.id,
                username: user.username,
                name: user.name
            }
        });

    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
});

// JWT Doğrulama Middleware'i
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Erişim engellendi. Token eksik.' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Geçersiz token.' });
        }

        req.user = user;
        next();
    });
};

router.get('/profile', authenticateToken, (req, res) => {
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    res.json({
        id: user.id,
        username: user.username,
        name: user.name,
        profilePhoto: user.profilePhoto
    });
});

router.put('/profile/name', authenticateToken, (req, res) => {
    const { name } = req.body;

    const user = users.find(u => u.id === req.user.id);

    if (!user) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    user.name = name;

    res.json({
        message: 'İsim güncellendi.',
        name: user.name
    });
});

router.put('/profile/photo', authenticateToken, (req, res) => {
    const { profilePhoto } = req.body;
    const user = users.find(u => u.id === req.user.id);

    if (!user) {
        return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
    }

    user.profilePhoto = profilePhoto;

    res.json({
        message: 'Profil fotoğrafı güncellendi.',
        profilePhoto: user.profilePhoto
    });
});

// Projenin server.js üzerinden tek porttan (3000) çalışabilmesi için uygulamayı dışa aktarıyoruz
module.exports = router;