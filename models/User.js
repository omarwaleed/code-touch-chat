const mongoose = require('mongoose');

module.exports = mongoose.model('User', {
    name: {type: String, required: true},
    // in practice, should use redis
    online: {type: Boolean, default: true}
})
