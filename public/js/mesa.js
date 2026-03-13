const socket = io()

const lista = document.getElementById("lista")

document.getElementById("criar").onclick = () => {

 const jogador = prompt("Nome do jogador")
 const personagem = prompt("Nome do personagem")

 if(!jogador || !personagem) return

 socket.emit("criar",{jogador,personagem})

}

socket.on("lista", fichas => {

 lista.innerHTML=""

 fichas.forEach(f=>{

  const card = document.createElement("div")
  card.className="card"

  card.innerHTML = `
  <b>${f.personagem}</b>
  <br>
  jogador: ${f.jogador}
  `

  card.onclick=()=>{
   location="ficha.html?id="+f.id
  }

  lista.appendChild(card)

 })

})