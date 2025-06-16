const API_URL = 'http://localhost:3000/usuarios'; // URL da API

// Função para mostrar a tela de cadastro
function mostrarCadastro() {
    document.getElementById('tela-cadastro').style.display = 'block';
    document.getElementById('tela-usuarios').style.display = 'none';
}

// Função para mostrar a tela de usuários cadastrados
function mostrarUsuarios() {
    document.getElementById('tela-cadastro').style.display = 'none';
    document.getElementById('tela-usuarios').style.display = 'block';
    listarUsuarios(); // Carrega a lista de usuários ao entrar na tela de usuários cadastrados
}

// Função para cadastrar um usuário
document.getElementById('form-cadastro').addEventListener('submit', function (e) {
    e.preventDefault();

    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const endereco = document.getElementById('endereco').value;
    const telefone = document.getElementById('telefone').value;

    if (!nome || !email || !senha || !endereco || !telefone) {
        document.getElementById('message').innerText = 'Por favor, preencha todos os campos.';
        return;
    }

    const usuario = { nome, email, senha, endereco, telefone };

    fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(usuario),
    })
    .then(response => response.json())
    .then(data => {
        if (data.message === 'Usuário cadastrado com sucesso') {
            document.getElementById('message').innerText = 'Usuário cadastrado com sucesso!';
            limparFormulario();
        } else {
            document.getElementById('message').innerText = 'Erro ao cadastrar usuário.';
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        document.getElementById('message').innerText = 'Ocorreu um erro ao tentar cadastrar o usuário.';
    });
});

// Função para limpar o formulário após o cadastro
function limparFormulario() {
    document.getElementById('nome').value = '';
    document.getElementById('email').value = '';
    document.getElementById('senha').value = '';
    document.getElementById('endereco').value = '';
    document.getElementById('telefone').value = '';
}

// Função para listar os usuários cadastrados
function listarUsuarios() {
    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
            const listaUsuarios = document.getElementById('lista-usuarios');
            listaUsuarios.innerHTML = ''; // Limpa a lista antes de adicionar os novos dados

            if (data.length > 0) {
                data.forEach(usuario => {
                    const li = document.createElement('li');
                    li.innerHTML = `
                        <strong>${usuario.nome}</strong><br>
                        Email: ${usuario.email}<br>
                        Telefone: ${usuario.telefone}<br>
                        Endereço: ${usuario.endereco}<br>
                        <button onclick="editarUsuario(${usuario.id})">Editar</button>
                        <button onclick="deletarUsuario(${usuario.id})">Deletar</button>
                    `;
                    listaUsuarios.appendChild(li);
                });
            } else {
                listaUsuarios.innerHTML = '<li>Nenhum usuário encontrado.</li>';
            }
        })
        .catch(error => console.error('Erro ao listar usuários:', error));
}

// Função para editar um usuário
function editarUsuario(id) {
    // Buscar os dados do usuário
    fetch(`${API_URL}/${id}`)
        .then(response => response.json())
        .then(usuario => {
            // Preenche os campos do formulário com os dados do usuário
            document.getElementById('nome').value = usuario.nome;
            document.getElementById('email').value = usuario.email;
            document.getElementById('senha').value = usuario.senha;
            document.getElementById('endereco').value = usuario.endereco;
            document.getElementById('telefone').value = usuario.telefone;

            // Mudar o botão de "Cadastrar" para "Atualizar"
            document.getElementById('btn-cadastrar').innerText = 'Atualizar';

            // Alterar o evento do formulário para atualização (PUT)
            document.getElementById('form-cadastro').onsubmit = function (e) {
                e.preventDefault();

                const nome = document.getElementById('nome').value;
                const email = document.getElementById('email').value;
                const senha = document.getElementById('senha').value;
                const endereco = document.getElementById('endereco').value;
                const telefone = document.getElementById('telefone').value;

                const usuarioAtualizado = { nome, email, senha, endereco, telefone };

                fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(usuarioAtualizado),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.message === 'Usuário atualizado com sucesso!') {
                        document.getElementById('message').innerText = 'Usuário atualizado com sucesso!';
                        limparFormulario();
                        mostrarUsuarios();  // Atualiza a lista de usuários
                    } else {
                        document.getElementById('message').innerText = 'Erro ao atualizar usuário.';
                    }
                })
                .catch(error => {
                    console.error('Erro:', error);
                    document.getElementById('message').innerText = 'Erro ao atualizar o usuário.';
                });
            };
        })
        .catch(error => console.error('Erro ao buscar dados para edição:', error));
}

// Função para deletar um usuário
function deletarUsuario(id) {
    if (confirm('Você tem certeza que deseja deletar este usuário?')) {
        fetch(`${API_URL}/${id}`, { method: 'DELETE' })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Usuário excluído com sucesso!') {
                    alert('Usuário deletado!');
                    listarUsuarios(); // Atualiza a lista de usuários após exclusão
                } else {
                    alert('Erro ao deletar usuário.');
                }
            })
            .catch(error => {
                console.error('Erro ao deletar usuário:', error);
                alert('Erro ao tentar deletar o usuário.');
            });
    }
}