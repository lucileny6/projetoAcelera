console.log("Arquivo login.js carregado!");

document.addEventListener("DOMContentLoaded", () => {
  const formLogin = document.getElementById("form-login");
  const messageEl = document.getElementById("message-login");

  formLogin.addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value.trim();

    if (!email || !senha) {
      messageEl.textContent = "Preencha email e senha.";
      return;
    }

    try {
      const response = await fetch("/usuarios/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login bem-sucedido: salvar dados e redirecionar
        localStorage.setItem("token", data.token); // se usar token JWT, por exemplo
        localStorage.setItem("nomeUsuario", data.usuario.nome);
        messageEl.textContent = "";
        window.location.href = "home.html"; // ou a página interna do sistema
      } else {
        messageEl.textContent = data.error || "Usuário ou senha incorretos.";
      }
    } catch (error) {
      messageEl.textContent = "Erro ao tentar logar: " + error.message;
    }
  });
});


