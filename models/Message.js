const mongoose = require('mongoose');
const Schema = mongoose.Schema;

module.exports = mongoose.model('Message', {
    from: {type: String, required: true},
    to: {type: String},
    content: {type: String, required: true}
})
