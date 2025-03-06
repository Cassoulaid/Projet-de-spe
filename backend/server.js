console.log("test");

const express = require("express");
const port = 5000;
const app = express();
const cors = require('cors');

app.use(cors({
    origin: '*'
}))

app.get('/', (rep, res) => {
    res.send({id: 20, name: 'théo'})
})

app.get('/test', (rep, res) => {
    console.log('requete', rep)
    res.send('ok.test')
})

app.listen(port, () => {
    console.log('Le serveur fonctionne sur le port' + port);
})
