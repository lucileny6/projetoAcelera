const API_URL = 'http://localhost:3000/usuarios'; // URL da API

// Função para mostrar a tela de cadastro
function mostrarCadastro() {
    const telaCadastro = document.getElementById('tela-cadastro');
    const telaUsuarios = document.getElementById('tela-usuarios');
    if (telaCadastro && telaUsuarios) {
        telaCadastro.style.display = 'block';
        telaUsuarios.style.display = 'none';
    }
}

// Função para mostrar a tela de usuários cadastrados
function mostrarUsuarios() {
    const telaCadastro = document.getElementById('tela-cadastro');
    const telaUsuarios = document.getElementById('tela-usuarios');
    if (telaCadastro && telaUsuarios) {
        telaCadastro.style.display = 'none';
        telaUsuarios.style.display = 'block';
        listarUsuarios(); // Carrega a lista de usuários ao entrar na tela de usuários cadastrados
    }
}

// Função para cadastrar um usuário
const formCadastro = document.getElementById('form-cadastro');
if (formCadastro) {
    formCadastro.addEventListener('submit', function (e) {
        e.preventDefault();

        const nomeInput = document.getElementById('nome');
        const emailInput = document.getElementById('email');
        const senhaInput = document.getElementById('senha');
        const enderecoInput = document.getElementById('endereco');
        const telefoneInput = document.getElementById('telefone');
        const messageEl = document.getElementById('message');

        if (!nomeInput || !emailInput || !senhaInput || !enderecoInput || !telefoneInput || !messageEl) return;

        const nome = nomeInput.value.trim();
        const email = emailInput.value.trim();
        const senha = senhaInput.value.trim();
        const endereco = enderecoInput.value.trim();
        const telefone = telefoneInput.value.trim();

        if (!nome || !email || !senha || !endereco || !telefone) {
            messageEl.innerText = 'Por favor, preencha todos os campos.';
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
                messageEl.innerText = 'Usuário cadastrado com sucesso!';
                limparFormulario();
            } else {
                messageEl.innerText = 'Erro ao cadastrar usuário.';
            }
        })
        .catch(error => {
            console.error('Erro:', error);
            messageEl.innerText = 'Ocorreu um erro ao tentar cadastrar o usuário.';
        });
    });
}

// Função para limpar o formulário após o cadastro
function limparFormulario() {
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const enderecoInput = document.getElementById('endereco');
    const telefoneInput = document.getElementById('telefone');
    const messageEl = document.getElementById('message');
    const btnCadastrar = document.getElementById('btn-cadastrar');
    const formCadastro = document.getElementById('form-cadastro');

    if (nomeInput) nomeInput.value = '';
    if (emailInput) emailInput.value = '';
    if (senhaInput) senhaInput.value = '';
    if (enderecoInput) enderecoInput.value = '';
    if (telefoneInput) telefoneInput.value = '';
    if (messageEl) messageEl.innerText = '';
    if (btnCadastrar) btnCadastrar.innerText = 'Cadastrar';
    if (formCadastro) formCadastro.onsubmit = cadastrarUsuario;
}

// Função para listar os usuários cadastrados
function listarUsuarios() {
    const listaUsuarios = document.getElementById('lista-usuarios');
    if (!listaUsuarios) return;

    fetch(API_URL)
        .then(response => response.json())
        .then(data => {
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
    fetch(`${API_URL}/${id}`)
        .then(response => response.json())
        .then(usuario => {
            const nomeInput = document.getElementById('nome');
            const emailInput = document.getElementById('email');
            const senhaInput = document.getElementById('senha');
            const enderecoInput = document.getElementById('endereco');
            const telefoneInput = document.getElementById('telefone');
            const btnCadastrar = document.getElementById('btn-cadastrar');
            const formCadastro = document.getElementById('form-cadastro');
            const messageEl = document.getElementById('message');

            if (!nomeInput || !emailInput || !senhaInput || !enderecoInput || !telefoneInput || !btnCadastrar || !formCadastro || !messageEl) return;

            nomeInput.value = usuario.nome;
            emailInput.value = usuario.email;
            senhaInput.value = usuario.senha;
            enderecoInput.value = usuario.endereco;
            telefoneInput.value = usuario.telefone;

            btnCadastrar.innerText = 'Atualizar';

            // Atualiza o evento do formulário para o modo edição (PUT)
            formCadastro.onsubmit = function (e) {
                e.preventDefault();

                const nome = nomeInput.value.trim();
                const email = emailInput.value.trim();
                const senha = senhaInput.value.trim();
                const endereco = enderecoInput.value.trim();
                const telefone = telefoneInput.value.trim();

                if (!nome || !email || !senha || !endereco || !telefone) {
                    messageEl.innerText = 'Por favor, preencha todos os campos.';
                    return;
                }

                const usuarioAtualizado = { nome, email, senha, endereco, telefone };

                fetch(`${API_URL}/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(usuarioAtualizado),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.message === 'Usuário atualizado com sucesso!') {
                        messageEl.innerText = 'Usuário atualizado com sucesso!';
                        limparFormulario();
                        mostrarUsuarios();
                    } else {
                        messageEl.innerText = 'Erro ao atualizar usuário.';
                    }
                })
                .catch(error => {
                    console.error('Erro:', error);
                    messageEl.innerText = 'Erro ao atualizar o usuário.';
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

// Função padrão para cadastrar (para poder restaurar o evento submit ao limpar o formulário)
function cadastrarUsuario(e) {
    e.preventDefault();

    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const senhaInput = document.getElementById('senha');
    const enderecoInput = document.getElementById('endereco');
    const telefoneInput = document.getElementById('telefone');
    const messageEl = document.getElementById('message');

    if (!nomeInput || !emailInput || !senhaInput || !enderecoInput || !telefoneInput || !messageEl) return;

    const nome = nomeInput.value.trim();
    const email = emailInput.value.trim();
    const senha = senhaInput.value.trim();
    const endereco = enderecoInput.value.trim();
    const telefone = telefoneInput.value.trim();

    if (!nome || !email || !senha || !endereco || !telefone) {
        messageEl.innerText = 'Por favor, preencha todos os campos.';
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
            messageEl.innerText = 'Usuário cadastrado com sucesso!';
            limparFormulario();
        } else {
            messageEl.innerText = 'Erro ao cadastrar usuário.';
        }
    })
    .catch(error => {
        console.error('Erro:', error);
        messageEl.innerText = 'Ocorreu um erro ao tentar cadastrar o usuário.';
    });
}

// Registra o evento submit inicial para cadastro
if (formCadastro) {
    formCadastro.onsubmit = cadastrarUsuario;
}

// Mostrar nome do usuário logado em várias páginas
document.addEventListener("DOMContentLoaded", () => {
    const nomeSpan = document.getElementById('nome-usuario');
    const nomeSpanTopo = document.getElementById('nome-usuario-topo');
    const nome = localStorage.getItem('nomeUsuario');

    if (nome) {
      if (nomeSpan) nomeSpan.textContent = nome;
      if (nomeSpanTopo) nomeSpanTopo.textContent = nome;
    } else {
      if (nomeSpan) nomeSpan.textContent = 'Usuário';
      if (nomeSpanTopo) nomeSpanTopo.textContent = 'Usuário';
      console.warn('Nome do usuário não encontrado no localStorage');
    }
});
