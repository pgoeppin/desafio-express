const express = require('express')
const fs = require('fs')
const app = express()
const cors = require('cors')

app.listen(3000, console.log("¡Servidor encendido! en el puerto 3000."))
app.use(cors())
app.use(express.json())

// METODO POST - CREATE
app.post("/canciones", async (req, res) => {
    const songs = JSON.parse(await fs.promises.readFile("canciones.json"))
    const song = req.body
    if (!song.id || !song.name || !song.artist || !song.tone) {
        res.send("Falta un dato, por favor agregar una canción con los siguientes parametros: id, nombre, artista y tono")
    } else {
        if (!songs[songs.findIndex(p => p.id == song.id)]) {
            songs.push(song)
            await fs.promises.writeFile("canciones.json", JSON.stringify(songs))
            res.send("Cancion agregada con exito!") 
        } else {
            res.send("Cancion ya existe, prueba con otro id")
        }
    }
})

// METODO GET - READ
app.get("/canciones", async(req, res) => {
    const songs = JSON.parse(await fs.promises.readFile("canciones.json"))
    if(songs.length != 0){
        res.json(songs)
    } else {
        res.send("No hay canciones!")
    }
})