const express = require("express");
const mysqConnection = require("../database");

const router = express.Router();


router.get("/findall", function(request, response) {

    let proceedings = "SELECT * FROM proceedings ORDER BY name ASC";

    mysqConnection.query(proceedings, function(err, results) {

        if (err) {
            response.status(500).json({ message: "Erro ao buscar os dados dos procedimentos!" })
        } else {
            console.log(results)
            response.status(200).json({ proceedings: results });
        }

    });
});
module.exports = app => app.use('/proceedings', router);