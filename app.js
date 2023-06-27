require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');

const routes = require('./routes/index');

const port = process.env.PORT || 3000;
// const { PORT = 3000 } = process.env;
/* http://localhost:3000 */

const app = express();

mongoose
  .connect('mongodb://0.0.0.0/mestodb', {
    useNewUrlParser: true,
  })
  .then(() => {
  //  console.log('connect to db');
  });

app.use(cookieParser());

app.use(express.json());

app.use(routes);

app.listen(port, () => {
//  console.log(`App listening on port ${port}`);
});

/* const bodyParser = require('body-parser'); */
// app.use(cookieParser());

/* app.use((req, res, next) => {
  req.user = {
    _id: '6485da795fb7954ee511993a',
  };

  next();
}); */

/* console.log(mongoose.Error); */
