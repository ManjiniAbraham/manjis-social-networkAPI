const { User, Thought } = require('../models');

module.exports = {
  // GET to get all thoughts
  async getAllThoughts(req, res) {
    try {
      const thoughts = await Thought.find();
      res.json(thoughts);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // GET to get a single thought by its _id
  async getSingleThought(req, res) {
    try {
      const thought = await Thought.findOne({ _id: req.params.thoughtId });
      if (!thought) {
        return res.status(404).json({ message: 'No Thought with this ID' });
      }
      res.json(thought);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // POST: To Create a new thought and associate it with the user
 async createThought(req, res) {
  try {
    const { thoughtText, username } = req.body;

    // Create the thought
    const thought = await Thought.create({ thoughtText, username });

    // Associate the thought with the user using $addToSet
    const user = await User.findOneAndUpdate(
      { username: req.body.username },
      { $addToSet: { thoughts: thought._id } },
      { runValidators: true, new: true }
    );

    res.status(201).json(thought);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
},

  // PUT to update a thought by its _id
  async updateThought(req, res) {
    try {
      const updatedThought = await Thought.findOneAndUpdate(
        { _id: req.params.thoughtId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!updatedThought) {
        return res.status(404).json({ message: 'No Thought with this ID' });
      }

      res.json(updatedThought);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // DELETE to remove a thought by its _id
  async deleteThought(req, res) {
    try {
      const deletedThought = await Thought.findOneAndDelete({
        _id: req.params.thoughtId,
      });

      if (!deletedThought) {
        return res.status(404).json({ message: 'No Thought with this ID' });
      }

      // Remove the thought's _id from the associated user's thoughts array
      const user = await User.findById(deletedThought.userId);
      if (user) {
        user.thoughts.pull(deletedThought._id);
        await user.save();
      }

      return res.status(200).json({ message: 'Thought deleted successfully'});
    } catch (err) {
      return res.status(400).json(err);
    }
  },

// Add reaction
async createReaction(req, res) {
  try {
    const reaction = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $addToSet: { reactions: req.body } },
      { runValidators: true }
    );

    if (!reaction) {
      return res.status(404).json({ message: "No thought with that ID" });
    }

    return res.status(200).json(reaction);
  } catch (err) {
    console.log(err);
    return res.status(500).json(err);
  }
},


   // DELETE to pull and remove a reaction by the reaction's reactionId value
   async deleteReaction(req, res) {
    try {
      const { thoughtId } = req.params;
      const { reactionId } = req.body;

      // Check if the thought exists
      const thought = await Thought.findById(thoughtId);

      if (!thought) {
        return res.status(404).json({ message: 'Thought not found' });
      }

      // Find the index of the reaction to remove
      const reactionIndex = thought.reactions.findIndex(
        (reaction) => reaction.reactionId.toString() === reactionId
      );

      if (reactionIndex === -1) {
        return res.status(404).json({ message: 'Reaction not found' });
      }

      // Remove the reaction
      thought.reactions.splice(reactionIndex, 1);
      await thought.save();

      res.json(thought);
    } catch (err) {
      res.status(400).json(err);
    }
  }
};
