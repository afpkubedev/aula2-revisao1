var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var product = require('./routes/product'); 

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

const serverStatus = () => {
    return { 
       state: 'up', 
       dbState: mongoose.STATES[mongoose.connection.readyState] 
    }
  };

app.get('/health', (res, req) => {
    let healthResult = serverStatus();   
    if (mongoose.connection.readyState == 0) {
        req.statusCode = 500;
        req.send('down');        
    } else {
        req.json(healthResult);
    }
});

app.use('/api/products', product);

var developer_db_url = 'mongodb://mongouser:mongopwd@localhost:27017/admin';
var mongoDB = process.env.MONGODB_URI || developer_db_url;

mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var port = 8080;

mongoose.connect(mongoDB);
app.listen(port, () => {
    console.log('Server is up and running on port numner ' + port);
});
