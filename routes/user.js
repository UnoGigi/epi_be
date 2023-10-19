const express = require('express')
const userModel = require('../models/users')
const users = express.Router()
const bcrypt = require('bcrypt')

users.get('/users', async (req, res) => {
    try {
        res.status(200)
            .send({
                statusCode: 200
            })
    } catch (error) {
        res.status(500)
            .send({
                statusCode: 500,
                message: "Errore del server"
            })
    }
})

users.post('/users/create', async (req, res) => {

    const salt = await bcrypt.genSalt(10) //livello criptazione
    const hashedPassword = await bcrypt.hash(req.body.password, salt) //metodo genera password cryptata(cosa deve criptare, con che algoritmo)

    const newUsers = new userModel({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: hashedPassword
    })

    try {
        const user = await newUsers.save()
        res.status(200)
            .send({
                statusCode: 200,
                message: "utente salvato",
                payload: user
            })
    } catch (error) {
        res.status(500)
            .send({
                statusCode: 500,
                message: "Errore del server"
            })
    }
})

users.patch('/users/update/:userId', async (req, res) => {
    const { userId } = req.params;

    const userExist = await userModel.findById(userId)

    if(!userExist) {
        return res.status(404).send({
            statusCode: 404,
            message: "l'utente non esiste"
        })
    }

    try {
        const userToUpdate = req.body;
        const options = { new:true }
        const result = await userModel.findByIdAndUpdate(userId, userToUpdate, options)

        res.status(200).send({
            statusCode: 200,
            message: "utente modificato",
            result
         })
    } catch (error) {
        res.status(500)
         .send({
            statusCode: 500,
            message: "errore interno del server"
         })
    }
})

users.delete('/users/delete/:userId', async (req, res) => {
    const { userId } = req.params
    try {
        const user = userModel.findByIdAndDelete(userId)
        if (!user) {
            return res.status(404).send({
                statusCode: 404,
                message: "utente gia cancellato"
             })
        }

        res.status(200).send({
            statusCode: 200,
            message: "Utente cancellato"
   
         })

    } catch (error) {
        res.status(500)
         .send({
            statusCode: 500,
            message: "errore interno del server"
         })
    }
})

module.exports = users