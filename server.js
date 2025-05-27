// src/server.js
const { server, PORT } = require("./src/app");

server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
