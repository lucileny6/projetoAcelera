const db = require('./db');

// Função para cadastrar um novo usuário
function cadastrarUsuario(usuario, callback) {
  const { nome, email, senha } = usuario;

  const sql = `INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)`;

  db.run(sql, [nome, email, senha], function (err) {
    if (err) {
      return callback(err);
    }
    callback(null, { id: this.lastID });
  });
}

// Função para buscar usuário por email e senha (login)
function buscarPorEmailSenha(email, senha, callback) {
  const sql = `SELECT * FROM usuarios WHERE email = ? AND senha = ?`;

  db.get(sql, [email, senha], (err, row) => {
    if (err) {
      return callback(err);
    }
    callback(null, row); // retorna null se não encontrar
  });
}

// (opcional) Buscar por e-mail (verificar se já existe no cadastro)
function buscarPorEmail(email, callback) {
  const sql = `SELECT * FROM usuarios WHERE email = ?`;

  db.get(sql, [email], (err, row) => {
    if (err) return callback(err);
    callback(null, row);
  });
}

module.exports = {
  cadastrarUsuario,
  buscarPorEmailSenha,
  buscarPorEmail,
};
