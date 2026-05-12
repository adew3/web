// Перемикання між формами
function toggleAuth() {
    const signup = document.getElementById('signup-section');
    const signin = document.getElementById('signin-section');
    signup.style.display = signup.style.display === 'none' ? 'block' : 'none';
    signin.style.display = signin.style.display === 'none' ? 'block' : 'none';
}

const ADMIN_EMAIL = 'admin@ticketgo.com'; // Твій єдиний адмін

// РЕЄСТРАЦІЯ
document.getElementById('signup-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUser = Object.fromEntries(formData.entries());

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Перевірка на пошту адміна
    newUser.role = (newUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) ? 'admin' : 'user';

    if (users.some(u => u.email === newUser.email)) {
        return alert('Цей email вже зареєстрований!');
    }

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('session', JSON.stringify(newUser));
    window.location.href = 'index.html';
});

// ВХІД
document.getElementById('signin-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const loginData = Object.fromEntries(formData.entries());

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === loginData.email && u.password === loginData.password);

    if (user) {
        localStorage.setItem('session', JSON.stringify(user));
        window.location.href = 'index.html';
    } else {
        alert('Невірні дані для входу!');
    }
});