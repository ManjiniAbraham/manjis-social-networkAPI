const { Schema, model } = require('mongoose');
const reactionSchema =require('./Reaction');


// Thought Schema
const thoughtSchema = new Schema(
  {
    thoughtText: {
      type: String,
      required: true,
      minlength: 1, // Minimum length of 1 character
      maxlength: 280, // Maximum length of 280 characters
    },
    createdAt: {
      type: Date,
      default: Date.now, // Default value to the current timestamp
      // You can use a getter method to format the timestamp on query
      get: (createdAt) => new Date(createdAt).toDateString(),
    },
    username: {
      type: String,
      required: true,
    },
    reactions: [reactionSchema], // Array of nested documents created with reactionSchema
  },
  {
    toJSON: {
      virtuals: true,
      getters: true, // Enable getters for toJSON
    },
    id: false,
  }
);

// Virtual for reactionCount
thoughtSchema.virtual('reactionCount').get(function () {
  return this.reactions.length;
});

const Thought = model('Thought', thoughtSchema);

module.exports = Thought;
