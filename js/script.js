// Популярні напрямки
function renderPopularCards() {
    const popularSources = (typeof TicketGo !== 'undefined' && typeof TicketGo.getPopularDestinations === 'function')
        ? TicketGo.getPopularDestinations()
        : [
            { from: "Київ", to: "Львів", price: "500 ₴" },
            { from: "Київ", to: "Одеса", price: "600 ₴" },
            { from: "Львів", to: "Варшава", price: "1200 ₴" },
            { from: "Дніпро", to: "Київ", price: "450 ₴" }
        ];

    const cardsContainer = document.getElementById('cards-container');
    if (!cardsContainer) return;
    setListState(cardsContainer, LIST_STATES.loading, 'Завантажуємо напрямки...');

    if (popularSources.length === 0) {
        setListState(cardsContainer, LIST_STATES.empty, 'Популярних маршрутів поки що немає.');
        return;
    }

    setListState(cardsContainer, LIST_STATES.ready);
    cardsContainer.innerHTML = popularSources.map(dest => `
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

renderPopularCards();

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
            <a href="contacts.html">Контакти</a>
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
            <a href="contacts.html">Контакти</a>
            <a href="auth.html">Увійти / Реєстрація</a>
        `;
    }
}

// Пошук на головній
document.getElementById('home-search-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    const form = document.getElementById('home-search');
    const fromEl = document.getElementById('home-from');
    const toEl = document.getElementById('home-to');
    const dateEl = document.getElementById('home-date');

    const fromVal = fromEl?.value.trim();
    const toVal = toEl?.value.trim();
    const dateVal = dateEl?.value || '';
        const transportRadio = document.querySelector('input[name="home-transport"]:checked');
        const transportVal = transportRadio?.value || 'bus';

    const validation = validateHomeSearch({ from: fromVal, to: toVal });
    if (!validation.isValid) {
        showErrors(form, validation.errors);
        return;
    }

    clearErrors(form);

    localStorage.setItem('pendingFrom', fromVal);
    localStorage.setItem('pendingTo', toVal);
    if (dateVal) localStorage.setItem('pendingDate', dateVal);
    localStorage.setItem('pendingTransport', transportVal);

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
