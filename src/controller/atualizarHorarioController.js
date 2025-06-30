const horarioModel = require('../models/programarModels'); // Certifique-se que o caminho está correto

// Função para salvar o horário
function salvarHorario(req, res) {
  const { idusuario, horario, acao } = req.body;

  // Validação simples
  if (!idusuario || !horario || !acao) {
    return res.status(400).json({ error: "idusuario, horario e acao são obrigatórios." });
  }

  // Verificar se o usuário existe (opcional)
  horarioModel.verificarUsuario(idusuario, (err, usuarioExiste) => {
    if (err) {
      return res.status(500).json({ error: "Erro ao verificar usuário." });
    }

    if (!usuarioExiste) {
      return res.status(404).json({ error: "Usuário não encontrado." });
    }

    // Salvar o novo horário
    horarioModel.salvarHorario({ idusuario, horario, acao }, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Erro ao salvar horário." });
      }

      res.status(201).json({ message: "Horário atualizado com sucesso!", id: result.id });
    });
  });
}

// Função para listar os horários (opcional)
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
