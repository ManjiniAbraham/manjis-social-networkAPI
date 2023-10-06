const { Schema, Types} = require('mongoose');

const reactionSchema = new Schema(
  {
    reactionId: {
      type: Schema.Types.ObjectId,
      default: () => new Types.ObjectId(), // Default value is a new ObjectId
    },
    reactionBody: {
      type: String,
      required: true,
      maxlength: 280, // Maximum length of 280 characters
    },
    username: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now, // Default value to the current timestamp
      // Use a getter method to format the timestamp on query
      get: (createdAt) => new Date(createdAt).toDateString(),
    },
  },
  {
     toJSON: {
       getters: true, // Enable getters for toJSON
     },
   }
);

module.exports = reactionSchema;
