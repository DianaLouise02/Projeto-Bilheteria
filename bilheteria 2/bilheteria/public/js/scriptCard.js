document.addEventListener('DOMContentLoaded', () => {
    const cardContainer = document.getElementById('card-container');
  
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
  
        data.forEach(ticket => {
          console.log('Processando ticket:', ticket);
  
          const card = document.createElement('div');
          card.classList.add('card');
          card.style.cursor = 'pointer';
  
          // Montar o conteúdo do card
          let cardContent = `
            <h1 class="titulo">${ticket.nome}</h1>
            <p class="descricao"><strong>Descrição:</strong> ${ticket.descricao}</p>
            <p class="local"><strong>Local:</strong> ${ticket.local}</p>
            <p class="valor"><strong>Valor:</strong> R$${ticket.valor}</p>
            <p class="data"><strong>Data:</strong> ${ticket.data}</p>
            <p class="tipo"><strong>Tipo:</strong> ${ticket.tipo}</p>
          `;
  
          card.innerHTML = cardContent;
          console.log('Card HTML antes da imagem:', card.innerHTML);
  
          // Adicionar a imagem separadamente
          if (ticket.imagem) {
            const img = document.createElement('img');
            img.src = `http://localhost:3001/uploads/${ticket.imagem}`;
            img.alt = ticket.nome;
            img.classList.add('ticket-image');
            img.style.width = '100%';
            card.insertBefore(img, card.firstChild);
            console.log('Imagem adicionada:', img);
          }
  
          console.log('Card HTML final:', card.innerHTML);
  
          card.addEventListener('click', () => {
            if (confirm('Você deseja comprar esse ingresso?')) {
              const quantidade = prompt('Digite a quantidade de ingressos:');
              if (quantidade && !isNaN(quantidade) && quantidade > 0) {
                const userEmail = prompt('Digite seu email:');
                fetch('http://localhost:3001/addTicketToPedidos', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({ userEmail, ticketId: ticket.id, quantidade: parseInt(quantidade, 10) })
                })
                .then(response => {
                  if (!response.ok) {
                    throw new Error('Erro ao adicionar o ingresso aos pedidos');
                  }
                  return response.json();
                })
                .then(data => {
                  alert('Ingresso adicionado aos pedidos com sucesso');
                  console.log(data);
                })
                .catch(error => console.error('Erro ao adicionar o ingresso aos pedidos:', error));
              } else {
                alert('Quantidade inválida');
              }
            }
          });
  
          cardContainer.appendChild(card);
        });
      })
      .catch(error => console.error('Erro ao buscar os dados:', error));
  });
  