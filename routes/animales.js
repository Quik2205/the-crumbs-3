const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const DATA_PATH = path.join(__dirname, '..', 'animales.json');

function getAnimales() {
  return JSON.parse(fs.readFileSync(DATA_PATH, 'utf8'));
}

function saveAnimales(animales) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(animales, null, 2));
}

router.get('/', (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const animales = getAnimales();
    const start = (page - 1) * limit;
    const paginados = animales.slice(start, start + parseInt(limit));
    res.status(200).json({ animales: paginados });
  } catch (error) {
    res.status(500).json({
      code: "INTERNAL_ERROR",
      message: "Error inesperado al obtener los animales"
    });
  }
});

router.post('/', (req, res) => {
  try {
    const { Nombre_cientifico, Familia, Dieta, Peso_kg, Habitat } = req.body;
    let errores = [];

    if (!Nombre_cientifico) errores.push("El campo 'Nombre_cientifico' es obligatorio");
    if (!Familia) errores.push("El campo 'Familia' es obligatorio");
    if (!Dieta) errores.push("El campo 'Dieta' es obligatorio");
    if (Peso_kg === undefined || Peso_kg === null) errores.push("El campo 'Peso_kg' es obligatorio");
    if (!Habitat) errores.push("El campo 'Habitat' es obligatorio");

    if (errores.length > 0) {
      return res.status(400).json({ error: errores });
    }

    const animales = getAnimales();
    const nuevo = {
      ID: animales.length > 0 ? animales[animales.length - 1].ID + 1 : 1,
      Creado_en: new Date().toISOString(),
      Nombre_cientifico,
      Familia,
      Dieta,
      Peso_kg,
      Habitat
    };

    animales.push(nuevo);
    saveAnimales(animales);

    res.status(200).json({
      mensaje: "Animal agregado correctamente",
      animal: nuevo
    });

  } catch (error) {
    res.status(500).json({
      code: "INTERNAL_ERROR",
      message: "Error inesperado al agregar el animal"
    });
  }
});

router.delete('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id);
    let animales = getAnimales();

    const index = animales.findIndex(animal => animal.ID === id);
    if (index === -1) {
      return res.status(404).json({ error: 'Animal no encontrado' });
    }

    animales.splice(index, 1);
    saveAnimales(animales);

    res.status(200).json({ mensaje: 'Animal eliminado correctamente' });
  } catch (error) {
    res.status(500).json({
      code: 'INTERNAL_ERROR',
      message: 'Error inesperado al eliminar el animal'
    });
  }
});

module.exports = router;
