const mongoose = require('mongoose');

const voteSchema = mongoose.Schema({
    count: Number
}, { timestamps: true });

module.exports = mongoose.model('Vote', voteSchema);
