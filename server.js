const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const path = require('path');

//Definindo elementos estáticos
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/pages/home.html');
});

app.get('/index.html', (req, res) => {
  res.sendFile(__dirname + '/public/pages/index.html');
});

let historico = [];
const historicoChat = [];
let chat = [];
const players = [];

io.on('connection', (socket) => {

  console.log('LOG | Novo usuário conectado: ', socket.id);
  historico.forEach(linha => {
    socket.emit('desenhar', linha)
  })


  socket.on('disconnect', () => {
    console.log('LOG | Usuário desconectado: ', socket.id)
    delete players[socket.id]
    io.emit('PlayerUpdate', Object.values(players));
  })

  socket.on('message', (mensagem) => {

    const messageServer = ['SERVER', 'É necessário escolher um nickname para jogar, por favor recarregue a página =)']

    if (players[socket.id] == undefined) {
      return socket.emit('messageUpdate', Object.values(messageServer))
    }


    if (players[socket.id].name) {
      let playerName = players[socket.id].name
      let message = mensagem
      chat = []
      chat.push(playerName, message)

      historicoChat.push(playerName, message)
      io.emit('messageUpdate', Object.values(chat))

    } else {
      return socket.emit('messageUpdate', Object.values(messageServer))
    }
  })

  socket.on('carregar', (name) => {
    players[socket.id] = { id: socket.id, name: name }
    console.log(players)
    io.emit('PlayerUpdate', Object.values(players))
  })


  socket.on('desenhar', (linha) => {
    historico.push(linha)
    io.emit('desenhar', linha)
  })

  socket.on('NewPlayer', (playerName) => {

    if (playerName == null) return

    players[socket.id] = { id: socket.id, name: playerName }
    
    io.emit('PlayerUpdate', Object.values(players))

  })

  socket.on('Apagar', () => {
    historico = new Array()
    io.emit('ApagarTela')
  })


});

server.listen(8080, () => {
  console.log('listening on *:8080');
});

