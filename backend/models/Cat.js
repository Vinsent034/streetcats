const mongoose = require('mongoose');

const catSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Il nome del gatto è obbligatorio'],
    trim: true,
    minlength: [2, 'Il nome deve avere almeno 2 caratteri'],
    maxlength: [80, 'Il nome non può superare 80 caratteri']
  },
  description: {
    type: String,
    required: [true, 'La descrizione è obbligatoria'],
    trim: true,
    minlength: [10, 'La descrizione deve avere almeno 10 caratteri'],
    maxlength: [500, 'La descrizione non può superare 500 caratteri']
  },
  location: {
    lat: { type: Number, required: [true, 'La latitudine è obbligatoria'] },
    lng: { type: Number, required: [true, 'La longitudine è obbligatoria'] }
  },
  image: {
    type: String,
    required: [true, 'L\'immagine è obbligatoria']
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  date: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Cat', catSchema);
