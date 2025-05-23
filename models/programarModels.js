const fs = require('fs');
const filePath = 'horarios.json';

function salvarHorario(horario) {
  let horarios = [];
  if (fs.existsSync(filePath)) {
    horarios = JSON.parse(fs.readFileSync(filePath));
  }
  horarios.push(horario);
  fs.writeFileSync(filePath, JSON.stringify(horarios, null, 2));
}

module.exports = { salvarHorario };
