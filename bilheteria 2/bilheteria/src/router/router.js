const express = require('express');
const ticketController = require('../controller/ticketController');
const upload = require('../middleware/upload'); // Seu middleware multer

const router = express.Router();

const cors = require('cors');
router.use(cors());

router.get('/inicio', (req, res) => {
  res.sendFile(path.join(__dirname, '../../public/html/paginaInicial.html'));
});

router.get('/log', (req, res) => {
  res.render('login');
});

router.get('/cadastro', (req, res) => {
  res.render('cadastro');
});

router.get('/logado',(req, res) =>{
  res.render('paginaLogada')
});

router.get('/pedidos',(req, res) =>{
  res.render('pedidos')
});

router.get('/cadEmpresa',(req, res) =>{
  res.render('cadAdm')
});

router.get('/finalPagamento', (req, res) => {
  res.render('finalPagamento');
});

router.get('/admin', (req, res) => {
  res.render('admin');
});

router.get('/vender', (req, res) => {
  res.render('vender');
});

router.get('/perfil', (req, res) =>{
  res.render('perfil')
});

router.post('/tickets', upload.single('imagem'), ticketController.registerTicket);
router.get('/tickets', ticketController.getTickets);
router.get('/tickets/:ticketId', ticketController.getTicketById);
router.put('/tickets/:ticketId', upload.single('imagem'), ticketController.updateTicket);
router.delete('/tickets/:ticketId', ticketController.deleteTicket);

module.exports = router;
