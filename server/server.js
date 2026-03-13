const express = require("express")
const http = require("http")
const { Server } = require("socket.io")

const app = express()
const server = http.createServer(app)
const io = new Server(server)

app.use(express.static("public"))

let fichas = {}
let locked = false

io.on("connection", socket => {

  socket.on("updateFicha", data => {
    if (locked) return

    fichas[data.id] = data
    io.emit("fichaAtualizada", data)
  })

  socket.on("lockSheets", () => {
    locked = true
    io.emit("locked", true)
  })

  socket.on("unlockSheets", () => {
    locked = false
    io.emit("locked", false)
  })

  socket.on("getFichas", () => {
    socket.emit("allFichas", fichas)
  })

})

server.listen(3000, () => {
  console.log("Servidor rodando")
})