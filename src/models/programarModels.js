// src/models/programarModels.js
const db = require('./db');

function salvarHorario(horario, callback) {
  const { idusuario, horario: dataHorario, acao } = horario;

  const sql = `INSERT INTO horario (idusuario, horario, acao) VALUES (?, ?, ?)`;
  db.run(sql, [idusuario, dataHorario, acao], function(err) {
    if (err) {
      return callback(err);
    }
    callback(null, { id: this.lastID });
  });
}

function listarHorarios(callback) {
  const sql = `SELECT * FROM horario`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      return callback(err);
    }
    callback(null, rows);
  });
}

function verificarUsuario(idusuario, callback) {
  const sql = `SELECT * FROM usuarios WHERE id = ?`;
  db.get(sql, [idusuario], (err, row) => {
    if (err) {
      return callback(err);
    }
    callback(null, !!row); // true se encontrou, false se não
  });
}

module.exports = {
  salvarHorario,
  listarHorarios,
  verificarUsuario
};
