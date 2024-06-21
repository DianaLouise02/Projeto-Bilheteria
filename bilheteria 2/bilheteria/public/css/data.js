document.addEventListener('DOMContentLoaded', () => {
    const calendar = document.getElementById('calendar');
    const selectedDaySpan = document.getElementById('selectedDay');
    const confirmButton = document.getElementById('confirmButton');
    const nextButton = document.getElementById('nextButton');
    const today = new Date();
    const months = [
        'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
        'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    let selectedDay = null;

    for (let month = 0; month < 12; month++) {
        const daysInMonth = new Date(today.getFullYear(), month + 1, 0).getDate();
        const monthDiv = document.createElement('div');
        monthDiv.classList.add('month');
        
        const monthTitle = document.createElement('h2');
        monthTitle.textContent = months[month];
        monthDiv.appendChild(monthTitle);
        
        const daysDiv = document.createElement('div');
        daysDiv.classList.add('days');
        
        for (let day = 1; day <= daysInMonth; day++) {
            const dayButton = document.createElement('button');
            dayButton.classList.add('day');
            dayButton.textContent = day;
            
            const date = new Date(today.getFullYear(), month, day);
            if (date < today) {
                dayButton.classList.add('past');
                dayButton.disabled = true;
            } else {
                dayButton.addEventListener('click', () => {
                    selectedDay = `${day} de ${months[month]}`;
                    selectedDaySpan.textContent = selectedDay;
                    confirmButton.classList.remove('hidden');
                });
            }
            
            daysDiv.appendChild(dayButton);
        }
        
        monthDiv.appendChild(daysDiv);
        calendar.appendChild(monthDiv);
    }

    confirmButton.addEventListener('click', () => {
        confirmButton.classList.add('hidden');
        nextButton.classList.remove('hidden');
    });

    nextButton.addEventListener('click', () => {
        alert(`Dia selecionado: ${selectedDay}`);
        // Redirecionar para a próxima página (substitua 'nextpage.html' pelo URL real)
        window.location.href = 'horario.html';
    });
});
