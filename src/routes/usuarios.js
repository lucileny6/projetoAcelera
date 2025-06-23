const express = require('express');
const router = express.Router();
const db = require('../models/db');

// POST - Cadastrar usuário
router.post('/', (req, res) => {
  const { nome, telefone, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Nome, email e senha são obrigatórios." });
  }

  // Verificar se o email já existe
  db.get("SELECT * FROM usuarios WHERE email = ?", [email], (err, row) => {
    if (err) return res.status(500).json({ error: err.message });
    if (row) return res.status(409).json({ error: "Email já cadastrado." });

    // Inserir novo usuário
    db.run(
      "INSERT INTO usuarios (nome, telefone, email, senha) VALUES (?, ?, ?, ?)",
      [nome, telefone, email, senha],
      function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: "Usuário cadastrado com sucesso", id: this.lastID });
      }
    );
  });
});

module.exports = router;
