const socket = io.connect()


//Novo Jogador
function logar(){
    const player = document.querySelector('#nick').value    
    const teste = document.querySelector('#nickName')
    if(!player){
        return alert('É necessário informar um nickname')
    }
    console.log(player)
    socket.emit('NewPlayer', player);
    window.location.href = '/pages/index.html'
}