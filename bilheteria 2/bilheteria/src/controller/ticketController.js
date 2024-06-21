const fs = require('fs');
const path = require('path');

const TICKETS_DB = path.join(__dirname, '../database/tickets.json');

function getTicketsData() {
  if (!fs.existsSync(TICKETS_DB)) {
    return { tickets: [] };
  }
  return JSON.parse(fs.readFileSync(TICKETS_DB, 'utf-8'));
}

function saveTicketsData(data) {
  fs.writeFileSync(TICKETS_DB, JSON.stringify(data, null, 2));
}

exports.registerTicket = (req, res) => {
  const { nome, descricao, local, valor, data, tipo } = req.body;
  const imagem = req.file ? req.file.filename : null;

  let ticketsData = getTicketsData();
  const id = ticketsData.tickets.length ? ticketsData.tickets[ticketsData.tickets.length - 1].id + 1 : 1;

  ticketsData.tickets.push({ id, nome, descricao, local, valor, data, tipo, imagem });
  saveTicketsData(ticketsData);

  res.send('Ingresso cadastrado com sucesso!');
};

exports.getTickets = (req, res) => {
  const ticketsData = getTicketsData();
  res.json(ticketsData.tickets);
};

exports.deleteTicket = (req, res) => {
  const { ticketId } = req.params;
  let ticketsData = getTicketsData();
  ticketsData.tickets = ticketsData.tickets.filter(ticket => ticket.id !== parseInt(ticketId));
  saveTicketsData(ticketsData);
  res.send(`Ingresso com ID ${ticketId} foi deletado.`);
};

exports.getTicketById = (req, res) => {
  const { ticketId } = req.params;
  const ticketsData = getTicketsData();
  const ticket = ticketsData.tickets.find(ticket => ticket.id === parseInt(ticketId));

  if (!ticket) {
    return res.status(404).send('Ingresso não encontrado.');
  }

  res.json(ticket);
};

exports.updateTicket = (req, res) => {
  const { id, nome, descricao, local, valor, data, tipo } = req.body;
  let ticketsData = getTicketsData();
  const ticketIndex = ticketsData.tickets.findIndex(ticket => ticket.id === parseInt(id));

  if (ticketIndex === -1) {
    return res.status(400).send('Ingresso não encontrado.');
  }

  const ticket = ticketsData.tickets[ticketIndex];
  ticket.nome = nome || ticket.nome;
  ticket.descricao = descricao || ticket.descricao;
  ticket.local = local || ticket.local;
  ticket.valor = valor || ticket.valor;
  ticket.data = data || ticket.data;
  ticket.tipo = tipo || ticket.tipo;
  if (req.file) {
    ticket.imagem = req.file.filename;
  }

  saveTicketsData(ticketsData);
  res.send(`Ingresso ${id} foi atualizado.`);
};
