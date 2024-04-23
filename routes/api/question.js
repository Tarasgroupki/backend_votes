const express = require('express');

const router = express.Router();
const Question = require('../../models/question');
const Answer = require('../../models/answer');
const Vote = require('../../models/vote');

router.get('/', async (req, res) => {
    try {
        const questions = await Question.find().populate({ path: 'answers', populate: { path: 'vote' } });

        return res.status(200).json({
            message: 'OK!',
            questions
        });
    } catch (err) {
        throw err;
    }
});

router.get('/:questionId', async (req, res) => {
    try {
        const { questionId } = req.params;
        const question = await Question.findById(questionId).populate({ path: 'answers', populate: { path: 'vote' } });

        return res.status(200).json({
            message: 'OK!',
            question
        });
    } catch (err) {
        throw err;
    }
});

router.post('/', async (req, res) => {
  try {
      const { questionText, type, answersList } = req.body;

      if (type === 'trivia' && answersList.length > 1) {
          return res.status(409).json({
              message: 'Trivia question should have only 1 answer!'
          });
      }

      const answersMetadata = await Promise.all(answersList.map(async (answer) => {
          const vote = type === 'poll' ? await new Vote({ count: 0 }).save() : null;

          return { text: answer, vote: vote ? vote._id : null };
      }));
      const answers = await Answer.insertMany(answersMetadata);
      const question = await Question({
          text: questionText,
          type,
          answers: answers.map(answer => answer._id)
      }).save();
      question.answers = answers;

      return res.status(201).json({
          message: 'Question created!',
          question
      });
  } catch (err) {
      throw err;
  }
});

router.post('/vote', async (req, res) => {
    try {
       const { questionId, answerText, answerId } = req.body;
       const question = await Question.findById(questionId).populate('answers');
       const answer = await Answer.findById(answerId);
       if (question.type === 'poll') {
           let vote = await Vote.findOneAndUpdate({_id: answer.vote}, {$inc: {count: 1}}, { new: true });

           return res.status(201).json({
               message: 'Poll answer voted!',
               vote
           });
       }

       return res.status(201).json({
           message: 'Trivia answer voted!',
           isCorrect: question.answers[0].text === answerText
       });

    } catch (err) {
       throw err;
    }
});

module.exports = router;


