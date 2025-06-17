const horarioModel = require('../models/programarodels');

// Salvar novo horário
function salvarHorario(req, res) {
  const { idusuario, horario, acao } = req.body;

  if (!idusuario || !horario || !acao) {
    return res.status(400).json({ error: "idusuario, horario e acao são obrigatórios." });
  }

  horarioModel.salvarHorario({ idusuario, horario, acao }, (err, result) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao salvar horário." });
    }
    res.status(201).json({ message: "Horário salvo com sucesso", id: result.id });
  });
}

// Listar todos os horários
function listarHorarios(req, res) {
  horarioModel.listarHorarios((err, horarios) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao listar horários." });
    }
    res.status(200).json(horarios);
  });
}

module.exports = {
  salvarHorario,
  listarHorarios,
};
