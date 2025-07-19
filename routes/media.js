const express = require('express');
const router = express.Router();
const { obtenerTweets } = require('../services/twitterService');

router.get('/', async (req, res) => {
  const { usuario = 'bioanimaluah', limite = 5 } = req.query;

  try {
    const tweets = await obtenerTweets(usuario, limite);
    res.status(200).json({ usuario, tweets });
  } catch (error) {
    console.error("Error al conectar con Twitter:", error);
    res.status(500).json({
      code: 'INTERNAL_ERROR',
      message: 'Error al obtener los tweets'
    });
  }
});

module.exports = router;
