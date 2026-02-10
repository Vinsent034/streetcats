const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Il nome è obbligatorio'],
    trim: true,
    minlength: [2, 'Il nome deve avere almeno 2 caratteri'],
    maxlength: [80, 'Il nome non può superare 80 caratteri']
  },
  email: {
    type: String,
    required: [true, 'L\'email è obbligatoria'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Formato email non valido']
  },
  password: {
    type: String,
    required: [true, 'La password è obbligatoria']
  }
}, {
  timestamps: true
});

userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema);
