const API_URL = '';

const token = localStorage.getItem('token');

const profilePhoto = document.getElementById('profilePhoto');
const profileName = document.getElementById('profileName');
const profileUsername = document.getElementById('profileUsername');
const newName = document.getElementById('newName');
const updateNameBtn = document.getElementById('updateNameBtn');
const photoInput = document.getElementById('photoInput');
const updatePhotoBtn = document.getElementById('updatePhotoBtn');
const profileMessage = document.getElementById('profileMessage');

if (!token) {
    window.location.href = './index.html';
}

async function loadProfile() {
    const response = await fetch(`${API_URL}/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json();

    if (response.ok) {
    profileName.innerText = data.name || data.username;
    profileUsername.innerText = `@${data.username}`;

    if (data.profilePhoto && data.profilePhoto !== "") {
        profilePhoto.src = data.profilePhoto;
    } else {
        profilePhoto.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
    }
}
}

updateNameBtn.addEventListener('click', async () => {
    const name = newName.value.trim();

    if (!name) {
        profileMessage.innerText = 'İsim boş olamaz.';
        return;
    }

    const response = await fetch(`${API_URL}/profile/name`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ name })
    });

    const data = await response.json();

    if (response.ok) {
        profileName.innerText = data.name;
        profileMessage.innerText = data.message;
    } else {
        profileMessage.innerText = data.message;
    }
});

updatePhotoBtn.addEventListener('click', async () => {
    const file = photoInput.files[0];

    if (!file) {
        profileMessage.innerText = 'Fotoğraf seçmelisin.';
        return;
    }

    const reader = new FileReader();

    reader.onload = async function () {
        const base64Photo = reader.result;

        const response = await fetch(`${API_URL}/profile/photo`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({ profilePhoto: base64Photo })
        });

        const data = await response.json();

        if (response.ok) {
            profilePhoto.src = data.profilePhoto;
            profileMessage.innerText = data.message;
        } else {
            profileMessage.innerText = data.message;
        }
    };

    reader.readAsDataURL(file);
});

loadProfile();