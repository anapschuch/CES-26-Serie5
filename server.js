const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

let fs = require('fs');

app.use(express.json());

app.get('/api/dados', (req, res) => {
  fs.readFile(__dirname  + "/public/dados.json", 'utf8', function (err, data) {
    let dados = data;
    dados = JSON.parse(dados);
    console.log(dados);
    res.send({ express: dados })
  })
});

app.post('/api/enviar', (req,res) => {
  fs.writeFile(__dirname  + "/public/dados.json", JSON.stringify(req.body), function (err) {
    if (err) return console.log(err);
    console.log('Arquivo salvo com sucesso');
  });
})

app.listen(port, () => console.log(`Listening on port ${port}`));