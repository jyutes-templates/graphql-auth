require('dotenv').config();

const { ApolloServer, gql } = require('apollo-server-express');
const express = require('express');
const mongoose = require('mongoose');

const typeDefs = require('./typeDefs');
const resolvers = require('./resolvers');

const startServer = async () => {
    const app = express();
    
    const server = new ApolloServer({
        typeDefs,
        resolvers,
        playground: process.env.PLAYGROUND,
        introspection: process.env.PLAYGROUND
    });
      
    server.applyMiddleware({ app });
      
    app.get('/', (req, res) => {
        res.send('Welcome to /.\nGraphql is at /graphql')
    });
    
    await mongoose.connect(process.env.MONGO_URI, {useNewUrlParser: true, useUnifiedTopology: true});

    app.listen({ port: process.env.PORT || 4000 }, () =>
        console.log(`Server ready`)
    );
}

startServer();