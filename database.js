  
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/normalizr', {
    useUnifiedTopology: true,
    useNewUrlParser: true
})
    .then(db => console.log('Database connected to mongodb://localhost/normalizr'))
    .catch(err => console.log(err))