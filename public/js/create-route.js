const form = document.getElementById('routeForm');
const params = new URLSearchParams(window.location.search);
const cityId = params.get('id');
const token = localStorage.getItem('token');

if (!token) {
    alert('Bu sayfaya erişim yetkiniz yok. Lütfen giriş yapın.');
    window.location.href = '/';
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('title', document.getElementById('title').value);
    formData.append('content', document.getElementById('content').value);
    formData.append('cityId', cityId);

    const fileInput = document.getElementById('image').files[0];
    if (fileInput) {
        formData.append('image', fileInput);
    }

    try {
        const response = await fetch('/api/routes/create', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });

        const data = await response.json();
        
        if (response.ok && data.success) {
            alert(data.message);
            window.location.href = `/views/city.html?id=${cityId}`;
        } else {
            alert(data.message);
        }
    } catch (error) {
        alert('Sunucu bağlantısı sırasında hata meydana geldi.');
    }
});