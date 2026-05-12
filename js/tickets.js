document.addEventListener('DOMContentLoaded', () => {
    const bookButtons = document.querySelectorAll('.book-btn');

    bookButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const session = JSON.parse(localStorage.getItem('session'));

            if (!session) {
                alert('Будь ласка, увійдіть у систему!');
                window.location.href = 'auth.html';
                return;
            }

            // Отримуємо дані про квиток з картки
            const card = e.target.closest('.ticket-card');
            const route = card.querySelector('h3').innerText;
            const details = card.querySelectorAll('p');
            const price = card.querySelector('h2').innerText;

            const newBooking = {
                userEmail: session.email, // Прив'язуємо до конкретного користувача
                id: Date.now(),
                route: route,
                date: details[0].innerText,
                time: details[1].innerText,
                price: price
            };

            // Зберігаємо в загальний список бронювань
            const allBookings = JSON.parse(localStorage.getItem('bookings') || '[]');
            allBookings.push(newBooking);
            localStorage.setItem('bookings', JSON.stringify(allBookings));

            // Візуальний ефект
            e.target.innerText = 'Заброньовано ✓';
            e.target.style.background = '#10b981';
            e.target.disabled = true;
        });
    });
});