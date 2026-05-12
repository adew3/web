// 1. Дані
const initialTickets = [
    { id: 1, from: "Київ", to: "Львів", date: "11.05.2026", time: "14:30", price: 850, transport: "train" },
    { id: 2, from: "Одеса", to: "Варшава", date: "15.05.2026", time: "09:15", price: 2200, transport: "bus" },
    { id: 3, from: "Харків", to: "Прага", date: "18.05.2026", time: "18:45", price: 3100, transport: "plane" },
    { id: 4, from: "Дніпро", to: "Київ", date: "12.05.2026", time: "22:00", price: 450, transport: "bus" }
];

// 2. Стан фільтрів
const queryState = {
    search: '',
    date: '',
    sort: 'price-asc',
    type: 'all'
};

// 3. Функція бронювання (Глобальна)
window.handleBooking = function(ticketId, buttonElement) {
    const session = JSON.parse(localStorage.getItem('session'));

    if (!session) {
        alert('Будь ласка, увійдіть у систему!');
        window.location.href = 'auth.html';
        return;
    }

    const ticket = initialTickets.find(t => t.id === ticketId);
    const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');

    const newBooking = {
        userEmail: session.email,
        id: Date.now(),
        route: `${ticket.from} — ${ticket.to}`,
        date: ticket.date,
        time: ticket.time,
        price: `${ticket.price} ₴`
    };

    allBookings.push(newBooking);
    localStorage.setItem('bookings', JSON.stringify(allBookings));

    // Візуальне підтвердження
    buttonElement.innerText = 'Заброньовано ✓';
    buttonElement.style.background = '#10b981';
    buttonElement.disabled = true;
};

// 4. Рендер карток
function renderTickets(tickets) {
    const container = document.getElementById('ticket-container');
    if (!container) return;
    container.innerHTML = '';

    if (tickets.length === 0) {
        container.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 50px;">
            <h3>Квитків не знайдено 🔍</h3>
            <p><a href="#" onclick="resetFilters()">Показати всі квитки</a></p>
        </div>`;
        return;
    }

    tickets.forEach(ticket => {
        const card = document.createElement('div');
        card.className = 'ticket-card';
        card.innerHTML = `
            <div class="ticket-info">
                <h3>${ticket.from} → ${ticket.to}</h3>
                <p>Дата: ${ticket.date}</p>
                <p>Час: ${ticket.time} | ${ticket.transport}</p>
            </div>
            <div class="ticket-price">
                <h2>${ticket.price} ₴</h2>
                <button class="book-btn" onclick="handleBooking(${ticket.id}, this)">Забронювати</button>
            </div>
        `;
        container.appendChild(card);
    });
}

// 5. Логіка фільтрації
function applyFilters() {
    let result = [...initialTickets];

    if (queryState.search) {
        const s = queryState.search.toLowerCase();
        result = result.filter(t => t.from.toLowerCase().includes(s) || t.to.toLowerCase().includes(s));
    }

    if (queryState.date) {
        result = result.filter(t => t.date.split('.').reverse().join('-') === queryState.date);
    }

    if (queryState.type !== 'all') {
        result = result.filter(t => t.transport === queryState.type);
    }

    result.sort((a, b) => {
        if (queryState.sort === 'price-asc') return a.price - b.price;
        if (queryState.sort === 'price-desc') return b.price - a.price;
        return 0;
    });

    renderTickets(result);
}

// 6. Слухачі подій
document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const dateInput = document.getElementById('date-filter');
    const typeFilter = document.getElementById('type-filter');
    const sortSelect = document.getElementById('sort-select');

    // Підхоплення даних з головної
    const pSearch = localStorage.getItem('pendingSearch');
    const pDate = localStorage.getItem('pendingDate');

    if (pSearch) { queryState.search = pSearch; if (searchInput) searchInput.value = pSearch; localStorage.removeItem('pendingSearch'); }
    if (pDate) { queryState.date = pDate; if (dateInput) dateInput.value = pDate; localStorage.removeItem('pendingDate'); }

    searchInput?.addEventListener('input', e => { queryState.search = e.target.value; applyFilters(); });
    dateInput?.addEventListener('change', e => { queryState.date = e.target.value; applyFilters(); });
    typeFilter?.addEventListener('change', e => { queryState.type = e.target.value; applyFilters(); });
    sortSelect?.addEventListener('change', e => { queryState.sort = e.target.value; applyFilters(); });

    applyFilters();
});

window.resetFilters = () => {
    queryState.search = ''; queryState.date = ''; queryState.type = 'all';
    if(document.getElementById('search-input')) document.getElementById('search-input').value = '';
    if(document.getElementById('date-filter')) document.getElementById('date-filter').value = '';
    if(document.getElementById('type-filter')) document.getElementById('type-filter').value = 'all';
    applyFilters();
};