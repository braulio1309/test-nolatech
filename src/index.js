// Importar los módulos necesarios
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const router = express.Router();
require('dotenv').config();

// Crear una instancia de Express
const app = express();

// Configurar el middleware body-parser para procesar las solicitudes con cuerpo JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Configurar el middleware morgan para el registro de solicitudes HTTP
app.use(morgan('dev'));

//routes
app.use('/api/v1', require('./routes/users'))

// Configurar el puerto en el que el servidor escuchará las solicitudes
const PORT = process.env.PORT || 3000;

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
