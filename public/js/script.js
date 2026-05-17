const API_URL = 'http://localhost:3000';

const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');
const loginForm = document.getElementById('loginForm');
const messageBox = document.getElementById('message');

if (registerBtn && loginBtn && container) {
    registerBtn.addEventListener('click', () => {
        container.classList.add('active');
    });

    loginBtn.addEventListener('click', () => {
        container.classList.remove('active');
    });
}

if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (response.ok) {
                localStorage.setItem('token', data.token);
                messageBox.innerText = 'Giriş başarılı. Ana sayfaya yönlendiriliyorsunuz...';
                messageBox.className = 'success';

                setTimeout(() => {
                    window.location.href = '/views/home.html';
                }, 700);
            } else {
                messageBox.innerText = data.message || 'Giriş başarısız.';
                messageBox.className = 'error';
            }
        } catch (error) {
            messageBox.innerText = 'Sunucuya bağlanırken hata oluştu.';
            messageBox.className = 'error';
        }
    });
}