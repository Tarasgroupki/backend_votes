const mongoose = require('mongoose');

const questionSchema = mongoose.Schema({
    text: String,
    type: {
       type: String,
       enum: [ 'trivia', 'poll' ],
       default: 'poll'
    },
    answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Answer' }]
}, { timestamps: true });

module.exports = mongoose.model('Question', questionSchema);
