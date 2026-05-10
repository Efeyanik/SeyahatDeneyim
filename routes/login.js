const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const users = require('../data/users');
const registerRoutes = require('./register');

const app = express();

app.use(express.json());
app.use(cors());

const SECRET_KEY = 'benim_cok_gizli_anahtarim';

// REGISTER ROUTE
app.use('/auth', registerRoutes);

// TEST ROUTE
app.get('/users-test', (req, res) => {
    res.json(users);
});

// LOGIN ROUTE
app.post('/login', async (req, res) => {

    try {

        const username = req.body.username.trim();
        const password = req.body.password.trim();

        console.log("Gelen username:", username);
        console.log("Kayıtlı kullanıcılar:", users);

        const user = users.find(
            u =>
                u.username.trim().toLowerCase()
                ===
                username.trim().toLowerCase()
        );

        if (!user) {
            return res.status(404).json({
                message: 'Kullanıcı bulunamadı.'
            });
        }

        const isPasswordValid = await bcrypt.compare(
            password,
            user.password
        );

        if (!isPasswordValid) {
            return res.status(401).json({
                message: 'Hatalı şifre.'
            });
        }

        const token = jwt.sign(
            {
                id: user.id,
                username: user.username
            },
            SECRET_KEY,
            {
                expiresIn: '1h'
            }
        );

        res.status(200).json({
            message: 'Giriş başarılı.',
            token
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: 'Sunucu hatası.'
        });
    }
});

// TOKEN MIDDLEWARE
const authenticateToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];

    const token =
        authHeader &&
        authHeader.split(' ')[1];

    if (!token) {

        return res.status(401).json({
            message: 'Erişim reddedildi. Token gerekli.'
        });

    }

    jwt.verify(token, SECRET_KEY, (err, user) => {

        if (err) {

            return res.status(403).json({
                message: 'Geçersiz veya süresi dolmuş token.'
            });

        }

        req.user = user;

        next();

    });

};

// PROTECTED ROUTE
app.get('/profile', authenticateToken, (req, res) => {

    res.json({
        message: 'Gizli bilgilere ulaştın!',
        user: req.user
    });

});

const PORT = 3000;

app.listen(PORT, () => {

    console.log(
        `Login Backend'i http://localhost:${PORT} adresinde çalışıyor.`
    );

});