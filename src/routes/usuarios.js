// routes/horarios.js
const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

// Conectar com o banco agenda.db (mesmo banco do app.js)
const db = new sqlite3.Database('agenda.db');

// Rota GET para listar todos os horários
router.get('/', (req, res) => {
  db.all("SELECT * FROM horario ORDER BY horario ASC", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(rows);
  });
});

// Rota POST para adicionar um novo horário
router.post('/', (req, res) => {
  const { idusuario, horario, acao } = req.body;

  if (!idusuario || !horario || !acao) {
    return res.status(400).json({ message: "idusuario, horario e acao são obrigatórios." });
  }

  // Verifica se usuário existe
  db.get("SELECT * FROM usuarios WHERE id = ?", [idusuario], (err, user) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    // Insere o novo horário
    db.run(
      "INSERT INTO horario (idusuario, horario, acao) VALUES (?, ?, ?)",
      [idusuario, horario, acao],
      function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: "Horário salvo com sucesso", id: this.lastID });
      }
    );
  });
});

module.exports = router;
