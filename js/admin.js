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
    if (routes.length === 0) {
        list.innerHTML = '<p style="text-align:center; padding: 30px; background: white; border-radius: 14px; box-shadow: 0 5px 20px rgba(0,0,0,0.05);">Маршрутів поки що немає.</p>';
        return;
    }

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
    if (popular.length === 0) {
        list.innerHTML = '<p style="text-align:center; padding: 30px; background: white; border-radius: 14px; box-shadow: 0 5px 20px rgba(0,0,0,0.05);">Популярних маршрутів поки що немає.</p>';
        return;
    }

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

function deletePopularRoute(routeId) {
    const popular = getPopularDestinations().filter(r => r.id !== routeId);
    savePopularDestinations(popular);
    renderPopularList();
}

function addPopularRoute(event) {
    event.preventDefault();
    const fromValue = document.getElementById('popular-from')?.value.trim();
    const toValue = document.getElementById('popular-to')?.value.trim();
    const priceValue = Number(document.getElementById('popular-price')?.value);

    if (!fromValue || !toValue || !priceValue) {
        return alert('Будь ласка, заповніть усі поля популярного маршруту.');
    }

    const popular = getPopularDestinations();
    const nextId = popular.length > 0 ? Math.max(...popular.map(r => r.id)) + 1 : 1;
    popular.push({ id: nextId, from: fromValue, to: toValue, price: `${priceValue} ₴` });
    savePopularDestinations(popular);
    renderPopularList();
    event.target.reset();
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
    const fromValue = document.getElementById('route-from')?.value.trim();
    const toValue = document.getElementById('route-to')?.value.trim();
    const dateValue = document.getElementById('route-date')?.value;
    const timeValue = document.getElementById('route-time')?.value;
    const priceValue = Number(document.getElementById('route-price')?.value);
    const transportValue = document.getElementById('route-transport')?.value;

    if (!fromValue || !toValue || !dateValue || !timeValue || !priceValue || !transportValue) {
        return alert('Будь ласка, заповніть усі поля.');
    }

    const routes = getStoredRoutes();
    const nextId = routes.length > 0 ? Math.max(...routes.map(r => r.id)) + 1 : 1;

    routes.push({
        id: nextId,
        from: fromValue,
        to: toValue,
        date: dateValue,
        time: timeValue,
        price: priceValue,
        transport: transportValue
    });

    saveRoutes(routes);
    renderRouteList();
    event.target.reset();
    alert('Новий маршрут додано.');
}

function initAdminPanel() {
    TicketGo.requireAdminAccess();
    document.getElementById('route-form')?.addEventListener('submit', addRoute);
    document.getElementById('popular-form')?.addEventListener('submit', addPopularRoute);
    renderRouteList();
    renderPopularList();
}

document.addEventListener('DOMContentLoaded', initAdminPanel);
