const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
const { SerialPort } = require("serialport");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Porta do servidor
const PORT = process.env.PORT || 3000;

// Middleware para tratar JSON e dados de formulários
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Banco de dados SQLite
const db = new sqlite3.Database("agenda.db", (err) => {
  if (err) {
    console.error("❌ Erro ao conectar ao banco:", err.message);
  } else {
    console.log("✅ Conectado ao banco SQLite.");
  }
});

// Cria a tabela 'horario' se não existir
db.run(`
  CREATE TABLE IF NOT EXISTS horario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    horario DATETIME,
    acao TEXT
  )
`);

// Cria a tabela 'usuarios' se não existir .;
db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    telefone TEXT,
    email TEXT UNIQUE NOT NULL,
    senha TEXT NOT NULL
  )
`);




// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, "public"))); // ajuste se necessário

// Conexão com Arduino via Bluetooth
const portArduino = new SerialPort({
  path: "/dev/rfcomm0", // Ajuste para o seu dispositivo Bluetooth
  baudRate: 9600
});

// Evento ao abrir a porta serial
portArduino.on("open", () => {
  console.log("✅ Conectado ao Arduino via Bluetooth!");
});

// Evento ao receber dados da porta serial
portArduino.on("data", (data) => {
  const msg = data.toString().trim();
  console.log("📥 Arduino:", msg);
  io.emit("arduinoData", msg);
});

// Evento de erro na porta serial
portArduino.on("error", (err) => {
  console.error("❌ Erro na porta serial:", err.message);
});

// Middleware para log de requisições
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Exportar servidor e porta para uso no server.js
module.exports = { server, PORT };
