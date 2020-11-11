const { ApolloServer, gql } = require('apollo-server-express');

module.exports = gql`
    ### Types ###

    type User {
        _id: ID!
        username: String!
        date: String!
    }

    ### Mutation Responses ###
    type validationErr {
        field: String!
        msg: String!
    }

    type rRegister {
        success: Boolean!
        msg: [String]
        user: User
    }

    type rLogin {
        _id: ID!
        success: Boolean!
        msg: String!
        token: String
    }

    ### Queries ###

    type Query {
        hello: String!

        protectedHello (
            token: String!
        ): String!
    }

    ### Mutations ###
    
    type Mutation{
        register(
            username: String!
            password: String!
        ): rRegister!

        login(
            username: String!
            password: String!
        ): rLogin!

        protectedMutation (
            token: String!
            msg: String!
        ): String!
    }
`;