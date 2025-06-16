// src/server.js
const http = require("http");
const { SerialPort } = require("serialport");
const socketIo = require("socket.io");
const app = require("./src/app");

const PORT = process.env.PORT || 3000;

const server = http.createServer(app);
const io = socketIo(server);

// Conexão com Arduino via Bluetooth
//const portArduino = new SerialPort({
//  path: "/dev/rfcomm0",
//  baudRate: 9600,
//});


// Eventos da porta serial
//portArduino.on("open", () => {
//  console.log("✅ Conectado ao Arduino via Bluetooth!");
//});

//portArduino.on("data", (data) => {
//  const msg = data.toString().trim();
//  console.log("📥 Arduino:", msg);
//  io.emit("arduinoData", msg);
//});

//portArduino.on("error", (err) => {
//  console.error("❌ Erro na porta serial:", err.message);
//});

// ✅ Simular dados vindo do Arduino (sem o Arduino)
setInterval(() => {
  const fakeData = `Simulado: ${Math.random().toFixed(2)}`;
  console.log("📥 Simulado:", fakeData);
  io.emit("arduinoData", fakeData);
}, 2000);

// Iniciar servidor
server.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
