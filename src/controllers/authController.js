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
                console.log(results)
                // se tiver algun problema com a query, mostrar o erro
                if (error) {
                    res.status(400).json({ message: "Erro ao tentar realizar autenticação no banco de dados!" })
                } else {
                    //se a conta existe
                    if (results.length > 0) {
                        let user = {name: results[0].name, birthday: results[0].birthday, wpp: results[0].wpp, email: results[0].email, id_client: results[0].id_client}
                        res.status(200).json({ message: "Login efetuado com sucesso!", user, signed:true });
                    } else {
                        res.status(400).json({message: "Email ou senha inválidos!", signed:false});
                    }
                }
            }); 
        }
    } catch (error) {
      res.status(400).json({message: "erro"})
    }

});

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

module.exports = app => app.use('/auth', router);