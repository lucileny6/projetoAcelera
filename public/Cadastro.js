async function cadastrarUsuario() {
    const nome = document.getElementById('nome').value;
    const telefone = document.getElementById('telefone').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
  
    const data = { nome, telefone, email, senha };
  
    try {
      const response = await fetch('/usuarios/cadastrar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert('Usuário cadastrado com sucesso!');
        // redirecionar para login, por exemplo:
        window.location.href = 'login.html';
      } else {
        alert('Erro: ' + result.error || result.message);
      }
    } catch (error) {
      alert('Erro na requisição: ' + error.message);
    }
  }
  