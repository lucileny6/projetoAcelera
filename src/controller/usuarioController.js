const usuariosModel = require('../models/usuariosModels'); // mantém com "s"

// Cadastrar novo usuário
function cadastrar(req, res) {
  const { nome, email, senha } = req.body;

  if (!nome || !email || !senha) {
    return res.status(400).json({ error: "Nome, email e senha são obrigatórios." });
  }

  // Aqui estava o erro — estava "usuarioModel" com o nome errado
  usuariosModel.buscarPorEmail(email, (err, usuarioExistente) => {
    if (err) return res.status(500).json({ error: "Erro ao verificar usuário." });

    if (usuarioExistente) {
      return res.status(409).json({ error: "Email já cadastrado." });
    }

    usuariosModel.cadastrarUsuario({ nome, email, senha }, (err, result) => {
      if (err) return res.status(500).json({ error: "Erro ao cadastrar usuário." });

      res.status(201).json({ message: "Usuário cadastrado com sucesso", id: result.id });
    });
  });
}

// Fazer login do usuário
function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ error: "Email e senha são obrigatórios." });
  }

  usuariosModel.buscarPorEmailSenha(email, senha, (err, usuario) => {
    if (err) return res.status(500).json({ error: "Erro ao buscar usuário." });

    if (!usuario) {
      return res.status(401).json({ error: "Email ou senha inválidos." });
    }

    res.status(200).json({
      message: "Login bem-sucedido",
      usuario: {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email
      }
    });
  });
}

module.exports = {
  cadastrar,
  login
};
