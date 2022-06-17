const express = require("express");
const mysqConnection = require("../database");

const router = express.Router();




router.get("/findall/:id_client", function(request, response) {

    let id_client = request.params.id_client;
    let schedules = "SELECT * FROM scheduling WHERE id_client = ? ";

    mysqConnection.query(schedules, [id_client], function(err, results) {

        if (err) {
            response.status(500).json({ message: "Erro ao buscar dados de agendamentos para o cliente!" })
        } else {
            console.log(results)
            response.status(200).json({ schedules: results });
        }

    });


});



router.post("/scheduling", function(request, response) {
    if (request.session.loggedin) {
        //faz a requisicao do email da sessao para estar logado
        let email = request.session.email;
        //variavel para realizar o comando MySQL
        let sql = "SELECT id_client FROM nodelogin.accounts WHERE email = ?";
        connection.query(sql, [email], function(err, results) {
            if (err) {
                response.redirect("/signed");
            }
            if (results) {
                const { time } = request.body;
                const { date } = request.body;
                const { professional } = request.body;
                const { proceedings } = request.body;
                const { id_client } = results[0];

                let sqldate = "SELECT * FROM nodelogin.scheduling WHERE time = ? and date = ? and professional = ? and proceedings = ? ";

                connection.query(sqldate, [time, date, professional, proceedings], (err, results) => {
                    if (err) {
                        response.redirect("/signed");
                    }
                    if (results.length > 1) {
                        console.log("ja existe agendamento");
                    } else {
                        let sqlmark = "INSERT INTO nodelogin.scheduling (time, date, professional, proceedings, id_client) VALUES(?, ?, ?, ?, ?)";
                        connection.query(sqlmark, [time, date, professional,
                            proceedings, id_client
                        ], (err, results) => {
                            if (err) {
                                console.log("não foi agendado");
                            }
                            if (results) {
                                console.log("atendimento agendado");
                            }
                        });
                    }
                });
            }
        });
    } else {
        // 	// Nao esta logado
        response.redirect("/home");
    }
});

module.exports = app => app.use('/schedules', router);