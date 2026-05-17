// Перемикання між формами
function toggleAuth() {
    const signup = document.getElementById('signup-section');
    const signin = document.getElementById('signin-section');
    signup.style.display = signup.style.display === 'none' ? 'block' : 'none';
    signin.style.display = signin.style.display === 'none' ? 'block' : 'none';
}

const ADMIN_EMAIL = TicketGo.ADMIN_EMAIL;

// Ініціалізація тестових користувачів
function initializeTestUsers() {
    TicketGo.initTestUsers();
}

// Ініціалізуємо при завантаженні сторінки
document.addEventListener('DOMContentLoaded', initializeTestUsers);

// РЕЄСТРАЦІЯ
document.getElementById('signup-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const newUser = Object.fromEntries(formData.entries());
    newUser.email = newUser.email.trim();
    newUser.username = newUser.username.trim();

    const users = TicketGo.getUsers();
    const validation = validateSignup(newUser, users);
    if (!validation.isValid) {
        showErrors(e.target, validation.errors);
        return;
    }
    
    // Перевірка на пошту адміна
    newUser.role = (newUser.email.toLowerCase() === ADMIN_EMAIL.toLowerCase()) ? 'admin' : 'user';

    users.push(newUser);
    TicketGo.saveUsers(users);
    TicketGo.setSession(newUser);
    alert('Акаунт успішно створено!');
    window.location.href = 'index.html';
});

// ВХІД
document.getElementById('signin-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const loginData = Object.fromEntries(formData.entries());
    loginData.email = loginData.email.trim();
    loginData.password = loginData.password.trim();

    const validation = validateSignin(loginData);
    if (!validation.isValid) {
        showErrors(e.target, validation.errors);
        return;
    }

    TicketGo.initTestUsers();
    const users = TicketGo.getUsers();
    const user = users.find(u => 
        u.email.toLowerCase() === loginData.email.toLowerCase() && 
        u.password === loginData.password
    );

    if (user) {
        TicketGo.setSession(user);
        alert('Ви успішно увійшли!');
        window.location.href = 'index.html';
    } else {
        showErrors(e.target, [
            { field: 'email', message: 'Перевірте email або пароль.', source: 'client' },
            { field: 'password', message: 'Перевірте email або пароль.', source: 'client' }
        ]);
    }
});
