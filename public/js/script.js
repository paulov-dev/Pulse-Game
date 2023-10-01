const socket = io.connect()

socket.on('resposta', () => {
    console.log('mensagem recebida')
})


function enviar() {
    const message = document.querySelector('#inputText').value
    socket.emit('message', message)
    document.querySelector('#inputText').value = ''
}


function Apagar() {
    socket.emit('Apagar')
}

let players = []
let chats = []

//Novo Jogador
function nickname() {
    const playerName = prompt('Insira seu nickname:');
    socket.emit('NewPlayer', playerName);
}


socket.on('PlayerUpdate', (PlayerUpdate) => {

    players = PlayerUpdate


    updatePlayerList()

})

function updatePlayerList() {
    const playerList = document.getElementById('playerList');
    playerList.innerHTML = '';


    for (const player of players) {
        const listItem = document.createElement('li');
        listItem.textContent = `${player.name}`;
        playerList.appendChild(listItem);
    }
}


socket.on('messageUpdate', (mensagem) => {
    console.log(mensagem)
    var messages = document.getElementById('messages');
    var item = document.createElement(`h3`);
    var item2 = document.createElement('p');
    var hr = document.createElement("hr");
    item.textContent = mensagem[0];
    item2.textContent = mensagem[1];
    messages.appendChild(item);
    messages.appendChild(item2);
    messages.appendChild(hr);
    window.scrollTo(0, document.body.scrollHeight)
    chats = mensagem
    //updateChatList()   
})

function updateChatList() {
    const chatList = document.getElementById('messages');
    chatList.innerHTML = '';


    const listItemChat = document.createElement('p');
    listItemChat.textContent = `${chat}`;
    chatList.appendChild(listItemChat);

}

document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        if (!document.querySelector('#inputText').value) {
            return
        } {
            enviar()
        }

    }
}, false);

// CANVAS - Vanilla JavaScript
// https://developer.mozilla.org/pt-BR/docs/Web/API/Canvas_API/Tutorial/Drawing_shapes

document.addEventListener('DOMContentLoaded', () => {

    socket.on('desenhar', (linha) => {
        desenharLinha(linha)
    })


    const pincel = {
        ativo: false,
        movendo: false,
        pos: { x: 0, y: 0 },
        posAnterior: null
    }

    const tela = document.querySelector('#window')
    const context = tela.getContext('2d')
    let { x, y } = tela.getBoundingClientRect()

    tela.width = 700
    tela.height = 500

    context.lineWidth = 3
    context.strokeStyle = "purple"

    const desenharLinha = (linha) => {

        context.beginPath()
        context.moveTo(linha.posAnterior.x, linha.posAnterior.y)
        context.lineTo(linha.pos.x, linha.pos.y)
        context.stroke()

    }

    tela.onmousedown = () => {
        pincel.ativo = true
    }

    tela.onmouseup = () => {
        pincel.ativo = false
    }

    tela.onmousemove = (evento) => {
        pincel.pos = { x: evento.clientX - x, y: evento.clientY - y }
        pincel.movendo = true
    }


    socket.on('ApagarTela', () => {
        context.clearRect(0, 0, tela.width, tela.height);

    })

    // Definindo ciclo para cálculo de reta
    const ciclo = () => {
        if (pincel.ativo && pincel.movendo && pincel.posAnterior) {
            socket.emit('desenhar', { pos: pincel.pos, posAnterior: pincel.posAnterior })
            //desenharLinha({pos: pincel.pos, posAnterior: pincel.posAnterior})
            pincel.movendo = false
        }
        pincel.posAnterior = { x: pincel.pos.x, y: pincel.pos.y }

        setTimeout(ciclo, 100)

    }

    nickname()
    ciclo()

    //desenharLinha({pos:{x:350, y:250},posAnterior:{x:10,y:10}})


})