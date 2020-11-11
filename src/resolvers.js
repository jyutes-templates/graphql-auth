require('dotenv').config();

const { ApolloServer, gql } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const joi = require('joi')

const User = require('./models/User');

module.exports = {
    Query: {
        hello: () => {
            return 'Hello!';
        },

        protectedHello: async (_, req) => {

            const { valid, decoded} = validateToken(req.token)
            
            if (!valid) return 'Expired token'
            
            return `Hello ${decoded.username}!`
        }
    },

    Mutation: {

        register: async (_, req) => {
            let response = {
                success: false,
                msg: ["Poggers"]
            }

            // Validate username input
            const validUsername = joi.string().alphanum().min(3).max(30).validate(req.username)
            const validPassword = joi.string().min(8).max(30).validate(req.password)
            let validRes = {
                success: false,
                msg: []
            }
            if ( validUsername.error ) validRes.msg.push( validUsername.error.message.replace('value', 'Username') )
                
            if ( validPassword.error ) validRes.msg.push( validPassword.error.message.replace('value', 'Password') )

            if ( validUsername.error || validPassword.error ) return validRes

            // Check for taken username
            const takenRes = await User.find({ username: req.username }).then( res => res );
            if (takenRes.length) return {
                success: false,
                msg: ["Username is taken"]
            }

            

            const hashedPassword = bcrypt.hashSync(req.password, 10)

            const newUser = new User({
                username: req.username,
                password: hashedPassword
            });

            const addedUser = await newUser.save();

            return {
                success: true,
                msg: ["Successfully registered"],
                user: {
                    _id: addedUser._id,
                    username: addedUser.username,
                    date: addedUser.date
                }
            }
        },

        login: async (_, req) => {
            const user = await User.findOne({ username: req.username }).then(doc => doc);

            if (user.username == undefined) return {
                success: false,
                msg: "Invalid Username or Password"
            }

            const pass = await bcrypt.compare(req.password, user.password).then(res => res)
            console.log(pass);
            if (!pass) return {
                success: false,
                msg: "Invalid Username or Password"
            }

            const token = jwt.sign({ _id: user._id, username: req.username }, process.env.JWT_SECRET, { expiresIn: process.env.TOKEN_EXPs });

            return {
                _id: user._id,
                success: true,
                msg: `Successfully logged in as ${user.username}`,
                token: token
            }
        }
    },
};

function validateToken(token) {
    const decoded = jwt.decode(token, process.env.JWT_SECRET)

    if (decoded.exp <= Date.now()) return {
        valid: false,
        decoded: decoded
    }

    return {
        valid: true,
        decoded: decoded
    }
}