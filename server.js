const express = require("express");
const app = express();
const mongoose = require("mongoose");
const http = require('http').createServer(app);
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require('path');

const users = require("./routes/api/users");

app.use(cors());


// Bodyparser middleware
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.use(bodyParser.json());
// DB Config
const db = require("./config/keys").mongoURI;
// Connect to MongoDB

mongoose
  .connect(
    db,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  )
  .then(() => console.log("MongoDB successfully connected"))
  .catch(err => console.log(err));

app.use("/api/users", users);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

const port = process.env.PORT || 5000; // process.env.port is Heroku's port if you choose to deploy the app there
http.listen(port, () => console.log(`Server up and running on port ${port} !`));