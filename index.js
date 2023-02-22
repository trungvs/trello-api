require('rootpath')();
require('dotenv').config()
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

app.use('/board', require('./controllers/Board.controller'));
app.use('/todo', require('./controllers/Todo.controller'));

// start server
const port = process.env.NODE_ENV === 'production' ? 8080 : 4000;
app.listen(port, function () {
    console.log('Server listening on port ' + port);
});
