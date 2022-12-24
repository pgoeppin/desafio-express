const express = require("express");
const fs = require("fs");
const app = express();
const cors = require("cors");

app.listen(3000, console.log("¡Servidor encendido! en el puerto 3000."));
app.use(cors());
app.use(express.json());

// METODO POST - CREATE
app.post("/canciones", async (req, res) => {
  const songs = JSON.parse(await fs.promises.readFile("canciones.json"));
  const song = req.body;
  if (!song.id || !song.name || !song.artist || !song.tone) {
    res.send(
      "Falta un dato, por favor agregar una canción con los siguientes parametros: id, name, artist y tone"
    );
  } else {
    if (!songs[songs.findIndex((p) => p.id == song.id)]) {
      songs.push(song);
      await fs.promises.writeFile("canciones.json", JSON.stringify(songs));
      res.send("Cancion agregada con exito!");
    } else {
      res.send("Cancion ya existe, prueba con otro id");
    }
  }
});

// METODO GET - READ
app.get("/canciones", async (req, res) => {
  const songs = JSON.parse(await fs.promises.readFile("canciones.json"));
  if (songs.length != 0) {
    res.json(songs);
  } else {
    res.send("No hay canciones!");
  }
});

// METODO PUT - UPDATE
app.put("/canciones/:id", async (req, res) => {
  try {
    const songs = JSON.parse(await fs.promises.readFile("canciones.json"));
    const { id } = req.params;
    const song = req.body;
    const index = songs.findIndex((p) => p.id == id);
    if (songs.length != 0) {
      if (song.name) {
        songs[index].name = song.name;
        await fs.promises.writeFile("canciones.json", JSON.stringify(songs));
        res.send(`Cancion con id ${id} modificada exitosamente!`);
      }
      if (song.artist) {
        songs[index].artist = song.artist;
        await fs.promises.writeFile("canciones.json", JSON.stringify(songs));
        res.send(`Cancion con id ${id} modificada exitosamente!`);
      }
      if (song.tone) {
        songs[index].tone = song.tone;
        await fs.promises.writeFile("canciones.json", JSON.stringify(songs));
        res.send(`Cancion con id ${id} modificada exitosamente!`);
      }
      if (!song.name && !song.artist && !song.tone) {
        res.send(
          "Parametro a modificar no encontrado, cancion no modificada. Parametros: name, artist or tone"
        );
      }
    } else {
      res.send("No hay canciones!");
    }
  } catch (e) {
    console.error(e);
  }
});

// METODO DELETE
app.delete("/canciones/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const songs = JSON.parse(await fs.promises.readFile("canciones.json"));
    if (songs.length > 0) {
      const index = songs.findIndex((p) => p.id == id);
      if (index != -1) {
        songs.splice(index, 1);
        await fs.promises.writeFile("canciones.json", JSON.stringify(songs));
        res.send(`Cancion eliminada con id: ${id}`);
      } else {
        res.send(`No existe la cancion con id ${id}`)
      }
    } else {
      res.send("No hay canciones para eliminar.");
    }
  } catch (e) {
    console.error(e);
  }
});
