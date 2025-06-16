// src/app.js
const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

const app = express();


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const programarRouter = require('./routes/programar');
app.use('/programar', programarRouter);

const usuariosRouter = require('./routes/usuarios');
app.use('/usuarios', usuariosRouter);

const horarioRouter = require('./routes/horarios'); // Adicione esta linha
app.use('/horario', horarioRouter); // E esta



// Banco de dados SQLite
const db = new sqlite3.Database("agenda.db", (err) => {
  if (err) {
    console.error("❌ Erro ao conectar ao banco:", err.message);
  } else {
    console.log("✅ Conectado ao banco SQLite.");
  }
});

// Criação das tabelas
db.run(`
  CREATE TABLE IF NOT EXISTS horario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    idusuario INTEGER,
    horario DATETIME,
    acao TEXT,
    FOREIGN KEY (idusuario) REFERENCES usuarios (id)
  )
`);


db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    telefone TEXT,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL
  )
`);

// Tabela de login (corrigida)
db.run(`
  CREATE TABLE IF NOT EXISTS login (
    idlogin INTEGER PRIMARY KEY AUTOINCREMENT,
    idusuario INTEGER,
    email_tentativa TEXT NOT NULL,
    sucesso INTEGER NOT NULL,
    FOREIGN KEY (idusuario) REFERENCES usuarios (id)
  )
`);

// Servir arquivos estáticosnode
app.use(express.static(path.join(__dirname, "../public")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});




// Log de requisições
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

module.exports = app;
