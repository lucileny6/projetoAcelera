const express = require('express');
const router = express.Router();
const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database("agenda.db");

router.post('/', (req, res) => {
  const { idusuario, horario, acao } = req.body;

  if (!idusuario || !horario || !acao) {
    return res.status(400).json({ message: "ID do usuário, horário e ação são obrigatórios." });
  }

  // Opcional: validar se o usuário existe antes

  db.get("SELECT * FROM usuarios WHERE id = ?", [idusuario], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao buscar usuário." });
    }
    if (!row) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    db.run(
      "INSERT INTO horario (idusuario, horario, acao) VALUES (?, ?, ?)",
      [idusuario, horario, acao],
      function (err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        res.status(201).json({ message: "Horário salvo com sucesso", id: this.lastID });
      }
    );
  });
});

module.exports = router;
