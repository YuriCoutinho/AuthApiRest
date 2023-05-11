require('dotenv').config()
const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

router.get('/register', async (req, res) => {
  const users = await User.find()
  return res.status(200).json(users)
});

router.post('/register', async (req, res)=>{
    const {name, email, password} = req.body

    if(!name)
    return res.status(422).json({message: "Username is required"})

    if(!email)
    return res.status(422).json({message: "Email is required"})

    if(!password)
    return res.status(422).json({message: "Password is required"})

    const userExists = await User.findOne({email})

    if(userExists)
    return res.status(422).json({message: "User already exists"})
    
    const saltRounds = 12;
    const salt = await bcrypt.genSalt(saltRounds)
    const passwordHash = await bcrypt.hash(password, salt) 
    
    const user = new User({name, email, password: passwordHash})

    try {
        await user.save()
        return res.status(201).json({message: "User Created"})
    } catch (error) {
        res.status(500).json({error})
    }
})

router.post('/login', async(req, res)=>{
    
    const {email, password} = req.body
    if(!email)
    return res.status(422).json({message: "Email is required"})

    if(!password)
    return res.status(422).json({message: "Password is required"})

    const user = await User.findOne({email})
    if(!user)
    return res.status(422).json({message: "User does not exist"})

    const checkPassword = await bcrypt.compare(password, user.password)
    if(!checkPassword)
    return res.status(422).json({message: "Invalid Password"})

    try {
        const secret = process.env.SECRET
        const token = await jwt.sign({id: user._id}, secret)
        return res.status(200).json(token)
    } catch (error) {
        return res.status(500).json({error})
    }
})

async function checkToken (req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if(!token)
    return res.status(401).json({message: 'Access Denied'})

    try {
        const secret = process.env.SECRET
        await jwt.verify(token, secret)
        next()
    } catch (error) {
        return res.status(400).json({message: "Invalid Token"})
    }
}

router.get('/user/:id', checkToken, async (req, res) =>{
    const { id } = req.params
    
    try {
        const user = await User.findById({_id: id},'-password')
        return res.status(200).json(user)

    } catch (error) {
        return res.status(404).json({message:"User does not exists"})
        
    }
})

module.exports = router;