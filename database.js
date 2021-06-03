 
const mongoose = require('mongoose');

const MONGODB_URI = process.env.MONGODB_URI

mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(db => console.log('Database connected to', MONGODB_URI))
    .catch(err => console.log(err))