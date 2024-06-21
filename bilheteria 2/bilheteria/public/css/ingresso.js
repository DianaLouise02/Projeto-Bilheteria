document.addEventListener('DOMContentLoaded', () => {
    const selectButtons = document.querySelectorAll('.select-button');
    const selectedTicketSpan = document.getElementById('selectedTicket');
    const confirmButton = document.getElementById('confirmButton');
    const nextButton = document.getElementById('nextButton');
    let selectedTicket = null;

    selectButtons.forEach(button => {
        button.addEventListener('click', () => {
            const ticketOption = button.parentElement;
            const ticketType = ticketOption.querySelector('h2').textContent;
            const ticketPrice = ticketOption.getAttribute('data-price');
            
            selectedTicket = `${ticketType} - R$ ${ticketPrice}`;
            selectedTicketSpan.textContent = selectedTicket;
            confirmButton.classList.remove('hidden');
        });
    });

    confirmButton.addEventListener('click', () => {
        confirmButton.classList.add('hidden');
        nextButton.classList.remove('hidden');
    });

    nextButton.addEventListener('click', () => {
        alert(`Entrada selecionada: ${selectedTicket}`);
        // Redirecionar para a próxima página (substitua 'nextpage.html' pelo URL real)
        window.location.href = 'nextpage.html';
    });
});
