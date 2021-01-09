// Using http module to create a server using the express app
var http = require('http')
var express = require('express')//won't work unless express is installed
var bodyParser = require('body-parser');
var app = express()
var server = http.Server(app)
var Article=require('./article.model');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//DB connection
var mongoose = require('mongoose')
mongoose.Promise = global.Promise
var dbURL = 'mongodb://localhost:27017/cw10' //change this if you are using Atlas
mongoose.connect(dbURL, { useNewUrlParser: true, useUnifiedTopology: true })
mongoose.connection.on('error', function (err) {
 console.log(err);
});


// your server routes go here
app.get('/', function (request, response) {
   //console.log(request);//Go to browser type localhost:3000 at the url box, we will send a request at this route
   //response.status(200);//sending a reponse status 200
   console.log(__dirname);//shows root address of the file, the first part of the address
   response.sendFile(__dirname + '/index.html');//read file from filesystem and send it back in the response
});
//add a Get route/second that returns second.html in the response
app.get('/second', function (request, response) {
   console.log('second route request');
   console.log(__dirname);
   response.sendFile(__dirname + '/second.html');
});
app.get('/article/form', function (request, response) {
   response.sendFile(__dirname + '/form.html');
});
var articles = [{ title: 'test', content: 'testContent' },{ title: 'test1', content: 'test1Content' },{ title: 'test2', content: 'test2Content' }];


app.post('/article/new', function (request, response) {
   var newArticle = new Article(request.body)
   newArticle.save(function (err, data) {
     if (err)
       return response.status(400).json({
         error: 'Title is missing'
       })
     return response.status(200).json({
       message: 'Article created successfully'
     })
   })
  })
  


app.get('/article/:id', function (request, response) {
   console.log(request.params.id);
   Article.findById(request.params.id, function (err, data) {
     response.render('article.ejs', {
       article: data
     })
   })
  })
  

app.get('/articles/all', function (request, response) {
   Article.find({}, function (err, data) {
      console.log(data);
     response.render('allArticles.ejs', {
       articles: data
     })
   })
  })
  

/*
it will start a server that listens to port 3000 at locahost and if we send this 
running server a request to the root route which is localhost 3000, we should see 
the console log of the request object
*/

server.listen(process.env.PORT || 3000, //starting the server to listen to port 3000 at localhost
   process.env.IP || 'localhost', function () {
      console.log('Server running');// this line of code is executed
   })
module.exports = { app, server, mongoose };
// update this server.js to add the different routes for our application