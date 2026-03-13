const socket = io()

const players = document.getElementById("players")

socket.on("lista",lista=>{

 players.innerHTML=""

 lista.forEach(p=>{

  const div=document.createElement("div")

  div.innerHTML=`
  <b>${p.personagem}</b> (${p.jogador})
  `

  players.appendChild(div)

 })

})

document.getElementById("lock").onclick=()=>{
 socket.emit("lock",true)
}

document.getElementById("unlock").onclick=()=>{
 socket.emit("lock",false)
}