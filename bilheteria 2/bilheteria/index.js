const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const bodyParser = require('body-parser');
const router = require('./src/router/router');
const routerU = require('./src/router/users');
const routerCombined = require('./src/router/combined');

const app = express();
const porta = 3001;
const DATABASE = path.join(__dirname, '/src/database/users.json');
const DATABASE2 = path.join(__dirname, '/src/database/tickets.json');

// Configuração da sessão
app.use(session({
  secret: 'your-secret-key', // Substitua 'your-secret-key' por uma chave secreta segura
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // Ajuste 'secure: true' se estiver usando HTTPS
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configuração dos middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração de arquivos estáticos
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));
app.use('/css', express.static(path.join(__dirname, 'public/css')));
app.use(express.static("public"));

// Configuração das rotas
app.use("/", router);
app.use("/", routerU);
app.use("/", routerCombined);

app.set('view engine', 'ejs');
app.set('views', 'src/view/');

// Função para inicializar o banco de dados de usuários
function initDb() {
  if (!fs.existsSync(DATABASE)) {
    fs.writeFileSync(DATABASE, JSON.stringify({ users: [] }, null, 8));
  }
}

// Função para inicializar o banco de dados de tickets
function initDb2() {
  if (!fs.existsSync(DATABASE2)) {
    fs.writeFileSync(DATABASE2, JSON.stringify({ tickets: [] }, null, 5));
  }
}

// Inicializar os bancos de dados e iniciar o servidor
app.listen(porta, () => {
  initDb();
  initDb2();
  console.log(`Serviço executado na porta ${porta} http://localhost:${porta}/log`);
});
