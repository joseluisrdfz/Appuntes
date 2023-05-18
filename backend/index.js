const express = require('express');
const cors = require('cors');
const { mysqlConnection } = require('./database/mysqldb');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());

//app.use(bodyParser)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('dotenv').config();

app.use('/api/uni', require('./routes/universidades'))
app.use('/api/grado', require('./routes/grados'))
app.use('/api/asignaturas', require('./routes/asignaturas'))
app.use('/api/apuntes', require('./routes/apuntes'))
app.use('/api/users', require('./routes/users'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/preguntas', require('./routes/preguntas'))

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});

/* app.get('/', (req, res) => {

}) */