const popularDestinations = [
    { from: "Київ", to: "Львів", price: "500 ₴" },
    { from: "Київ", to: "Одеса", price: "600 ₴" },
    { from: "Львів", to: "Варшава", price: "1200 ₴" },
    { from: "Дніпро", to: "Київ", price: "450 ₴" }
];

const container = document.getElementById('cards-container');

if (container) {
    popularDestinations.forEach(dest => {
        const card = document.createElement('div');
        card.className = 'card';
        card.innerHTML = `
            <div class="card-content">
                <div class="card-text">
                    <h3>${dest.from} — ${dest.to}</h3>
                    <p>Найкраща ціна від ${dest.price}</p>
                    <button>Дивитись</button>
                </div>
                <div class="plane">✈</div>
            </div>
        `;
        container.appendChild(card);
    });
}
function updateNavigation() {
    const session = JSON.parse(localStorage.getItem('session'));
    const nav = document.querySelector('nav');
    
    if (session) {
        // Якщо користувач увійшов
        nav.innerHTML = `
            <a href="index.html">Головна</a>
            <a href="tickets.html">Квитки</a>
            <a href="bookings.html">Мої бронювання</a>
            <span style="margin-left: 25px; font-weight: bold; color: #3b82f6;">Привіт, ${session.username}!</span>
            <a href="#" id="sign-out-btn" style="color: #ef4444;">Вийти</a>
        `;

        document.getElementById('sign-out-btn').addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('session'); // Чистимо сесію
            window.location.reload(); // Оновлюємо сторінку
        });
    } else {
        // Якщо гість
        nav.innerHTML = `
            <a href="index.html">Головна</a>
            <a href="tickets.html">Квитки</a>
            <a href="auth.html">Увійти / Реєстрація</a>
        `;
    }
}

// Викликаємо функцію при завантаженні кожної сторінки
document.addEventListener('DOMContentLoaded', updateNavigation);