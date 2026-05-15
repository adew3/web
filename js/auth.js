// Перемикання між формами
function toggleAuth() {
    const signup = document.getElementById('signup-section');
    const signin = document.getElementById('signin-section');
    signup.style.display = signup.style.display === 'none' ? 'block' : 'none';
    signin.style.display = signin.style.display === 'none' ? 'block' : 'none';
}

const ADMIN_EMAIL = 'admin@ticketgo.com'; // Твій єдиний адмін

// Ініціалізація тестових користувачів
function initializeTestUsers() {
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (existingUsers.length === 0) {
        const testUsers = [
            { username: 'Адміністратор', email: 'admin@ticketgo.com', password: '123456', role: 'admin' },
            { username: 'Тестовий користувач', email: 'user@gmail.com', password: '123456', role: 'user' }
        ];
        localStorage.setItem('users', JSON.stringify(testUsers));
    }
}

// Ініціалізуємо при завантаженні сторінки
document.addEventListener('DOMContentLoaded', initializeTestUsers);

// РЕЄСТРАЦІЯ
document.getElementById('signup-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUser = Object.fromEntries(formData.entries());

    // Валідація пароля
    if (!newUser.password || newUser.password.length < 6) {
        return alert('Пароль повинен бути мінімум 6 символів!');
    }

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Перевірка на пошту адміна
    newUser.role = (newUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) ? 'admin' : 'user';

    if (users.some(u => u.email.toLowerCase() === newUser.email.toLowerCase())) {
        return alert('Цей email вже зареєстрований!');
    }

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('session', JSON.stringify(newUser));
    alert('Акаунт успішно створено!');
    window.location.href = 'index.html';
});

// ВХІД
document.getElementById('signin-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const loginData = Object.fromEntries(formData.entries());

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => 
        u.email.toLowerCase() === loginData.email.toLowerCase() && 
        u.password === loginData.password
    );

    if (user) {
        localStorage.setItem('session', JSON.stringify(user));
        alert('Ви успішно увійшли!');
        window.location.href = 'index.html';
    } else {
        console.log('Всі користувачі:', users);
        console.log('Введені дані:', loginData);
        alert('Невірні дані для входу! Перевірте email та пароль.');
    }
});