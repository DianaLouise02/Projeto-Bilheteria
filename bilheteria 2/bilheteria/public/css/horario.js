document.addEventListener('DOMContentLoaded', () => {
    const timeSlotsContainer = document.getElementById('time-slots');
    const selectedTimeSpan = document.getElementById('selectedTime');
    const confirmButton = document.getElementById('confirmButton');
    const nextButton = document.getElementById('nextButton');
    let selectedTime = null;

    const createTimeSlots = (startHour, endHour, interval) => {
        for (let hour = startHour; hour <= endHour; hour++) {
            for (let minutes = 0; minutes < 60; minutes += interval) {
                const time = new Date(0, 0, 0, hour, minutes);
                const formattedTime = time.toTimeString().slice(0, 5);

                const timeSlotButton = document.createElement('button');
                timeSlotButton.classList.add('time-slot');
                timeSlotButton.textContent = formattedTime;

                timeSlotButton.addEventListener('click', () => {
                    selectedTime = formattedTime;
                    selectedTimeSpan.textContent = selectedTime;
                    confirmButton.classList.remove('hidden');
                });

                timeSlotsContainer.appendChild(timeSlotButton);
            }
        }
    };

    createTimeSlots(10, 18, 20);

    confirmButton.addEventListener('click', () => {
        confirmButton.classList.add('hidden');
        nextButton.classList.remove('hidden');
    });

    nextButton.addEventListener('click', () => {
        alert(`Horário selecionado: ${selectedTime}`);
        // Redirecionar para a próxima página (substitua 'nextpage.html' pelo URL real)
        window.location.href = 'ingresso.html';
    });
});
