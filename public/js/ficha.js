const socket = io()

const params = new URLSearchParams(location.search)
const id = params.get("id")

const inputs = document.querySelectorAll("input")

function criarCirculos(idDiv,qtd){

 const div = document.getElementById(idDiv)

 for(let i=0;i<qtd;i++){

  const c = document.createElement("div")
  c.className="c"

  c.onclick=()=>{
   c.classList.toggle("on")
   salvar()
  }

  div.appendChild(c)

 }

}

criarCirculos("vida",6)
criarCirculos("dor",6)

function coletar(){

 const dados={}

 inputs.forEach(i=>{
  dados[i.id]=i.value
 })

 dados.vida=[...document.querySelectorAll("#vida .c")].map(c=>c.classList.contains("on"))
 dados.dor=[...document.querySelectorAll("#dor .c")].map(c=>c.classList.contains("on"))

 return dados

}

function salvar(){

 socket.emit("update",{id,dados:coletar()})

}

inputs.forEach(i=>i.oninput=salvar)

socket.emit("pedir-ficha",id)

socket.on("ficha",f=>{
 if(!f) return
 carregar(f.dados)
})

socket.on("ficha-update",({id:fid,dados})=>{
 if(fid!==id) return
 carregar(dados)
})

function carregar(d){

 if(!d) return

 inputs.forEach(i=>{
  if(d[i.id]) i.value=d[i.id]
 })

 if(d.vida){
  document.querySelectorAll("#vida .c").forEach((c,i)=>{
   if(d.vida[i]) c.classList.add("on")
  })
 }

 if(d.dor){
  document.querySelectorAll("#dor .c").forEach((c,i)=>{
   if(d.dor[i]) c.classList.add("on")
  })
 }

}

document.getElementById("exportar").onclick=()=>{

 const blob = new Blob([JSON.stringify(coletar())])

 const a = document.createElement("a")
 a.href = URL.createObjectURL(blob)
 a.download="ficha.json"
 a.click()

}

document.getElementById("importar").onchange=e=>{

 const file=e.target.files[0]

 const reader=new FileReader()

 reader.onload=()=>{
  const dados=JSON.parse(reader.result)
  carregar(dados)
  salvar()
 }

 reader.readAsText(file)

}