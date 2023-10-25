/*const express = require('express')
const validate = express.Router()
const jwt = require('jsonwebtoken')
require('dotenv').config()

validate.post("/verify", async(res,rq) => {
    const validToken = jwt.verify(req.body.sessionTokens, process.env.JWT_SECRET)
    console.log(validToken);
    res.status(200).send({
        statusCode: 200
    })
})

module.exports = validate*/