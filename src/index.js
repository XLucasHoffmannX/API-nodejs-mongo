require('dotenv').config();
// dependencies externs
const express = require('express');

const mongoose = require('mongoose');
// dependencies interns

//
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }))

app.use('/auth', require('./app/controllers/authController'));
app.use('/projects', require('./app/controllers/projectController'));

// Connect to mongodb
const URI = process.env.MONGODB_ACCESS;
mongoose.connect(URI, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
}, err=>{
    if(err) throw err;
    console.log('Conectado ao Cluster')
})

const PORT = process.env.PORT || 3000
app.listen(PORT, console.log(`Server in on port ${PORT}`))