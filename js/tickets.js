function getTicketById(ticketId) {
    const tickets = TicketGo.getAvailableRoutes();
    return tickets.find(t => t.id === ticketId);
}

const queryState = {
    search: '',
    date: '',
    sort: 'price-asc',
    type: 'all'
};

window.handleBooking = function(ticketId, buttonElement) {
    const session = TicketGo.getSession();

    if (!session) {
        alert('Будь ласка, увійдіть у систему!');
        window.location.href = 'auth.html';
        return;
    }

    const ticket = getTicketById(ticketId);
    if (!ticket) {
        return alert('Цей маршрут більше недоступний.');
    }

    const allBookings = TicketGo.getBookings();
    const newBooking = {
        userEmail: session.email,
        id: Date.now(),
        route: `${ticket.from} — ${ticket.to}`,
        date: ticket.date,
        time: ticket.time,
        price: `${ticket.price} ₴`
    };

    allBookings.push(newBooking);
    TicketGo.saveBookings(allBookings);

    buttonElement.innerText = 'Заброньовано ✓';
    buttonElement.style.background = '#10b981';
    buttonElement.disabled = true;
};

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

function applyFilters() {
    let result = TicketGo.getAvailableRoutes();

    if (queryState.search) {
        const s = queryState.search.toLowerCase();
        result = result.filter(t => t.from.toLowerCase().includes(s) || t.to.toLowerCase().includes(s));
    }

    if (queryState.date) {
        result = result.filter(t => t.date === queryState.date);
    }

    if (queryState.type !== 'all') {
        result = result.filter(t => t.transport === queryState.type);
    }

    result.sort((a, b) => {
        if (queryState.sort === 'price-asc') return a.price - b.price;
        if (queryState.sort === 'price-desc') return b.price - a.price;
        if (queryState.sort === 'date-asc') return a.date.localeCompare(b.date);
        return 0;
    });

    renderTickets(result);
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const dateInput = document.getElementById('date-filter');
    const typeFilter = document.getElementById('type-filter');
    const sortSelect = document.getElementById('sort-select');

    const pSearch = localStorage.getItem('pendingSearch');
    const pDate = localStorage.getItem('pendingDate');

    if (pSearch) {
        queryState.search = pSearch;
        if (searchInput) searchInput.value = pSearch;
        localStorage.removeItem('pendingSearch');
    }
    if (pDate) {
        queryState.date = pDate;
        if (dateInput) dateInput.value = pDate;
        localStorage.removeItem('pendingDate');
    }

    searchInput?.addEventListener('input', e => {
        queryState.search = e.target.value;
        applyFilters();
    });
    dateInput?.addEventListener('change', e => {
        queryState.date = e.target.value;
        applyFilters();
    });
    typeFilter?.addEventListener('change', e => {
        queryState.type = e.target.value;
        applyFilters();
    });
    sortSelect?.addEventListener('change', e => {
        queryState.sort = e.target.value;
        applyFilters();
    });

    applyFilters();
});

window.resetFilters = () => {
    queryState.search = '';
    queryState.date = '';
    queryState.type = 'all';
    if (document.getElementById('search-input')) document.getElementById('search-input').value = '';
    if (document.getElementById('date-filter')) document.getElementById('date-filter').value = '';
    if (document.getElementById('type-filter')) document.getElementById('type-filter').value = 'all';
    applyFilters();
};
