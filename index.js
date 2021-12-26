'use strict'

const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const port = process.env.PORT || 8080
const history = require('connect-history-api-fallback')

const biblioteca = require('./backend/sql/biblioteca')
const nube = require('./backend/sql/nube')
const usuarios = require('./backend/sql/usuarios')
const juegos = require('./backend/sql/juegos')


const app = express()

app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())


var cors = require('cors');

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

async function ConectarBD() {

}



app.use(express.static('frontend/dist'));
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/frontend/dist/index.html');
});


app.listen(port, () => {
  console.log(`Backend funcionando en http://localhost:${port}`)
})

process.on('error', function (err) {
  console.log(err);
});

process.on('exit', function () {
  connection.end();
});
