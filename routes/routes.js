const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const SECRET_KEY = 'benim_cok_gizli_anahtarim';

// Kullanıcıların rotalara ekleyebileceği fotoğraflar için Multer ayarı
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads/'));
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});
const upload = multer({ storage });

// Bellekte geçici rota veritabanı
const routesArray = [];

// JWT Token Doğrulama Middleware'i (login.js ile uyumlu)
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'Giriş yapmanız gerekmektedir.' });

    const jwt = require('jsonwebtoken');
    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.status(403).json({ message: 'Oturum geçersiz veya süresi dolmuş.' });
        req.user = user;
        next();
    });
};

// Rota Paylaşma (POST)
router.post('/create', authenticateToken, upload.single('image'), (req, res) => {
    try {
        const { cityId, title, content } = req.body;
        
        const newRoute = {
            id: routesArray.length + 1,
            cityId: parseInt(cityId),
            title,
            content,
            username: req.user.username,
            imageUrl: req.file ? `/uploads/${req.file.filename}` : '',
            likes: 0,
            likedBy: [],
            savedBy: []
        };

        routesArray.push(newRoute);
        res.status(201).json({ message: 'Rotanız başarıyla paylaşıldı!', success: true });
    } catch (error) {
        res.status(500).json({ message: 'Sunucu hatası oluştu.' });
    }
});

// Şehre Ait Rotaları Getirme (GET)
router.get('/city/:cityId', (req, res) => {
    const cityId = parseInt(req.params.cityId);
    const filteredRoutes = routesArray
        .filter(r => r.cityId === cityId)
        .sort((a, b) => b.likes - a.likes); // En çok beğenilen daima en yukarıda kalır
        
    res.json(filteredRoutes);
});

// Beğenme API'si (PUT)
router.put('/like/:id', authenticateToken, (req, res) => {
    const routeId = parseInt(req.params.id);
    const route = routesArray.find(r => r.id === routeId);
    const username = req.user.username;

    if (!route) return res.status(404).json({ message: 'Rota bulunamadı.' });

    if (!route.likedBy.includes(username)) {
        route.likes += 1;
        route.likedBy.push(username);
    } else {
        route.likes -= 1;
        route.likedBy = route.likedBy.filter(u => u !== username);
    }
    res.json(route);
});

// Kaydetme API'si (PUT)
router.put('/save/:id', authenticateToken, (req, res) => {
    const routeId = parseInt(req.params.id);
    const route = routesArray.find(r => r.id === routeId);
    const username = req.user.username;

    if (!route) return res.status(404).json({ message: 'Rota bulunamadı.' });

    if (!route.savedBy.includes(username)) {
        route.savedBy.push(username);
    } else {
        route.savedBy = route.savedBy.filter(u => u !== username);
    }
    res.json({ success: true, savedBy: route.savedBy });
});

module.exports = router;