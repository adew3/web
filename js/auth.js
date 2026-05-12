// Перемикання між формами
function toggleAuth() {
    const signup = document.getElementById('signup-section');
    const signin = document.getElementById('signin-section');
    signup.style.display = signup.style.display === 'none' ? 'block' : 'none';
    signin.style.display = signin.style.display === 'none' ? 'block' : 'none';
}

// РЕЄСТРАЦІЯ
document.getElementById('signup-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUser = Object.fromEntries(formData.entries());

    // Отримуємо список користувачів з localStorage або створюємо порожній
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));

    // Створюємо сесію
    localStorage.setItem('session', JSON.stringify(newUser));
    window.location.href = 'index.html'; // Редирект
});

// ВХІД
document.getElementById('signin-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const loginData = Object.fromEntries(formData.entries());

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === loginData.email);

    if (user) {
        localStorage.setItem('session', JSON.stringify(user));
        window.location.href = 'index.html';
    } else {
        alert('Користувача не знайдено!');
    }
});