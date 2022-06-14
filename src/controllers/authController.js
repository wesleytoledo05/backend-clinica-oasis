const express = require("express");
const mysqConnection = require("../database");

const router = express.Router();

//-----------------cadastro-----------------//
router.post('/register', async(request, response) => {
  try {
  //faz a requisição vinda do body do html para realizar o cadastro
  const { name, birthday, wpp ,email ,password } = request.body;
  
  //TODO: fazer um select no banco de dados utilizando COUNT na tbela de accounts buscando pelo email, se retornar mais que 1
  //retornar uma mensagem de email cadastrado
  
  let sqldate = "SELECT (SELECT COUNT(*) FROM accounts WHERE email = ?) > 0 as num_rows;";
  
  mysqConnection.query(sqldate, [email], (err, results) => {

    if(results[0].num_rows > 0){
      return response.status(400).json({ message: "Email já existente!" })
    }else {
      let SQL = "INSERT INTO accounts(name, birthday, wpp, email, password) VALUES ( ?, ?, ?, ?, MD5(?))";
    
      mysqConnection.query(SQL, [name, birthday, wpp, email, password], (err, results) => {
              if (err) {
                console.log(err)
                  response.status(404).json({ message: "Erro ao tentar realizar cadastro no banco de dados. Revise as informações" })
              } else {
  
               if (results) {
                  response.status(200).json({ message: "Cadastro realizado com sucesso. Faça login para acessar a plataforma!"})
              }
            }
          })
    }
  
  })
  

    //variavel para realizar o comando MySQL
    
    } catch (err) {
        response.status(400).json({ message: 'Falha ao tentar registrar' });
    }
})

//-----------------autenticação-----------------//
router.post('/login', async(req, res) => {
    try {

        //faz a requisição dos campos inseridos no html
        let email = req.body?.email || null;
        let password = req.body?.password || null;

        // tem certeza que o usuario colocou informações nos campos de login
        if (email && password) {
            //faz a busca no banco de dados para ver se o usuario possui um cadastro feito
            mysqConnection.query('SELECT * FROM accounts WHERE email = ? AND password = MD5(?)', [email, password], function(error, results, fields) {
                // se tiver algun problema com a query, mostrar o erro
                if (error) {
                    res.status(400).json({ message: "Erro ao tentar realizar autenticação no banco de dados" })
                } else {
                    //se a conta existe
                    if (results.length > 0) {
                        res.status(200).json({ message: "Login efetuado com sucesso!" });
                    } else {
                        res.status(400).json({message: "Verifique as informações, e tente novamente!"});
                    }
                }
            }); 
        }
    } catch (error) {
      res.status(400).json({message: "erro"})
    }

});

// // http://localhost:5500/signed
router.get('/signed', async(request, response) => {
    //se o usuario esta logado 
    if (request.session.loggedin) {
        //faz a requisicao do email da sessao para estar logado
        let email = request.session.email;
        let sql = "SELECT * FROM nodelogin.accounts WHERE email = ?"

        connection.query(sql, [email], function(error, results) {
            let usuario = results[0]
            response.render('pages/logado', { usuario: usuario });
        })

    } else {
        // 	// Nao esta logado
        response.redirect('/home');
    }

});



// http://localhost:5500/register
router.post("/register", async(request, response) => {
  
    //faz a requisição vinda do body do html para realizar o cadastro
    const { nome } = request.body;
    const { data_nasc } = request.body;
    const { wpp } = request.body;
    const { email } = request.body;
    const { password } = request.body;

    //variavel para realizar o comando MySQL
    let SQL = "INSERT INTO accounts(nome, data_nasc, wpp, email, password) VALUES ( ?, ?, ?, ?, MD5(?))";

    connection.query(SQL, [nome, data_nasc, wpp, email, password], (err, results) => {
        if (err) {
            response.json({ status: 500, message: "Erro ao tentar realizar cadastro. Revise as informações" })
        }
        //se a conta existe
        if (results) {
            
            response.json({ status: 200, message: "Cadastro realizado com sucesso." })

        }

    })
})


