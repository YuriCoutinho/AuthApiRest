require('dotenv').config()
const {connect} = require('mongoose')

// Database Address
const url = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0.ncm6f1i.mongodb.net/?retryWrites=true&w=majority`

const connectBd = () =>{
    return connect(url)
}

module.exports= {connectBd}