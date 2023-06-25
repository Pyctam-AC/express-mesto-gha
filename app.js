const express = require('express');
/* const bodyParser = require('body-parser'); */
const mongoose = require('mongoose');
// const cookieParser = require('cookie-parser')

const routes = require('./routes/index');

const { PORT = 3000 } = process.env;
/* http://localhost:3000 */

const app = express();

mongoose
  .connect('mongodb://0.0.0.0/mestodb', {
    useNewUrlParser: true,
  })
  .then(() => {
  //  console.log('connect to db');
    /* console.log(mongoose.Error); */
  });

app.use(express.json());

// app.use(cookieParser());

/* app.use((req, res, next) => {
  req.user = {
    _id: '6485da795fb7954ee511993a',
  };

  next();
}); */

app.use(routes);

app.listen(PORT, () => {
  /* console.log(`App listening on port ${PORT}`); */
});
