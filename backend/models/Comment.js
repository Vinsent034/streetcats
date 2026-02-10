const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
  text: {
    type: String,
    required: [true, 'Il commento è obbligatorio'],
    trim: true,
    minlength: [1, 'Il commento deve avere almeno 1 carattere'],
    maxlength: [500, 'Il commento non può superare 500 caratteri']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  cat: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cat',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Comment', commentSchema);
