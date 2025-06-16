function cadastrarUsuario() {
    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const email = document.getElementById("email").value;
    const senha = document.getElementById("senha").value;

    if (!nome || !telefone || !email || !senha) {
        alert("Preencha todos os campos!");
        return;
    }

    fetch("http://localhost:3000/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome, telefone, email, senha, endereco: "Não informado" })
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            alert("Erro ao cadastrar: " + data.error);
        } else {
            alert("Usuário cadastrado com sucesso!");
            document.getElementById("formCadastro").reset();
        }
    })
    .catch(err => {
        alert("Erro na conexão com o servidor.");
        console.error(err);
    });
}
