const express = require("express");
const path = require("path");
const cors = require("cors");

const app = express();

// Global Yapılandırma
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cors());

// --- STATİK KLASÖR TANIMLARI ---
app.use('/public', express.static(path.join(__dirname, 'public')));
app.use('/views', express.static(path.join(__dirname, 'views')));
app.use('/data', express.static(path.join(__dirname, 'data')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- HTML DOSYA YÖNLENDİRMELERİ ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html')); 
});

app.get('/views/city.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'city.html'));
});

app.get('/views/create-route.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'create-route.html'));
});

// --- API VE ROTA ENTEGRASYONLARI ---
// 1. Senin yazdığın rota paylaşım API'leri
const routeApi = require("./routes/routes"); 
app.use("/api/routes", routeApi);

// 2. Arkadaşının login.js içeriğini fonksiyonel olarak buraya bağlıyoruz
// Arkadaşının login.js içindeki express uygulamasını sunucuya dahil etmek için import ediyoruz.
const loginApp = require("./routes/login");
if (typeof loginApp === 'function' || loginApp.handle) {
    app.use("/", loginApp);
}

// Ana sunucuyu tek bir porttan (3000) ayağa kaldırıyoruz
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`================================================================`);
    console.log(`[OK] Seyahat Deneyim Projesi http://localhost:${PORT} adresinde aktif!`);
    console.log(`================================================================`);
});