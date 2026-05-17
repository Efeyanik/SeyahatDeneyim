const params = new URLSearchParams(window.location.search);
const cityId = params.get('id');
const token = localStorage.getItem('token'); 

document.getElementById('createRouteBtn').addEventListener('click', () => {
    if (!token) {
        alert('Rota ekleyebilmek için lütfen önce giriş yapın!');
        window.location.href = '/'; 
    } else {
        window.location.href = `/views/create-route.html?id=${cityId}`;
    }
});

async function renderPage() {
    // 1. data/iller.json dosyasından şehir genel bilgilerini çekiyoruz
    const response = await fetch('/data/iller.json'); 
    const cities = await response.json();
    const city = cities.find(c => c.id == cityId);

    if (city) {
        document.getElementById('city-hero-container').innerHTML = `
            <div class="city-card">
                <img src="${city.image_url}" alt="${city.name}">
                <div class="city-info">
                    <h1>${city.name}</h1>
                    <p>${city.description}</p>
                </div>
            </div>
        `;
    }

    // 2. Şehre ait kullanıcı rotalarını API'den çekip listeliyoruz
    const routesRes = await fetch(`/api/routes/city/${cityId}`);
    const routes = await routesRes.json();
    const grid = document.getElementById('routes-grid');
    grid.innerHTML = '';

    if (routes.length === 0) {
        grid.innerHTML = `<p style="grid-column: 1/-1; text-align:center; color:#666; font-weight:500;">Bu şehre ait henüz bir rota paylaşılmamış. İlk paylaşan sen ol!</p>`;
        return;
    }

    let loggedInUser = "";
    if (token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            loggedInUser = JSON.parse(window.atob(base64)).username;
        } catch(e) { console.log("Token decode hatası"); }
    }

    routes.forEach(route => {
        const hasLiked = route.likedBy.includes(loggedInUser);
        const hasSaved = route.savedBy.includes(loggedInUser);

        grid.innerHTML += `
            <div class="route-card">
                ${route.imageUrl ? `<img src="${route.imageUrl}">` : ''}
                <div class="route-body">
                    <span class="route-meta"><i class="fa-solid fa-user"></i> @${route.username}</span>
                    <h3>${route.title}</h3>
                    <p>${route.content}</p>
                </div>
                <div class="route-footer">
                    <button class="interaction-btn ${hasLiked ? 'active-like' : ''}" onclick="likeRoute(${route.id})">
                        <i class="fa-solid fa-heart"></i> <span>${route.likes}</span>
                    </button>
                    <button class="interaction-btn ${hasSaved ? 'active-save' : ''}" onclick="saveRoute(${route.id})">
                        <i class="fa-solid fa-bookmark"></i> <span>${hasSaved ? 'Kaydedildi' : 'Kaydet'}</span>
                    </button>
                </div>
            </div>
        `;
    });
}

async function likeRoute(id) {
    if (!token) return alert('Rotaları beğenmek için giriş yapmalısınız!');
    await fetch(`/api/routes/like/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    renderPage();
}

async function saveRoute(id) {
    if (!token) return alert('Rotaları kaydetmek için giriş yapmalısınız!');
    await fetch(`/api/routes/save/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    renderPage();
}

renderPage();