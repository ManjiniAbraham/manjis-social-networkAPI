const {Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
  username: {
    type: String,
    unique: true,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
    // This 'match' validator ensures that the email follows a valid format.
  },
  thoughts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Thought', // Reference to the Thought model
    },
  ],
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User', // Self-reference to the User model for friends
    },
  ],
},
{
  toJSON: {
    virtuals: true,
  },
  id: false,
});

userSchema.virtual('friendCount')
.get(function(){
  return this.friends.length;
})

const User = model('User', userSchema);

module.exports = User;
