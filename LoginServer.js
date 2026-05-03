const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');


const app = express();
app.use(express.json());
app.use(cors());

// Güvenlik anahtarı
const SECRET_KEY = 'benim_cok_gizli_anahtarim'; 

// TEST İÇİN SAHTE VERİTABANI
// Sisteme şifresi "123456" olan "test" adında bir kullanıcı ekliyoruz
const users = [
    {
        id: 1,
        username: "test",
        password: bcrypt.hashSync("123456", 10) // "123456" şifresinin hashlenmiş hali
    }
];

const registerRoutes = require('./routes/register');

app.use('/auth', registerRoutes);

// --- GİRİŞ YAPMA (LOGIN) ENDPOINT'İ (SENİN KISMIN) ---
app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = users.find(u => u.username === username);
        if (!user) {
            return res.status(404).json({ message: 'Kullanıcı bulunamadı.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Hatalı şifre.' });
        }

        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

        res.status(200).json({ message: 'Giriş başarılı.', token });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası.' });
    }
});

// --- TOKEN DOĞRULAMA MIDDLEWARE'İ ---
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; 

    if (!token) return res.status(401).json({ message: 'Erişim reddedildi. Token gerekli.' });

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Geçersiz veya süresi dolmuş token.' });
        req.user = user; 
        next(); 
    });
};

// Sadece token ile erişilebilen korumalı rota
app.get('/profile', authenticateToken, (req, res) => {
    res.json({ 
        message: 'Gizli bilgilere ulaştın! Token başarılı.', 
        user: req.user 
    });
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Login Backend'i http://localhost:${PORT} adresinde çalışıyor.`);
});