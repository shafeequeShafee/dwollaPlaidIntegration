// Using Express
const express = require('express');
const app = express();
app.use(express.json());
const mongoose = require("mongoose")
const cors = require('cors');
const bodyParser = require('body-parser');



app.use(
    bodyParser.urlencoded({
      extended: false,
    }),
  );
app.use(bodyParser.json());
app.use(cors());



const url ='mongodb://localhost/Plaid_Demo';
mongoose.connect(url, { useNewUrlParser: true }) 
const con = mongoose.connection 



con.on('open', function () {
    console.log("connected...")
})




const routerDwolla = require("./router/router")
const routerPlaid=require("./router/plaidRouter")

app.use('/plaid',routerPlaid)
app.use('/dwolla',routerDwolla)



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("server is running 0n 3000")
})
