const express = require("express");
const sqlite3 = require("sqlite3");
const path = require("path");
const app = express();
const PORTA = 3000;

// Usando o middleware para lidar com o corpo das requisições
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // Para aceitar requisições com JSON (necessário para PUT e POST)

// Middleware para logar todas as requisições
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Conectando ao banco de dados SQLite
const db = new sqlite3.Database("agenda.db", (err) => {
    if (err) {
        console.log("Erro ao conectar no banco de dados SQLite:", err);
    } else {
        console.log("Conectado ao banco SQLite");
    }
});

// Criando a tabela de usuários, caso não exista
db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        endereco TEXT NOT NULL,
        telefone TEXT NOT NULL,
        email TEXT NOT NULL
    )
`, (err) => {
    if (err) {
        console.log("Erro ao criar a tabela de usuários:", err);
    } else {
        console.log("Tabela de usuários criada ou já existe.");
    }
});

// Serve os arquivos estáticos (CSS, JS, imagens) da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rota para servir o index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Rota para pegar todos os usuários ou pesquisar por nome
app.get("/usuarios", (req, res) => {
    const { nome } = req.query; // Pega o nome passado na URL

    // Se houver um nome fornecido, faz a busca por nome
    let query = "SELECT * FROM usuarios";
    let params = [];
    if (nome) {
        query += " WHERE nome LIKE ?";
        params.push(`%${nome}%`);
    }

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ message: "Erro ao buscar usuários", error: err.message });
        }
        res.json(rows);
    });
});

// Rota para pegar um usuário específico pelo ID
app.get("/usuarios/:id", (req, res) => {
    const { id } = req.params;
    db.get("SELECT * FROM usuarios WHERE id = ?", [id], (err, row) => {
        if (err) {
            return res.status(500).json({ message: "Erro ao buscar usuário", error: err.message });
        }
        if (!row) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }
        res.json(row);
    });
});

// Rota para cadastrar um novo usuário
app.post("/usuarios", (req, res) => {
    const { nome, endereco, telefone, email } = req.body;

    if (!nome || !endereco || !telefone || !email) {
        return res.status(400).json({ message: "Todos os campos devem ser preenchidos!" });
    }

    db.run(
        `INSERT INTO usuarios (nome, endereco, telefone, email) VALUES (?, ?, ?, ?)`,
        [nome, endereco, telefone, email], function (err) {
            if (err) {
                return res.status(500).json({ message: "Erro ao cadastrar usuário", error: err.message });
            }
            res.status(201).json({
                message: "Usuário cadastrado com sucesso",
                user: {
                    id: this.lastID,
                    nome,
                    endereco,
                    telefone,
                    email,
                },
            });
        }
    );
});

// Rota para atualizar um usuário
app.put("/usuarios/:id", (req, res) => {
    const { id } = req.params;
    const { nome, endereco, telefone, email } = req.body;

    if (!nome || !endereco || !telefone || !email) {
        return res.status(400).json({ message: "Todos os campos são obrigatórios!" });
    }

    db.run(
        `UPDATE usuarios SET nome = ?, endereco = ?, telefone = ?, email = ? WHERE id = ?`,
        [nome, endereco, telefone, email, id], function (err) {
            if (err) {
                return res.status(500).json({ message: "Erro ao atualizar usuário", error: err.message });
            }
            if (this.changes === 0) {
                return res.status(404).json({ message: "Usuário não encontrado" });
            }
            res.json({ message: "Usuário atualizado com sucesso!" });
        }
    );
});

// Rota para excluir um usuário
app.delete("/usuarios/:id", (req, res) => {
    const { id } = req.params;

    db.run(`DELETE FROM usuarios WHERE id = ?`, [id], function (err) {
        if (err) {
            return res.status(500).json({ message: "Erro ao excluir usuário", error: err.message });
        }
        if (this.changes === 0) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }
        res.json({ message: "Usuário excluído com sucesso!" });
    });
});

// Middleware para tratar rotas não encontradas (404)
app.use((req, res) => {
    res.status(404).send("Página não encontrada");
});

// Inicializando o servidor
app.listen(PORTA, (err) => {
    if (err) {
        console.log("Erro ao abrir a porta: ", err);
    } else {
        console.log(`Servidor ouvindo a porta ${PORTA}`);
    }
});
