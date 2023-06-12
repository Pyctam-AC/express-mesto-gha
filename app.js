const express = require('express');
const bodyParser = require('body-parser');
const routes = require('./routes/index');
const mongoose = require('mongoose');

const { PORT = 3000 } = process.env;
//http://localhost:3002

const app = express();

mongoose.connect('mongodb://0.0.0.0/mestodb', {
  useNewUrlParser: true,
  //family: 4,
}).then(()=> {
    console.log('connect to db');
});


app.use(bodyParser.json());

app.use((req, res, next) => {
  req.user = {
    _id: '6485da795fb7954ee511993a'
  };

  next();
});

app.use(routes);

app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`)
});