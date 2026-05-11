const tickets = [
    { from: "Львів", to: "Київ", price: 450 },
    { from: "Львів", to: "Варшава", price: 900 },
    { from: "Львів", to: "Одеса", price: 600 },
    { from: "Львів", to: "Краків", price: 750 }
];

const container = document.getElementById("cards-container");

tickets.forEach(ticket => {
    const card = document.createElement("div");
    card.classList.add("card");

    // Створення картки з іконкою літака
    card.innerHTML = `
        <div class="card-content">
            <div class="card-text">
                <h3>${ticket.from} → ${ticket.to}</h3>
                <p>Ціна: ${ticket.price} грн</p>
                <button>Переглянути</button>
            </div>
            <div class="plane">✈️</div>
        </div>
    `;

    container.appendChild(card);
});