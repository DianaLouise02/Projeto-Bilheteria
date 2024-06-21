const express = require('express');
const routerU = express.Router();
const usersController = require('../controller/userController');

// Definindo as rotas
routerU.post('/register', usersController.register);
routerU.post('/login', usersController.login);
routerU.get('/dashboard', usersController.dashboard);
routerU.post('/logout', usersController.logout);
routerU.get('/users', usersController.getUsers);
routerU.get('/listUsers', usersController.getUsersGeral);
routerU.delete('/users', usersController.deleteUser);
routerU.put('/users', usersController.updateUser);
routerU.get('/pedido/:pedidoId', usersController.getPedidoById);
routerU.post('/addTicketToPedidos', usersController.addTicketToPedidos);
routerU.delete('/removerPedido/:id', usersController.removerPedido);

routerU.get('/cartao/:pedidoId', (req, res) => {
  const pedidoId = parseInt(req.params.pedidoId, 10);
  const dbData = usersController.getDbData(); 

  const userEmail = req.session.userEmail;
  if (!userEmail) {
    return res.status(401).send('Usuário não autenticado.');
  }

  const pedido = usersController.findPedidoById(pedidoId, dbData, userEmail);

  if (!pedido) {
    return res.status(404).send('Pedido não encontrado.');
  }

  res.render('cartao', { pedido });
});

routerU.get('/pix/:pedidoId', (req, res) => {
  const pedidoId = parseInt(req.params.pedidoId, 10);
  const dbData = usersController.getDbData(); 

  const userEmail = req.session.userEmail;
  if (!userEmail) {
    return res.status(401).send('Usuário não autenticado.');
  }

  const pedido = usersController.findPedidoById(pedidoId, dbData, userEmail);

  if (!pedido) {
    return res.status(404).send('Pedido não encontrado.');
  }

  res.render('pix', { pedido });
});

routerU.get('/dinheiro/:pedidoId', (req, res) => {
  const pedidoId = parseInt(req.params.pedidoId, 10);
  const dbData = usersController.getDbData(); 

  const userEmail = req.session.userEmail;
  if (!userEmail) {
    return res.status(401).send('Usuário não autenticado.');
  }

  const pedido = usersController.findPedidoById(pedidoId, dbData, userEmail);

  if (!pedido) {
    return res.status(404).send('Pedido não encontrado.');
  }

  res.render('dinheiro', { pedido });
});

routerU.get('/opPagamento/:pedidoId', (req, res) => {
  const pedidoId = parseInt(req.params.pedidoId, 10);
  const dbData = usersController.getDbData(); 

  const userEmail = req.session.userEmail;
  if (!userEmail) {
    return res.status(401).send('Usuário não autenticado.');
  }

  const pedido = usersController.findPedidoById(pedidoId, dbData, userEmail);

  if (!pedido) {
    return res.status(404).send('Pedido não encontrado.');
  }

  res.render('opcaoPagamento', { pedido });
});

module.exports = routerU;
