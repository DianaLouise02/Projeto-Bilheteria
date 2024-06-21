document.addEventListener('DOMContentLoaded', () => {
    const orders = [
        {
            id: 1,
            date: '2024-05-20',
            items: ['Item A', 'Item B'],
            total: 'R$ 150,00'
        },
        {
            id: 2,
            date: '2024-06-01',
            items: ['Item C'],
            total: 'R$ 50,00'
        }
    ];

    const orderList = document.getElementById('order-list');

    orders.forEach(order => {
        const listItem = document.createElement('li');

        const orderHeader = document.createElement('div');
        orderHeader.classList.add('order-header');
        orderHeader.innerHTML = `
            <span>Pedido #${order.id}</span>
            <span>${order.date}</span>
        `;

        const orderDetails = document.createElement('div');
        orderDetails.classList.add('order-details');
        orderDetails.innerHTML = `
            <p>Itens: ${order.items.join(', ')}</p>
            <p>Total: ${order.total}</p>
        `;

        listItem.appendChild(orderHeader);
        listItem.appendChild(orderDetails);
        orderList.appendChild(listItem);
    });
});
