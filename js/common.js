window.TicketGo = {
    storageKeys: {
        session: 'session',
        users: 'users',
        availableRoutes: 'availableRoutes',
        popularDestinations: 'popularDestinations',
        bookings: 'bookings',
        contactRequests: 'contactRequests'
    },

    ADMIN_EMAIL: 'admin@ticketgo.com',

    getSession() {
        return JSON.parse(localStorage.getItem(this.storageKeys.session) || 'null');
    },

    setSession(session) {
        localStorage.setItem(this.storageKeys.session, JSON.stringify(session));
    },

    clearSession() {
        localStorage.removeItem(this.storageKeys.session);
    },

    getUsers() {
        return JSON.parse(localStorage.getItem(this.storageKeys.users) || '[]');
    },

    saveUsers(users) {
        localStorage.setItem(this.storageKeys.users, JSON.stringify(users));
    },

    initTestUsers() {
        const defaultUsers = [
            { username: 'Адміністратор', email: this.ADMIN_EMAIL, password: '123456', role: 'admin' },
            { username: 'Тестовий користувач', email: 'user@gmail.com', password: '123456', role: 'user' }
        ];
        const users = this.getUsers();

        defaultUsers.forEach(defaultUser => {
            const userIndex = users.findIndex(user => user.email?.toLowerCase() === defaultUser.email.toLowerCase());

            if (userIndex === -1) {
                users.push(defaultUser);
                return;
            }

            if (defaultUser.email === this.ADMIN_EMAIL) {
                users[userIndex] = { ...users[userIndex], ...defaultUser };
            }
        });

        this.saveUsers(users);
    },

    getAvailableRoutes() {
        const saved = JSON.parse(localStorage.getItem(this.storageKeys.availableRoutes) || 'null');
        if (Array.isArray(saved)) return saved;

        const defaultRoutes = [
            { id: 1, from: 'Київ', to: 'Львів', date: '2026-05-11', time: '14:30', price: 850, transport: 'train' },
            { id: 2, from: 'Одеса', to: 'Варшава', date: '2026-05-15', time: '09:15', price: 2200, transport: 'bus' },
            { id: 3, from: 'Харків', to: 'Прага', date: '2026-05-18', time: '18:45', price: 3100, transport: 'plane' },
            { id: 4, from: 'Дніпро', to: 'Київ', date: '2026-05-12', time: '22:00', price: 450, transport: 'bus' }
        ];

        localStorage.setItem(this.storageKeys.availableRoutes, JSON.stringify(defaultRoutes));
        return defaultRoutes;
    },

    saveAvailableRoutes(routes) {
        localStorage.setItem(this.storageKeys.availableRoutes, JSON.stringify(routes));
    },

    getPopularDestinations() {
        const saved = JSON.parse(localStorage.getItem(this.storageKeys.popularDestinations) || 'null');
        if (Array.isArray(saved)) return saved;

        const defaultPopular = [
            { id: 1, from: 'Київ', to: 'Львів', price: '500 ₴' },
            { id: 2, from: 'Київ', to: 'Одеса', price: '600 ₴' },
            { id: 3, from: 'Львів', to: 'Варшава', price: '1200 ₴' },
            { id: 4, from: 'Дніпро', to: 'Київ', price: '450 ₴' }
        ];

        localStorage.setItem(this.storageKeys.popularDestinations, JSON.stringify(defaultPopular));
        return defaultPopular;
    },

    savePopularDestinations(destinations) {
        localStorage.setItem(this.storageKeys.popularDestinations, JSON.stringify(destinations));
    },

    getBookings() {
        return JSON.parse(localStorage.getItem(this.storageKeys.bookings) || '[]');
    },

    saveBookings(bookings) {
        localStorage.setItem(this.storageKeys.bookings, JSON.stringify(bookings));
    },

    getContactRequests() {
        return JSON.parse(localStorage.getItem(this.storageKeys.contactRequests) || '[]');
    },

    saveContactRequest(payload) {
        const requests = this.getContactRequests();
        const request = {
            id: Date.now(),
            status: 'new',
            createdAt: new Date().toISOString(),
            ...payload
        };

        requests.unshift(request);
        localStorage.setItem(this.storageKeys.contactRequests, JSON.stringify(requests));
        return request;
    },

    saveContactRequests(requests) {
        localStorage.setItem(this.storageKeys.contactRequests, JSON.stringify(requests));
    },

    updateNavigation() {
        const session = this.getSession();
        const nav = document.querySelector('nav') || document.getElementById('main-nav');
        if (!nav) return;

        if (session) {
            const adminButton = session.role === 'admin' ? '<a href="admin.html">Адмін-панель</a>' : '';
            nav.innerHTML = `
                <a href="index.html">Головна</a>
                <a href="tickets.html">Квитки</a>
                <a href="contacts.html">Контакти</a>
                <a href="bookings.html">Мої бронювання</a>
                ${adminButton}
                <span style="margin-left: 15px; color: #3b82f6; font-weight: 600;">Привіт, ${session.username}!</span>
                <a href="#" id="sign-out-btn" style="color: #ef4444; margin-left: 15px;">Вийти</a>
            `;
            document.getElementById('sign-out-btn')?.addEventListener('click', (event) => {
                event.preventDefault();
                this.clearSession();
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
    },

    requireAdminAccess() {
        const session = this.getSession();
        if (!session || session.role !== 'admin') {
            alert('Доступ лише для адміністратора!');
            window.location.href = 'index.html';
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    TicketGo.updateNavigation();
});
