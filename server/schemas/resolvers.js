const { User } = require('../models');
const { AuthenticationError } = require('apollo-server-express');

const { signToken } =require('../utils/auth')
const { sign } = require('jsonwebtoken')
const resolvers = {

    Query: {
        me: async (parent, args, context) => {
            if (context.user) {
              const userData = await User.findOne({ _id: context.user._id }).select('-__v -password');
      
              return userData;
            }
            throw new AuthenticationError('Need to be logged in')
          },
    },


    Mutation: {
        login: async (parent, {email, password}) => {
            const user = await User.findOne({email});

            const correctPassword = await user.isCorrectPassword(password)
        
            if(!user || !correctPassword) {
                throw new AuthenticationError('Unable to login');
            }

            const token = signToken(user);
            return { token, user};
            },

        addUser: async (parent, args) => {
            const user = await User.create(args);
            const token = signToken(user);

            return { token, user };
        },

        saveBook: async (parent, { input }, context) => {
            if (context.user) {
              const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id },
                { $addToSet: { savedBooks: input } },
                { new: true, runValidators: true }
              );
              return updatedUser;
            }
            throw new AuthenticationError("You need to log in");
          },

        removeBook: async (parent, {bookId}, context) => {
            if(context.user) {
            const updatedUser = await User.findOneAndUpdate(
                { _id: context.user._id},
                { $pull: { savedBooks: { bookId: bookId } } },
                { new: true }
            );
            return updatedUser
            //   if (!updatedUser) {
            //     return res.status(404).json({ message: "Couldn't find the user with this ID." });
              } 
              throw new AuthenticationError("you need to be logged in")
              ;
        }

    }
}

    

module.exports = resolvers;