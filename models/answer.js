const mongoose = require('mongoose');

const answerSchema = mongoose.Schema({
    text: String,
    vote: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vote',
        default: null
    }
}, { timestamps: true });

module.exports = mongoose.model('Answer', answerSchema);
