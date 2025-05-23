const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const path = require("path");
//const { SerialPort } = require("serialport");
const http = require("http");
const socketIo = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Porta do servidor
const PORT = process.env.PORT || 3000;

// Middleware para JSON e urlencoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Banco SQLite
const db = new sqlite3.Database("agenda.db", (err) => {
  if (err) {
    console.error("Erro ao conectar no banco:", err.message);
  } else {
    console.log("Conectado ao banco SQLite.");
  }
});

// Criar tabela se não existir
db.run(`
  CREATE TABLE IF NOT EXISTS horario (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    horario DATETIME,
    acao TEXT
  )
`);

// Serve arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, "public"))); // ajuste conforme sua estrutura

// Configura porta serial do Arduino (ajuste caminho se necessário)
//const portArduino = new SerialPort({
//  path: "/dev/ttyUSB0", 
//  baudRate: 9600,
//});

// Eventos da porta serial
//portArduino.on("data", (data) => {
//  const msg = data.toString().trim();
//  console.log("Arduino:", msg);
//  io.emit("arduinoData", msg);
//});

//portArduino.on("error", (err) => {
//  console.error("Erro na porta serial:", err.message);
//});

// Middleware para log de requisições
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
