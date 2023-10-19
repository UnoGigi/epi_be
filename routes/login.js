const express = require('express')
const login = express.Router()
const bcrypt = require('bcrypt')
const userModel = require('../models/users')
const jwt = require('jsonwebtoken')
require('dotenv').config() //serve per le varibili d'ambiente

login.post('/login', async (req, res) => {
    const user = await userModel.findOne({email: req.body.email}) //recupero utente per email

    if(!user) {
        return res.status(404).send({
            message: 'nome utente errato',
            statusCode: 404
        })
    }

    const validPassword = await bcrypt.compare(req.body.password, user.password) //controllo validità password(password utente, password che abbiamo trovato)

    if(!validPassword) {
        return res.status(400).send({
            statusCode:400,
            message: 'email o password errati'
        })
    }

    const token = jwt.sign({                //genero token e metto tutto quello che voglio torni cryptato
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email
    }, process.env.JWT_SECRET, {expiresIn: '24h'})  //expiresIn: durata token


    res.header('Authorization', token).status(200).send({
        message:"Login effettuato con successo",
        statusCode:200,
        token
    })
})

module.exports = login;