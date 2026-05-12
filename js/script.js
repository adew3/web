// Популярні напрямки
const popularDestinations = [
    { from: "Київ", to: "Львів", price: "500 ₴" },
    { from: "Київ", to: "Одеса", price: "600 ₴" },
    { from: "Львів", to: "Варшава", price: "1200 ₴" },
    { from: "Дніпро", to: "Київ", price: "450 ₴" }
];

const cardsContainer = document.getElementById('cards-container');
if (cardsContainer) {
    cardsContainer.innerHTML = popularDestinations.map(dest => `
        <div class="card">
            <div class="card-content">
                <div class="card-text">
                    <h3>${dest.from} — ${dest.to}</h3>
                    <p>Найкраща ціна від ${dest.price}</p>
                    <button onclick="window.location.href='tickets.html'">Дивитись</button>
                </div>
                <div class="plane">✈</div>
            </div>
        </div>
    `).join('');
}

// Навігація
function updateNavigation() {
    const session = JSON.parse(localStorage.getItem('session'));
    const nav = document.querySelector('nav') || document.getElementById('main-nav');
    if (!nav) return;
    
    if (session) {
        const adminButton = session.role === 'admin' ? '<a href="admin.html" style="color: #10b981; font-weight: bold;">Адмін-панель</a>' : '';
        nav.innerHTML = `
            <a href="index.html">Головна</a>
            <a href="tickets.html">Квитки</a>
            <a href="bookings.html">Мої бронювання</a>
            ${adminButton}
            <span style="margin-left: 15px; color: #3b82f6;">Привіт, ${session.username}!</span>
            <a href="#" id="sign-out-btn" style="color: #ef4444;">Вийти</a>
        `;
        document.getElementById('sign-out-btn')?.addEventListener('click', () => {
            localStorage.removeItem('session');
            window.location.href = 'index.html';
        });
    } else {
        nav.innerHTML = `
            <a href="index.html">Головна</a>
            <a href="tickets.html">Квитки</a>
            <a href="auth.html">Увійти / Реєстрація</a>
        `;
    }
}

// Пошук на головній
document.getElementById('home-search-btn')?.addEventListener('click', () => {
    const fromVal = document.getElementById('home-from')?.value.trim();
    const toVal = document.getElementById('home-to')?.value.trim();
    const dateVal = document.querySelector('.search-box input[type="date"]')?.value;

    if (toVal || fromVal) localStorage.setItem('pendingSearch', toVal || fromVal);
    if (dateVal) localStorage.setItem('pendingDate', dateVal);

    window.location.href = 'tickets.html';
});

document.addEventListener('DOMContentLoaded', updateNavigation);


window.checkAdminAccess = function() {
    const session = JSON.parse(localStorage.getItem('session'));
    if (!session || session.role !== 'admin') {
        alert('Доступ лише для адміністратора!');
        window.location.href = 'index.html';
    }
};