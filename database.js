const mongoose = require('mongoose');

const MONGODB_URI = 'mongodb://localhost/ecommerce'

mongoose.connect(MONGODB_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(db => console.log('Database connected to', MONGODB_URI))
    .catch(err => console.log(err))
    