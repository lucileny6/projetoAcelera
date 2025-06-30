// src/app.js
const express = require("express");
const session = require('express-session');
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();
// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: '2af7e771efc70fd08903f9edc14b7fe346bfcbb00c1c66ea70bca7752fc3af750d93f5b22db5a5f319ad165075e28e2c3d0cadc67a860199e762bbab6d6cdca8', // substitua por uma string segura
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // para desenvolvimento, sem HTTPS deixe false
}));

function verificarAutenticacao(req, res, next) {
  if (req.session && req.session.usuario) {
    next();
  } else {
    res.status(401).json({ error: "Acesso negado. Faça login." });
  }
}
// Rotas públicas (login, cadastro)
const usuariosRouter = require('./routes/usuarios');
app.use('/usuarios', usuariosRouter);


const programarRouter = require('./routes/programar');
app.use('/programar', verificarAutenticacao, programarRouter);



const horarioRouter = require('./routes/horarios'); 
app.use('/horario', verificarAutenticacao,horarioRouter); 


app.get('/favicon.ico', (req, res) => res.status(204));



// Banco de dados SQLite
const db = new sqlite3.Database("agenda.db", (err) => {
  if (err) {
    console.error("❌ Erro ao conectar ao banco:", err.message);
  } else {
    console.log("✅ Conectado ao banco SQLite.");
  }
});

// Servir arquivos estáticosnode
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/principal.html"));
});

app.use(express.static(path.join(__dirname, "../public/")));





// Log de requisições
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

module.exports = app;
