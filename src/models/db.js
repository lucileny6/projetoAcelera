// src/models/db.js
const sqlite3 = require("sqlite3").verbose();
const path = require("path");

// Caminho do banco
const dbPath = path.resolve(__dirname, "../../agenda.db");

// Conectar ao banco
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("❌ Erro ao conectar ao banco:", err.message);
  } else {
    console.log("✅ Conectado ao banco SQLite.");
  }
});

// Criar tabelas, se não existirem
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      telefone TEXT,
      email TEXT UNIQUE NOT NULL,
      senha TEXT NOT NULL
    )
  `);

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
    CREATE TABLE IF NOT EXISTS login (
      idlogin INTEGER PRIMARY KEY AUTOINCREMENT,
      idusuario INTEGER,
      email_tentativa TEXT NOT NULL,
      sucesso INTEGER NOT NULL,
      FOREIGN KEY (idusuario) REFERENCES usuarios (id)
    )
  `);
});

module.exports = db;
