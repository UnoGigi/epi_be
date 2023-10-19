const express = require('express')
const mongoose = require('mongoose')
const postRoute = require('./routes/posts')
const userRoute = require('./routes/user')
const loginRoutes = require('./routes/login')
const cors = require('cors')
const path = require('path') //si usa per fare upload file, gia presente no install
const PORT = 5050;

const app = express();

//middleware
app.use('/public', express.static(path.join(__dirname, 'public')))
app.use(cors())
app.use(express.json()) /* obbligatorio se no non legge */
app.use('/', postRoute)
app.use('/', userRoute)
app.use('/', loginRoutes)


mongoose.connect('mongodb+srv://fabioborrelli64:ZrpCB9XPzknYoYpa@gigicluster0.cfcyqqm.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'error during db connection'))
db.once('open', () => {
    console.log("database caricato");
})

app.listen(PORT, () => console.log(`Server up and running ON on port ${PORT}`))  



