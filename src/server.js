const express = require('express')
const server = express()

//Pegar o banco de dados
const db= require("./database/db")

//Configurar pasta publica
server.use(express.static('public'))

//Habilitar o uso do req.body
server.use(express.urlencoded({extended : true}))

//Utilizando template engine
const nunjucks = require('nunjucks')
nunjucks.configure('src/views',{
    express: server,
    noCache: true
})

//Configurar caminhos da minha aplicação 

//Pagina inicial
server.get('/',(req,res) =>{
    return res.render('index.html',{title : 'Um titulo'})
})

//Outras rotas
server.get('/create-point',(req,res) =>{
   return res.render('create-point.html')
})

server.post('/savepoint',(req,res) =>{

    //console.log(req.body)

    //Inserir dados no banco de dados
    const query = `
        INSERT INTO PLACES (
            image,name,adress,adress2,state,city,items
        ) 
    VALUES (?,?,?,?,?,?,?);
   `
    const values = [
        req.body.image,
        req.body.name,
        req.body.adress,
        req.body.adress2,
        req.body.state,
        req.body.city,
        req.body.items
        ]

    function afterIsertData(err){
        if(err){
           return console.log(err)
        }

        console.log("Cadastrado com sucesso")
        console.log(this)

         return res.render('create-point.html', {saved : true})

    }

    db.run(query,values,afterIsertData)

   


})

server.get('/search',(req,res) =>{

    const search = req.query.search

    if(search == ''){
        //pesquisa vazia
        return res.render('search-results.html', {total:0})
    }

    //Pegar os dados do  banco de dados
    db.all(`SELECT * FROM places WHERE city LIKE '%${search}%'`,function(err,rows){
        if(err){
            return console.log(err)
        }

        const total = rows.length
        

        return res.render('search-results.html', {places:rows, total:total})

    })

 })



// ligar o servidor
server.listen(3000)