router.post('/recsenha_1', async(request, response) => {
    //faz a requisição vinda do body do html para fazer a recuperação de senha
    const { wpp } = request.body;
    const { email } = request.body;
    //variavel para realizar o comando MySQL
    let senha = "SELECT * FROM nodelogin.accounts WHERE email = ? and wpp = ?"
    connection.query(senha, [email, wpp], (err, results) => {
        if (err) {
            response.redirect('/recsenha')
        }
        if (results) {
            request.session.email = email
            response.redirect('/recsenha2')
        }
    })
})

router.post('/recsenha_2', async(request, response) => {
    //faz a requisição vinda do body do html para saber qual a senha que sera inserida
    const { password } = request.body;
    //faz a requisicao do email da sessao para estar logado
    let email = request.session.email;
    //variavel para realizar o comando MySQL
    let passwordsql = "UPDATE accounts SET password = MD5(?) WHERE email = ?"
    connection.query(passwordsql, [password, email], (err, results) => {
        if (err) {
            response.redirect('/recsenha1')
        }
        if (results) {
            response.redirect('/signed')
        }
    })
})

//-------alteracao de dados--------------//
router.get('/signed/alterdata', async(request, response) => {
    if (request.session.loggedin) {
        //faz a requisicao do email da sessao para estar logado
        let email = request.session.email;
        //variavel para realizar o comando MySQL
        let sql = "SELECT * FROM nodelogin.accounts WHERE email = ?"
        connection.query(sql, [email], function(error, results) {
            let user = results[0]
            response.render('pages/alterdata', { user: user });
        })

    } else {
        // 	// Nao esta logado
        response.redirect('/home');
    }
});

router.post('/altername', async(request, response) => {
    //faz a requisição vinda do body do html para alterar o nome
    const { name } = request.body;
    //faz a requisicao do email da sessao para estar logado
    let email = request.session.email;
    //variavel para realizar o comando MySQL
    let password = "UPDATE accounts SET name = ? WHERE email = ?"
    connection.query(password, [name, email], (err, results) => {
        if (err) {
            response.redirect('/signed/alterdata')
        }
        if (results) {
            response.redirect('/success')
        }
    })
})

router.post('/alterwpp', async(request, response) => {
    //faz a requisição vinda do body do html para alterar o whatsrouter
    const { wpp } = request.body;
    //faz a requisicao do email da sessao para estar logado
    let email = request.session.email;
    //variavel para realizar o comando MySQL
    let senha = "UPDATE accounts SET wpp = ? WHERE email = ?"
    connection.query(senha, [wpp, email], (err, results) => {
        if (err) {
            response.redirect('/signed/alterdata')
        }
        if (results) {
            response.redirect('/success')
        }
    })
})

router.post('/alterpassword', async(request, response) => {
    //faz a requisição vinda do body do html para alterar a senha ja estando logado
    const { password } = request.body;
    //faz a requisicao do email da sessao para estar logado
    let email = request.session.email;
    //variavel para realizar o comando MySQL
    let senha = "UPDATE accounts SET password = MD5(?) WHERE email = ?"
    connection.query(senha, [password, email], (err, results) => {
        if (err) {
            response.redirect('/signed/alterdata')
        }
        if (results) {
            response.redirect('/success')
        }
    })
})

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

router.get("/schedule", function(request, response) {
    //se o usuario esta logado
    if (request.session.loggedin) {
        //faz a requisicao do email da sessao para estar logado
        let email = request.session.email;
        let sql = "SELECT id_client FROM nodelogin.accounts WHERE email = ?";
        connection.query(sql, [email], function(err, results) {
            let user = results[0];
            if (err) throw err;
            if (results) {
                let schedules =
                    "SELECT * FROM nodelogin.scheduling WHERE id_client = ? ";
                connection.query(schedules, [user], function(err, results) {
                    let schedue = (results);
                    // response.render('pages/agendamentos.ejs', {schedue:schedue});
                });
            }
        });
    } else {
        // 	// Nao esta logado
        response.redirect("/home");
    }
});

module.exports = app => app.use('/auth', router);