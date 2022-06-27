const express = require("express");
const mysqConnection = require("../database");

const router = express.Router();


router.get("/findall/:id_client", function(request, response) {

    let id_client = request.params.id_client;
    let schedules = "SELECT scheduling.*, proceedings.*  FROM scheduling left join proceedings ON scheduling.id_proceedings = proceedings.id_proceedings WHERE id_client = ? ORDER BY date ASC";

    mysqConnection.query(schedules, [id_client], function(err, results) {

        if (err) {
            response.status(500).json({ message: "Erro ao buscar dados de agendamentos para o cliente!" })
        } else {
            console.log(results)
            response.status(200).json({ schedules: results });
        }

    });
});

router.post("/create", function(request, response) {

    const { time, date, professional, canceled, id_client, id_proceedings } = request.body;

    let sql = "INSERT INTO scheduling(time, date, professional, canceled, id_client, id_proceedings) VALUES(?, ?, ?, ?, ?, ?)";
    
    mysqConnection.query(sql, [time, date, professional, canceled, id_client, id_proceedings], (err, results) => {
        if (err) {
            response.status(500).json({message: "Erro ao cadastrar agendamento"+err})
        }
        if (results) {
            response.status(201).json({message: "Cadastro do agendamento realizado com sucesso!"})
        }

    });
});


router.put("/cancel/:id_scheduling", function(request, response) {

    const {id_scheduling} = request.params;

    let sql = "update scheduling set canceled = true where id_scheduling = ?";
    
    mysqConnection.query(sql, [id_scheduling], (err, results) => {
        if (err) {
            response.status(500).json({message: "Erro ao cancelar agendamento" + err})
        }
        if (results) {
            response.status(201).json({message: "Agendamento cancelado com sucesso!"})
        }

    });
});

module.exports = app => app.use('/schedules', router);