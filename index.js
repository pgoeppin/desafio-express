const express = require("express");
const fs = require("fs");
const app = express();
const cors = require("cors");

app.listen(3000, console.log("¡Servidor encendido! en el puerto 3000."));
app.use(cors());
app.use(express.json());

// HTML 
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html")
    })    

// METODO POST - CREATE
app.post("/canciones", async (req, res) => {
  try {
    const canciones = JSON.parse(await fs.promises.readFile("canciones.json", "utf-8"));
    const cancion = req.body;
    if (!cancion.id || !cancion.titulo || !cancion.artista || !cancion.tono) {
      res.send(
        "Falta un dato, por favor agregar una canción con los siguientes parametros: id, titulo, artista y tono"
      );
    } else {
      if (!canciones[canciones.findIndex((p) => p.id == cancion.id)]) {
        canciones.push(cancion);
        await fs.promises.writeFile("canciones.json", JSON.stringify(canciones));
        res.send("Cancion agregada con exito!");
      } else {
        res.send("Cancion ya existe, prueba con otro id");
      }
    }
  } catch (e) {
    console.error(e);
  }
});

// METODO GET - READ
app.get("/canciones", async (req, res) => {
  try {
    const canciones = JSON.parse(await fs.promises.readFile("canciones.json", "utf-8"));
    if (canciones.length != 0) {
      res.json(canciones);
    } else {
      res.send("No hay canciones!");
    }
  } catch (e) {
    console.error(e);
  }
});

// METODO PUT - UPDATE
app.put("/canciones/:id", async (req, res) => {
  try {
    const canciones = JSON.parse(await fs.promises.readFile("canciones.json", "utf-8"));
    const { id } = req.params;
    const cancion = req.body;
    const index = canciones.findIndex((p) => p.id == id);
    if (canciones.length != 0) {
      if (cancion.titulo || cancion.artista || cancion.tono) {
        canciones[index].titulo = cancion.titulo;
        canciones[index].artista = cancion.artista;
        canciones[index].tono = cancion.tono;
        await fs.promises.writeFile("canciones.json", JSON.stringify(canciones));
        res.send(`Cancion con id ${id} modificada exitosamente!`);
      }
      if (!cancion.titulo && !cancion.artista && !cancion.tono) {
        res.send(
          "Parametro a modificar no encontrado, cancion no modificada. Parametros: titulo, artista o tono"
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
    const canciones = JSON.parse(await fs.promises.readFile("canciones.json", "utf-8"));
    if (canciones.length > 0) {
      const index = canciones.findIndex((p) => p.id == id);
      if (index != -1) {
        canciones.splice(index, 1);
        await fs.promises.writeFile("canciones.json", JSON.stringify(canciones));
        res.send(`Cancion eliminada con id: ${id}`);
      } else {
        res.send(`No existe la cancion con id ${id}`);
      }
    } else {
      res.send("No hay canciones para eliminar.");
    }
  } catch (e) {
    console.error(e);
  }
});
