const { User, Thought } = require('../models');

module.exports = {
  // Get all Users
  async getUsers(req, res) {
    try {
      const users = await User.find().populate('thoughts');
      res.json(users);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // Get single User
  async getSingleUser(req, res) {
    try {
      const user = await User.findOne({ _id: req.params.userId }).select('-__v');

      if (!user) {
        return res.status(404).json({ message: 'No User with this ID' });
      }

      res.json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // POST to create a new user
  async createUser(req, res) {
    try {
      const user = await User.create(req.body);
      res.status(201).json(user);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // PUT to update a user by its _id
  async updateUser(req, res) {
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: req.params.userId },
        { $set: req.body },
        { runValidators: true, new: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'No User with this ID' });
      }

      res.json(updatedUser);
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // DELETE to remove user by its _id
  async deleteUser(req, res) {
    try {
      const deletedUser = await User.findOneAndDelete({ _id: req.params.userId });

      if (!deletedUser) {
        return res.status(404).json({ message: 'No User with this ID' });
      }

      // BONUS: Remove a user's associated thoughts when deleted
      await Thought.deleteMany({ _id: { $in: deletedUser.thoughts } });
      res.json({ message: 'User and associated thoughts deleted successfully' });
    } catch (err) {
      res.status(500).json(err);
    }
  },

  // POST to add a new friend to a user's friend list
  async addFriend(req, res) {
    try {
      const { userId, friendId } = req.params;

      // Check if the user and friend exist
      const user = await User.findById(userId);
      const friend = await User.findById(friendId);

      if (!user || !friend) {
        return res.status(404).json({ message: 'User or friend not found' });
      }

      // Check if the friend is already in the user's friend list
      if (user.friends.includes(friendId)) {
        return res.status(400).json({ message: 'Friend already added' });
      }

      // Add the friend to the user's friend list
      user.friends.push(friendId);
      await user.save();

      res.json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  },

  // DELETE to remove a friend from a user's friend list
  async removeFriend(req, res) {
    try {
      const { userId, friendId } = req.params;

      // Check if the user exists
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Check if the friend is in the user's friend list
      if (!user.friends.includes(friendId)) {
        return res.status(400).json({ message: 'Friend not found in the list' });
      }

      // Remove the friend from the user's friend list
      user.friends.pull(friendId);
      await user.save();

      res.json(user);
    } catch (err) {
      res.status(400).json(err);
    }
  },
};
