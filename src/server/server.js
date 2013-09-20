var express = require('express');
var port = 3000;
var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res){
    res.render('index/index', {title: 'Home'});
});
app.get('/beer', function(req, res){
    res.render('index/beer', {title: 'Beer'});
});
app.get('/terms', function(req, res){
    res.render('index/terms', {title: 'Terms'});
});
app.get('/about', function(req, res){
    res.render('index/about', {title: 'About'});
});

port = port || 3000;
console.log('server running on port: ' + port);
app.listen(port);
