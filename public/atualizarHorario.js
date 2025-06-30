document.getElementById('btnAtualizar').addEventListener('click', async () => {
    const horario = document.getElementById('horario').value;
    const idusuario = 1; // ID fixo ou obtido do login
    const acao = 'ATUALIZAR_HORA';
  
    if (!horario) {
      alert('Por favor, selecione o horário.');
      return;
    }
  
    try {
      const res = await fetch('/programar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idusuario, horario, acao })
      });
  
      const json = await res.json();
      alert(json.message || 'Horário atualizado com sucesso!');
    } catch (error) {
      console.error(error);
      alert('Erro ao atualizar horário.');
    }
  });
  