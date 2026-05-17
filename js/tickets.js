function getTicketById(ticketId) {
    const tickets = TicketGo.getAvailableRoutes();
    return tickets.find(t => t.id === ticketId);
}

const queryState = {
    from: '',
    to: '',
    date: '',
    sort: 'price-asc',
    type: 'all'
};

const transportLabels = {
    bus: 'Автобус',
    train: 'Поїзд',
    plane: 'Авіа'
};

function getTransportLabel(type) {
    return transportLabels[type] || type;
}

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

window.handleTicketDetails = function(ticketId) {
    const ticket = getTicketById(ticketId);
    if (!ticket) {
        return alert('Цей маршрут більше недоступний.');
    }

    alert(
        `Маршрут: ${ticket.from} — ${ticket.to}\n` +
        `Дата: ${ticket.date}\n` +
        `Час відправлення: ${ticket.time}\n` +
        `Транспорт: ${getTransportLabel(ticket.transport)}\n` +
        `Ціна: ${ticket.price} ₴`
    );
};

function renderTickets(tickets) {
    const container = document.getElementById('ticket-container');
    if (!container) return;
    setListState(container, LIST_STATES.loading, 'Шукаємо квитки...');
    container.innerHTML = '';

    if (tickets.length === 0) {
        setListState(container, LIST_STATES.empty, 'Квитків не знайдено. Спробуйте змінити фільтри.');
        return;
    }

    setListState(container, LIST_STATES.ready);
    tickets.forEach(ticket => {
        const card = document.createElement('div');
        card.className = 'ticket-card';
        card.innerHTML = `
            <div class="ticket-info">
                <div class="ticket-route">
                    <span>${ticket.from}</span>
                    <span class="ticket-arrow">→</span>
                    <span>${ticket.to}</span>
                </div>
                <div class="ticket-meta">
                    <span>${ticket.date}</span>
                    <span>${ticket.time}</span>
                    <span class="ticket-transport">${getTransportLabel(ticket.transport)}</span>
                </div>
            </div>
            <div class="ticket-price">
                <h2>${ticket.price} ₴</h2>
                <div class="ticket-actions">
                    <button class="details-btn" onclick="handleTicketDetails(${ticket.id})">Детальніше</button>
                    <button class="book-btn" onclick="handleBooking(${ticket.id}, this)">Забронювати</button>
                </div>
            </div>
        `;
        container.appendChild(card);
    });
}

function applyFilters() {
    let result = TicketGo.getAvailableRoutes();

    if (queryState.from) {
        const from = queryState.from.toLowerCase();
        result = result.filter(t => t.from.toLowerCase().includes(from));
    }

    if (queryState.to) {
        const to = queryState.to.toLowerCase();
        result = result.filter(t => t.to.toLowerCase().includes(to));
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
    const fromInput = document.getElementById('from-filter');
    const toInput = document.getElementById('to-filter');
    const dateInput = document.getElementById('date-filter');
    const typeFilter = document.getElementById('type-filter');
    const sortSelect = document.getElementById('sort-select');

    const pSearch = localStorage.getItem('pendingSearch');
    const pFrom = localStorage.getItem('pendingFrom');
    const pTo = localStorage.getItem('pendingTo');
    const pDate = localStorage.getItem('pendingDate');
    const pTransport = localStorage.getItem('pendingTransport');

    if (pFrom || pSearch) {
        queryState.from = pFrom || pSearch;
        if (fromInput) fromInput.value = queryState.from;
        localStorage.removeItem('pendingFrom');
        localStorage.removeItem('pendingSearch');
    }
    if (pTo) {
        queryState.to = pTo;
        if (toInput) toInput.value = pTo;
        localStorage.removeItem('pendingTo');
    }
    if (pDate) {
        queryState.date = pDate;
        if (dateInput) dateInput.value = pDate;
        localStorage.removeItem('pendingDate');
    }
    if (pTransport) {
        queryState.type = pTransport;
        if (typeFilter) typeFilter.value = pTransport;
        localStorage.removeItem('pendingTransport');
    }

    fromInput?.addEventListener('input', e => {
        queryState.from = e.target.value;
        applyFilters();
    });
    toInput?.addEventListener('input', e => {
        queryState.to = e.target.value;
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
    queryState.from = '';
    queryState.to = '';
    queryState.date = '';
    queryState.type = 'all';
    queryState.sort = 'price-asc';
    if (document.getElementById('from-filter')) document.getElementById('from-filter').value = '';
    if (document.getElementById('to-filter')) document.getElementById('to-filter').value = '';
    if (document.getElementById('date-filter')) document.getElementById('date-filter').value = '';
    if (document.getElementById('type-filter')) document.getElementById('type-filter').value = 'all';
    if (document.getElementById('sort-select')) document.getElementById('sort-select').value = 'price-asc';
    applyFilters();
};
