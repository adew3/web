document.addEventListener('DOMContentLoaded', () => {
    const session = JSON.parse(localStorage.getItem('session'));
    const container = document.getElementById('my-bookings-container');
    setListState(container, LIST_STATES.loading, 'Завантажуємо бронювання...');

    if (!session) {
        setListState(container, LIST_STATES.empty, 'Увійдіть, щоб переглянути бронювання.');
        return;
    }

    const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    // Фільтруємо квитки тільки для поточного email
    const myBookings = allBookings.filter(b => b.userEmail === session.email);

    if (myBookings.length === 0) {
        setListState(container, LIST_STATES.empty, 'У вас поки немає заброньованих квитків.');
    } else {
        setListState(container, LIST_STATES.ready);
        container.innerHTML = '';
        myBookings.forEach(ticket => {
            const card = document.createElement('div');
            card.className = 'ticket-card';
            card.innerHTML = `
                <div class="ticket-info">
                    <h3>${ticket.route}</h3>
                    <p>📅 Дата: ${ticket.date}</p>
                    <p>⏰ Час: ${ticket.time}</p>
                </div>
                <div class="ticket-price">
                    <h2>${ticket.price}</h2>
                    <button class="cancel-btn" onclick="cancelBooking('${ticket.id}')" style="background: #ef4444; color: white; border: none; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: 600;">Скасувати</button>
                </div>
            `;
            container.appendChild(card);
        });
    }
});

// Функція видалення бронювання
function cancelBooking(id) {
    const bookingId = parseInt(id);
    let allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
    allBookings = allBookings.filter(b => b.id !== bookingId);
    localStorage.setItem('bookings', JSON.stringify(allBookings));
    window.location.reload();
}
