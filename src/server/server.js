var express = require('express');
var port = 3000;
var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.render('index/index', {title: 'Home'});
});

port = port || 3000;
console.log("server running on port: " + port);
app.listen(port);
