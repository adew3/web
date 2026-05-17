function getStoredRoutes() {
    return TicketGo.getAvailableRoutes();
}

function saveRoutes(routes) {
    TicketGo.saveAvailableRoutes(routes);
}

function renderRouteList() {
    const list = document.getElementById('route-list');
    const routes = getStoredRoutes();

    if (!list) return;
    setListState(list, LIST_STATES.loading, 'Завантажуємо маршрути...');
    if (routes.length === 0) {
        setListState(list, LIST_STATES.empty, 'Маршрутів поки що немає.');
        return;
    }

    setListState(list, LIST_STATES.ready);
    list.innerHTML = routes.map(route => `
        <div class="admin-route-card">
            <div>
                <strong>${route.from} → ${route.to}</strong>
                <p>Дата: ${route.date} • Час: ${route.time} • Ціна: ${route.price} ₴ • Транспорт: ${route.transport}</p>
            </div>
            <button class="delete-route-btn" onclick="deleteRoute(${route.id})">Видалити</button>
        </div>
    `).join('');
}

function getPopularDestinations() {
    if (typeof TicketGo !== 'undefined' && typeof TicketGo.getPopularDestinations === 'function') {
        return TicketGo.getPopularDestinations();
    }

    const saved = JSON.parse(localStorage.getItem('popularDestinations') || 'null');
    if (Array.isArray(saved)) return saved;

    const defaultPopular = [
        { id: 1, from: 'Київ', to: 'Львів', price: '500 ₴' },
        { id: 2, from: 'Київ', to: 'Одеса', price: '600 ₴' },
        { id: 3, from: 'Львів', to: 'Варшава', price: '1200 ₴' },
        { id: 4, from: 'Дніпро', to: 'Київ', price: '450 ₴' }
    ];
    localStorage.setItem('popularDestinations', JSON.stringify(defaultPopular));
    return defaultPopular;
}

function savePopularDestinations(routes) {
    if (typeof TicketGo !== 'undefined' && typeof TicketGo.savePopularDestinations === 'function') {
        TicketGo.savePopularDestinations(routes);
        return;
    }
    localStorage.setItem('popularDestinations', JSON.stringify(routes));
}

function renderPopularList() {
    const list = document.getElementById('popular-list');
    const popular = getPopularDestinations();

    if (!list) return;
    setListState(list, LIST_STATES.loading, 'Завантажуємо популярні маршрути...');
    if (popular.length === 0) {
        setListState(list, LIST_STATES.empty, 'Популярних маршрутів поки що немає.');
        return;
    }

    setListState(list, LIST_STATES.ready);
    list.innerHTML = popular.map(route => `
        <div class="admin-route-card">
            <div>
                <strong>${route.from} → ${route.to}</strong>
                <p>Ціна: ${route.price}</p>
            </div>
            <button class="delete-route-btn" onclick="deletePopularRoute(${route.id})">Видалити</button>
        </div>
    `).join('');
}

function getContactStatusLabel(status) {
    const labels = {
        new: 'Новий',
        in_progress: 'В роботі',
        done: 'Готово'
    };

    return labels[status] || 'Новий';
}

function getContactTopicLabel(topic) {
    const labels = {
        booking: 'Бронювання',
        payment: 'Оплата',
        refund: 'Повернення',
        other: 'Інше питання'
    };

    return labels[topic] || topic;
}

function escapeHTML(value) {
    return String(value || '')
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#039;');
}

function getNextContactStatus(status) {
    if (status === 'new') return 'in_progress';
    if (status === 'in_progress') return 'done';
    return 'new';
}

function renderContactRequests() {
    const list = document.getElementById('contact-request-list');
    if (!list) return;

    const requests = TicketGo.getContactRequests();
    setListState(list, LIST_STATES.loading, 'Завантажуємо контактні запити...');
    if (requests.length === 0) {
        setListState(list, LIST_STATES.empty, 'Нових контактних запитів поки що немає.');
        return;
    }

    setListState(list, LIST_STATES.ready);
    list.innerHTML = requests.map(request => {
        const status = request.status || 'new';

        return `
        <div class="admin-contact-card ${status === 'new' ? 'is-new' : ''}">
            <div class="admin-contact-main">
                <div>
                    <span class="contact-status status-${status}">${getContactStatusLabel(status)}</span>
                    <strong>${escapeHTML(request.name)}</strong>
                    <p>${escapeHTML(request.email)} • ${getContactTopicLabel(request.topic)} • ${new Date(request.createdAt).toLocaleString('uk-UA')}</p>
                </div>
                <button class="status-toggle-btn" onclick="toggleContactStatus(${request.id})">
                    ${getContactStatusLabel(getNextContactStatus(status))}
                </button>
            </div>
            <p class="admin-contact-message">${escapeHTML(request.message)}</p>
        </div>
    `;
    }).join('');
}

function toggleContactStatus(requestId) {
    const requests = TicketGo.getContactRequests();
    const request = requests.find(item => item.id === requestId);
    if (!request) return;

    request.status = getNextContactStatus(request.status);
    TicketGo.saveContactRequests(requests);
    renderContactRequests();
}

function deletePopularRoute(routeId) {
    const popular = getPopularDestinations().filter(r => r.id !== routeId);
    savePopularDestinations(popular);
    renderPopularList();
}

function addPopularRoute(event) {
    event.preventDefault();
    const data = readForm(event.target);
    const validation = validatePopularRoute(data);

    if (!validation.isValid) {
        showErrors(event.target, validation.errors);
        return;
    }

    const popular = getPopularDestinations();
    const nextId = popular.length > 0 ? Math.max(...popular.map(r => r.id)) + 1 : 1;
    popular.push({ id: nextId, from: data.from.trim(), to: data.to.trim(), price: `${Number(data.price)} ₴` });
    savePopularDestinations(popular);
    renderPopularList();
    event.target.reset();
    clearErrors(event.target);
    alert('Популярний маршрут додано.');
}

function deleteRoute(routeId) {
    const routes = getStoredRoutes().filter(r => r.id !== routeId);
    saveRoutes(routes);
    renderRouteList();
    alert('Маршрут успішно видалено.');
}

function addRoute(event) {
    event.preventDefault();
    const data = readForm(event.target);
    const validation = validateRoute(data);

    if (!validation.isValid) {
        showErrors(event.target, validation.errors);
        return;
    }

    const routes = getStoredRoutes();
    const nextId = routes.length > 0 ? Math.max(...routes.map(r => r.id)) + 1 : 1;

    routes.push({
        id: nextId,
        from: data.from.trim(),
        to: data.to.trim(),
        date: data.date,
        time: data.time,
        price: Number(data.price),
        transport: data.transport
    });

    saveRoutes(routes);
    renderRouteList();
    event.target.reset();
    clearErrors(event.target);
    alert('Новий маршрут додано.');
}

function initAdminPanel() {
    TicketGo.requireAdminAccess();
    document.getElementById('route-form')?.addEventListener('submit', addRoute);
    document.getElementById('popular-form')?.addEventListener('submit', addPopularRoute);
    renderRouteList();
    renderPopularList();
    renderContactRequests();
}

document.addEventListener('DOMContentLoaded', initAdminPanel);
