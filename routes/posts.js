const express = require('express')
const postModel = require('../models/post')
const posts = express.Router()
const multer = require('multer')
const cloudinary = require('cloudinary').v2
const { CloudinaryStorage } = require('multer-storage-cloudinary')
require('dotenv').config()
const crypto = require('crypto') //genera id random
const verify = require('../middleware/Token')

cloudinary.config({
   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
   api_key: process.env.CLOUDINARY_API_KEY,
   api_secret: process.env.CLOUDINARY_API_SECRET
})


const cloudStorage = new CloudinaryStorage({
   cloudinary: cloudinary, 
   params: {
      folder:  'pippo13',
      format: async (req, file) => 'png',
      public_id: (req, file) => file.name
   }
})


const internalStorage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, './public') //posizione in cui salvare i file
   },
   filename: (req, file, cb) /*si da nome univoco*/ => {                /*configurazione base multer*/
      const uniqueSuffix = `${Date.now()}-${crypto.randomUUID()}`
      const fileExtension = file.originalname.split('.').pop()
      cb(null, `${file.fieldname}-${uniqueSuffix}.${fileExtension}`)
   } 
})

const upload = multer({storage: internalStorage})
const cloudUpload = multer ({storage: cloudStorage})

posts.post ('/posts/cloudUpload', cloudUpload.single('imgcover'), async (req, res) =>{
   try {
      res.status(200).json({ imgcover: req.file.path }) 
   } catch (error) {
      res.status(500)
         .send({
            statusCode: 500,
            message: "errore interno del server"
         })
   }
})

posts.post('/posts/upload', upload.single('imgcover'), async (req, res) => {
   const url = `${req.protocol}://${req.get('host')}` //genera il localhost

   try {
      const imgUrl = req.file.filename;
      res.status(200).json({imgcover: `${url}/public/${imgUrl}`})
   } catch (error) {
      res.status(500)
         .send({
            statusCode: 500,
            message: "errore interno del server"
         })
   }
})

posts.get('/posts', verify, async (req, res) => {
   const { page= 1, pageSize=3 } = req.query

   try {
      const posts = await postModel.find()
         .populate('author')
         .limit(pageSize)
         .skip((page -1) * pageSize)

      const totalPost = await postModel.count() /*tiene il conto*/

      res.status(200)
         .send({
            statusCode: 200,
            currentPage: Number(page),
            totalPages: Math.ceil(totalPost / pageSize),
            totalPost,
            posts
         })
   } catch (e) {
      res.status(500)
         .send({
            statusCode: 500,
            message: "errore interno del server"
         })
   }
})

posts.post('/posts/create', async (req, res) => {

   const newPost = new postModel({
      title: req.body.title,
      category: req.body.category,
      imgcover: req.body.imgcover,
      description: req.body.description,
      rate: Number(req.body.rate),
      author: req.body.author
   })

   try {
      const post = await newPost.save()
      res.status(200)
         .send({
            statusCode: 200,
            message: "post salvato",
            payload: post
         })
   } catch (error) {
      res.status(500)
         .send({
            statusCode: 500,
            message: "errore interno del server"
         })
   }
})

posts.patch('/posts/update/:postId', async (req, res) => {
   const { postId } = req.params;

   const postExist = await postModel.findById(postId)

   if (!postExist) {
      return res.status(404).send({
         statusCode: 404,
         message: "il post non esiste"
      })
   }

   try {
      const dataToUpdate = req.body;
      const options = { new: true }
      const result = await postModel.findByIdAndUpdate(postId, dataToUpdate, options)

      res.status(200).send({
         statusCode: 200,
         message: "post modificato",
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

posts.delete('/posts/delete/:postId', async (req, res) => {
   const { postId } = req.params
   try {
      const post = await postModel.findByIdAndDelete(postId)
      if (!post) {
         return res.status(404).send({
            statusCode: 404,
            message: "post gia cancellato"
         })
      }

      res.status(200).send({
         statusCode: 200,
         message: "Post cancellato"

      })


   } catch (error) {
      res.status(500)
         .send({
            statusCode: 500,
            message: "errore interno del server"
         })
   }

})


module.exports = posts