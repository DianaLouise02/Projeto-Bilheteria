const fs = require('fs');
const path = require('path');

const DATABASE = path.join(__dirname, '../database/users.json');
const TICKETS_DB = path.join(__dirname, '../database/tickets.json');

function getTicketsData() {
  if (!fs.existsSync(TICKETS_DB)) {
    return { tickets: [] };
  }
  return JSON.parse(fs.readFileSync(TICKETS_DB, 'utf-8'));
}

function getDbData() {
  return JSON.parse(fs.readFileSync(DATABASE, 'utf-8'));
}

function saveDbData(data) {
  fs.writeFileSync(DATABASE, JSON.stringify(data, null, 2));
}

function findPedidoById(pedidoId, dbData, userEmail) {
  const user = dbData.users.find(user => user.email === userEmail);
  if (!user || !user.pedidos) {
    return null;
  }
  return user.pedidos.find(pedido => pedido.id === pedidoId);
}

exports.getDbData = getDbData;
exports.saveDbData = saveDbData;
exports.getTicketsData = getTicketsData;
exports.findPedidoById = findPedidoById;

exports.register = (req, res) => {
  const { nome, sobrenome, documento, email, nDocumento, genero, senha, telefone, nascimento } = req.body;

  let dbData = getDbData();
  const userExists = dbData.users.some(user => user.email === email);
  if (userExists) {
    return res.status(400).send('Email já cadastrado.');
  }

  const id = dbData.users.length ? dbData.users[dbData.users.length - 1].id + 1 : 1;

  dbData.users.push({
    id,
    nome,
    sobrenome,
    documento,
    email,
    nDocumento,
    genero,
    senha,
    telefone,
    nascimento,
  });
  saveDbData(dbData);

  res.send('Usuário registrado com sucesso.');
};

exports.login = (req, res) => {
  const { email, senha } = req.body;
  const dbData = getDbData();
  const user = dbData.users.find(user => user.email === email);

  if (user && user.senha === senha) {
    req.session.userEmail = user.email;
    return res.status(200).json({ message: 'Login bem-sucedido', email: user.email, redirectUrl: '/logado' });
  }

  res.status(400).json({ message: 'Email ou senha inválidos.' });
};

exports.dashboard = (req, res) => {
  if (!req.session.userEmail) {
    return res.redirect('/inicio');
  }
  const dbData = getDbData();
  const user = dbData.users.find(user => user.email === req.session.userEmail);
  res.send(`Logado, ${user.nome}! Bem-vindo ao sistema.`);
};

exports.logout = (req, res) => {
  req.session.destroy();
  res.send('Sua sessão foi expirada.');
};

exports.getUsers = (req, res) => {
  const { email } = req.query;
  const dbData = getDbData();

  const user = dbData.users.find(user => user.email === email);

  if (!user) {
    return res.status(404).json({ message: 'Usuário não encontrado.' });
  }

  res.json(user);
};

exports.getUsersGeral = (req, res) => {
  const dbData = getDbData();
  res.json(dbData.users);
};

exports.deleteUser = (req, res) => {
  const { email } = req.body;
  let dbData = getDbData();
  dbData.users = dbData.users.filter(user => user.email !== email);
  saveDbData(dbData);
  res.send(`Usuário com email ${email} foi deletado.`);
};

exports.updateUser = (req, res) => {
  const { email, nome, sobrenome, documento, nDocumento, genero, senha, telefone, nascimento } = req.body;
  let dbData = getDbData();
  const userIndex = dbData.users.findIndex(user => user.email === email);

  if (userIndex === -1) {
    return res.status(400).json({ message: 'Usuário não encontrado.' });
  }

  const user = dbData.users[userIndex];
  user.nome = nome || user.nome;
  user.sobrenome = sobrenome || user.sobrenome;
  user.documento = documento || user.documento;
  user.nDocumento = nDocumento || user.nDocumento;
  user.genero = genero || user.genero;
  user.senha = senha || user.senha;
  user.telefone = telefone || user.telefone;
  user.nascimento = nascimento || user.nascimento;

  saveDbData(dbData);

  res.json({ message: `Usuário com email ${email} foi atualizado.` });
};

exports.addTicketToPedidos = (req, res) => {
  const { userEmail, ticketId, quantidade } = req.body;
  let dbData = getDbData();
  let ticketsData = getTicketsData();
  const userIndex = dbData.users.findIndex(user => user.email === userEmail);
  if (userIndex === -1) {
    return res.status(400).send('Usuário não encontrado.');
  }

  const ticket = ticketsData.tickets.find(ticket => ticket.id === ticketId);
  if (!ticket) {
    return res.status(400).send('Ingresso não encontrado.');
  }

  if (!dbData.users[userIndex].pedidos) {
    dbData.users[userIndex].pedidos = [];
  }

  const novoIdTicket = getNextTicketId(dbData.users[userIndex].pedidos);
  const pedido = { ...ticket, id: novoIdTicket, quantidade: parseInt(quantidade, 10) };

  dbData.users[userIndex].pedidos.push(pedido);
  saveDbData(dbData);

  res.send('Ingresso adicionado aos pedidos do usuário com sucesso.');
};

function getNextTicketId(pedidos) {
  if (pedidos.length === 0) {
    return 1;
  }
  const maxId = Math.max(...pedidos.map(pedido => pedido.id));
  return maxId + 1;
}

exports.removerPedido = (req, res) => {
  const pedidoId = req.params.id;
  let dbData = getDbData();

  const pedidoIndex = dbData.users.findIndex(user => user.pedidos && user.pedidos.some(pedido => pedido.id === parseInt(pedidoId)));

  if (pedidoIndex === -1) {
    return res.status(404).json({ message: 'Pedido não encontrado.' });
  }

  dbData.users[pedidoIndex].pedidos = dbData.users[pedidoIndex].pedidos.filter(pedido => pedido.id !== parseInt(pedidoId));
  saveDbData(dbData);

  res.json({ message: `Pedido com ID ${pedidoId} foi removido com sucesso.` });
};

exports.getPedidoById = (req, res) => {
  const pedidoId = parseInt(req.params.pedidoId, 10);
  const dbData = getDbData();

  const userEmail = req.session.userEmail;
  if (!userEmail) {
    return res.status(401).send('Usuário não autenticado.');
  }

  const pedido = findPedidoById(pedidoId, dbData, userEmail);

  if (!pedido) {
    return res.status(404).send('Pedido não encontrado.');
  }

  res.status(200).json(pedido);
};
