const connectToMongo=require("./db.js");
connectToMongo();
const express = require('express');
var bcrypt = require('bcryptjs');
var cors = require('cors');
const port = 5000;
const app = express();


app.use(cors());

app.use(express.json());

// app.get('/', (req, res) => {
//   res.send('Hello World!')
// });

//  Available Routes
app.use("/api/auth",require("./routes/auth"));
app.use("/api/notes",require("./routes/notes"));

app.listen(port, () => {
  console.log(`iNotebook backend listening at http://localhost:${port}`)
})




