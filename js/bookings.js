document.addEventListener('DOMContentLoaded', () => {
    const session = JSON.parse(localStorage.getItem('session'));
    const container = document.getElementById('my-bookings-container');

    if (!session) {
        container.innerHTML = '<p style="text-align:center;">Увійдіть, щоб переглянути бронювання.</p>';
        return;
    }

    const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    // Фільтруємо квитки тільки для поточного email
    const myBookings = allBookings.filter(b => b.userEmail === session.email);

    if (myBookings.length === 0) {
        container.innerHTML = '<p style="text-align:center;">У вас поки немає заброньованих квитків.</p>';
    } else {
        myBookings.forEach(ticket => {
            const card = document.createElement('div');
            card.className = 'ticket-card';
            card.innerHTML = `
                <div class="ticket-info">
                    <h3>${ticket.route}</h3>
                    <p>${ticket.date}</p>
                    <p>${ticket.time}</p>
                </div>
                <div class="ticket-price">
                    <h2>${ticket.price}</h2>
                    <button class="cancel-btn" onclick="cancelBooking(${ticket.id})" style="background: #ef4444;">Скасувати</button>
                </div>
            `;
            container.appendChild(card);
        });
    }
});

// Функція видалення бронювання
function cancelBooking(id) {
    let allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    allBookings = allBookings.filter(b => b.id !== id);
    localStorage.setItem('bookings', JSON.stringify(allBookings));
    window.location.reload(); // Оновлюємо сторінку, щоб видалити картку
}