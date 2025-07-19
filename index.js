const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const animalesRouter = require('./routes/animales');
const mediaRouter = require('./routes/media'); // 👈 Agregado aquí

const app = express();
const swaggerDocument = YAML.load('swagger.yml');

const PORT = 3000;

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json());

app.use('/api/animales', animalesRouter);
app.use('/media', mediaRouter); // 👈 Y registrado aquí

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
