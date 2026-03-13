import express from "express"
import http from "http"
import { Server } from "socket.io"
import fs from "fs"

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static("public"))

let fichas = {}
let locked = false

if (fs.existsSync("fichas.json")) {
 fichas = JSON.parse(fs.readFileSync("fichas.json"))
}

function salvar(){
 fs.writeFileSync("fichas.json", JSON.stringify(fichas,null,2))
}

io.on("connection", socket => {

 socket.emit("lista", Object.values(fichas))
 socket.emit("lock", locked)

 socket.on("criar", data => {

  const id = Date.now().toString()

  fichas[id] = {
   id,
   jogador:data.jogador,
   personagem:data.personagem,
   dados:{}
  }

  salvar()

  io.emit("lista", Object.values(fichas))
 })

 socket.on("pedir-ficha", id => {
  socket.emit("ficha", fichas[id])
 })

 socket.on("update", ({id,dados}) => {

  if(locked) return

  fichas[id].dados = dados

  salvar()

  io.emit("ficha-update",{id,dados})
 })

 socket.on("lock", v => {
  locked = v
  io.emit("lock",v)
 })

})

server.listen(process.env.PORT || 3000, ()=>{
 console.log("Servidor rodando")
})
