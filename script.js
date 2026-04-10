const container = document.getElementById('container');
const registerBtn = document.getElementById('register');
const loginBtn = document.getElementById('login');

registerBtn.addEventListener('click', () => {
    container.classList.add("active");
});

loginBtn.addEventListener('click', () => {
    container.classList.remove("active");
});

const API_URL = 'http://localhost:3000';

const loginForm = document.getElementById('loginForm');
const messageBox = document.getElementById('message');

loginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

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
            messageBox.innerText = 'Giriş başarılı.';
            console.log('Token:', data.token);
        } else {
            messageBox.innerText = data.message;
        }
    } catch (error) {
        console.error('Hata:', error);
        messageBox.innerText = 'Sunucuya bağlanırken hata oluştu.';
    }
});