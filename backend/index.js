const express = require('express');
const cors = require('cors');
const { mysqlConnection } = require('./database/mysqldb');
const bodyParser = require('body-parser');

const app = express();

app.use(cors());
/* */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

require('dotenv').config();

mysqlConnection();

app.listen(process.env.PORT, () => {
    console.log('Servidor corriendo en el puerto ' + process.env.PORT);
});


app.get('/', (req, res) => {
    res.send('Hello World');
})