var express = require("express");
var app = express()
const PORT = 5000;
var formidable = require('formidable');
var path = require("path")

app.use(express.urlencoded({
    extended: true
}));

app.listen(PORT, function () {
    console.log("start serwera na porcie " + PORT)
    app.use(express.static('static'))
})

app.get("/", function (req, res) {
    res.send('taka prowizorka serwera :D')
})

app.post('/upload', function (req, res) {

    let form = formidable({});

    form.uploadDir = __dirname + '/uploads/'
    form.keepExtensions = true   // zapis z rozszerzeniem pliku      // folder do zapisu zdjęcia
    form.multiples = true

    form.parse(req, function (err, fields, files) {

        console.log("----- przesłane pola z formularza ------");

        console.log(fields);

        console.log("----- przesłane formularzem pliki ------");

        console.log(files);

        res.setHeader("content-type", "application/json")
        res.send(JSON.stringify([fields, files], null, 5));
    });
});