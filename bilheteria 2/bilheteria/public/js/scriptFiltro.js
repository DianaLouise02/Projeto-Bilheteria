document.addEventListener('DOMContentLoaded', (event) => {
    let tickets = [];

    fetch('http://localhost:3001/tickets')
        .then(response => response.json())
        .then(data => {
            tickets = data.tickets;
            displayCards(tickets);
        })
        .catch(error => console.error('Error fetching tickets:', error));

    function displayCards(filteredTickets) {
        const cardContainer = document.getElementById('card-container');
        cardContainer.innerHTML = '';

        filteredTickets.forEach(ticket => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <h3>${ticket.nome}</h3>
                <p>${ticket.descricao}</p>
                <p>Local: ${ticket.local}</p>
                <p>Valor: R$${ticket.valor}</p>
                <p>Data: ${ticket.data}</p>
            `;
            cardContainer.appendChild(card);
        });
    }

    window.filterCards = (tipo) => {
        const filteredTickets = tickets.filter(ticket => ticket.tipo === tipo);
        displayCards(filteredTickets);
    };
});
