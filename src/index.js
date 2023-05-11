require('dotenv').config()
const express = require('express')
const { connectBd }= require('./database')

const Routes = require('./Routes/index');

const app = express()

app.use(express.json())
app.use(express.urlencoded({extended: true}))

app.use('/auth', Routes.accountRoutes);

connectBd().then(app.listen(3332, ()=> console.log('Server Online')))

