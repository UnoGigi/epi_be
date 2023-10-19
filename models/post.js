const mongoose = require('mongoose')

const PostSchema = new mongoose.Schema({
    title:{
        type: String,
    },

    category:{
        type: String,
    },

    imgcover:{
        type: String,
    },

    author:{
        type: mongoose.Schema.Types.ObjectId,   /*per riprendere i dati degli autori*/
        ref: 'userModel'
    },

    description:{
        type: String,
    },

    rate:{
        type: Number,
    }

}, { timestamps: true, strict: true })

module.exports = mongoose.model('postModel', PostSchema, 'posts')