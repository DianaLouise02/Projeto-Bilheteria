document.addEventListener('DOMContentLoaded', () => {
    let tickets = [];

    // Função para buscar ingressos do servidor
    fetch('http://localhost:3001/tickets')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro na resposta do servidor');
            }
            return response.json();
        })
        .then(data => {
            console.log('Dados recebidos do servidor:', data);
            if (!Array.isArray(data)) {
                throw new Error('Formato de dados inválido');
            }
            tickets = data;
            displayCards(tickets);
        })
        .catch(error => console.error('Erro ao buscar os dados:', error));

    // Função para exibir os ingressos na tela
    function displayCards(filteredTickets) {
        const cardContainer = document.getElementById('card-container');
        cardContainer.innerHTML = '';

        filteredTickets.forEach(ticket => {
            const card = document.createElement('div');
            card.classList.add('card');
          
            const cardContent = `
            
                <h1 class="titulo">${ticket.nome}</h1>
                <p class="descricao"><strong>Descrição:</strong> ${ticket.descricao}</p>
                <p class="local"><strong>Local:</strong> ${ticket.local}</p>
                <p class="valor"><strong>Valor:</strong> R$${ticket.valor}</p>
                <p class="data"><strong>Data:</strong> ${ticket.data}</p>
                <p class="tipo"><strong>Tipo:</strong> ${ticket.tipo}</p>
                <div class="card-options">
                    <button class="delete-btn">Excluir</button>
                    <button class="update-btn">Atualizar</button>
                </div>
            `;

            card.innerHTML = cardContent;

            if (ticket.imagem) {
                const img = document.createElement('img');
                img.src = `http://localhost:3001/uploads/${ticket.imagem}`;
                img.alt = ticket.nome;
                img.classList.add('ticket-image');
                img.style.width = '100%';
                

                card.insertBefore(img, card.firstChild);
                console.log('Imagem adicionada:', img);
            }

            // Event listener for delete button
            card.querySelector('.delete-btn').addEventListener('click', () => {
                if (confirm('Você deseja excluir esse ticket?')) {
                    deleteTicket(ticket.id);
                }
            });

            // Event listener for update button
            card.querySelector('.update-btn').addEventListener('click', () => {
                console.log('Botão atualizar clicado para o ticket:', ticket);
                updateTicket(ticket.id);
            });

            cardContainer.appendChild(card);
        });
    }

    // Função para deletar um ingresso
    function deleteTicket(ticketId) {
        fetch(`http://localhost:3001/tickets/${ticketId}`, {
            method: 'DELETE'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao excluir o ticket');
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            alert('Ticket excluído com sucesso');
            location.reload(); 
        })
        .catch(error => console.error('Erro ao excluir o ticket:', error));
    }

    // Função para atualizar um ingresso
    function updateTicket(ticketId) {
        fetch(`http://localhost:3001/tickets/${ticketId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar os dados do ticket');
                }
                return response.json();
            })
            .then(ticketData => {
                console.log('Dados do ticket a serem atualizados:', ticketData);
                const updateForm = document.createElement('form');
                updateForm.innerHTML = `
                    <style>
            
            </style>
                    <div class="container">
                        <h2>Atualizar Ingresso</h2>
                        <div class="form-group">
                            <label for="update-nome">Nome:</label>
                            <input type="text" id="update-nome" name="update-nome" value="${ticketData.nome}" required>
                        </div>
                        <div class="form-group">
                            <label for="update-descricao">Descrição:</label>
                            <input type="text" id="update-descricao" name="update-descricao" value="${ticketData.descricao}" required>
                        </div>
                        <div class="form-group">
                            <label for="update-local">Local:</label>
                            <input type="text" id="update-local" name="update-local" value="${ticketData.local}" required>
                        </div>
                        <div class="form-group">
                            <label for="update-valor">Valor:</label>
                            <input type="number" id="update-valor" name="update-valor" value="${ticketData.valor}" step="0.01" required>
                        </div>
                        <div class="form-group">
                            <label for="update-data">Data:</label>
                            <input type="date" id="update-data" name="update-data" value="${ticketData.data}" required>
                        </div>
                        <div class="form-group">
                            <label for="update-tipo">Tipo:</label>
                            <select id="update-tipo" name="update-tipo" required>
                                <option value="">Selecione</option>
                                <option value="show" ${ticketData.tipo === 'Show' ? 'selected' : ''}>Show</option>
                                <option value="exposições" ${ticketData.tipo === 'Exposições' ? 'selected' : ''}>Exposições</option>
                                <option value="esportes" ${ticketData.tipo === 'Esportes' ? 'selected' : ''}>Esportes</option>
                            </select>
                        </div>
                        <button type="submit">Atualizar</button>
                    </div>
                `;

                updateForm.addEventListener('submit', event => {
                    event.preventDefault();
                    const updatedData = {
                        id: ticketId, 
                        nome: document.getElementById('update-nome').value,
                        descricao: document.getElementById('update-descricao').value,
                        local: document.getElementById('update-local').value,
                        valor: document.getElementById('update-valor').value,
                        data: document.getElementById('update-data').value,
                        tipo: document.getElementById('update-tipo').value
                    };

                    console.log('Dados atualizados enviados para o servidor:', updatedData);

                    fetch(`http://localhost:3001/tickets/${ticketId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedData)
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Erro ao atualizar o ingresso');
                        }
                        return response.text(); 
                    })
                    .then(data => {
                        try {
                            const jsonData = JSON.parse(data); 
                            alert('Ingresso atualizado com sucesso');
                            location.reload(); 
                        } catch (e) {
                            console.error('Resposta não é um JSON válido:', data);
                            alert('Ingresso atualizado com sucesso');
                            location.reload(); 
                        }
                    })
                    .catch(error => console.error('Erro ao atualizar o ingresso:', error));
                });

                const cardContainer = document.getElementById('card-container');
                cardContainer.innerHTML = ''; 
                cardContainer.appendChild(updateForm); 
            })
            .catch(error => console.error('Erro ao buscar os dados do ticket:', error));
    }

    window.filterCards = (tipo) => {
        const filteredTickets = tickets.filter(ticket => ticket.tipo === tipo);
        displayCards(filteredTickets);
    };

    document.querySelectorAll('.section').forEach(section => {
        section.addEventListener('click', () => {
            const tipo = section.getAttribute('data-type');
            filterCards(tipo);
        });
    });
});
