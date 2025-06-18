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

// Servir arquivos estáticosnode
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/home.html"));

app.use(express.static(path.join(__dirname, "../public/")));
});




// Log de requisições
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

module.exports = app;
