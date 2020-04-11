const db = require("./libs/dynamo");
const dbService = require("./libs/dynamoService.js");
const { ApolloServer, gql } = require("apollo-server-lambda");
// import * as dynamoDbLib from "./libs/dynamodb-lib";
// import { promisify } from "./util";
// import { success, failure } from "./libs/response-lib";
// const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies
// const dynamoDb = new AWS.DynamoDB.DocumentClient();

// Construct a schema, using GraphQL schema language
const typeDefs = gql`
  type Feed {
    name: String
    source: String
  }
  type Comment {
    content: String
    userId: String
    commentId: String
  }
  type Query {
    hello: String
    comments: [Comment]
  }
  type Mutation {
    createSong(content: String!, userId: String!, commentId: String!): Comment
    createFeed(name: String!, source: String!): Feed
    # updateSong(
    #   id: ID!
    #   title: String
    #   artist: String
    #   duration: Int
    # ): Song
    # deleteSong(
    #   id: ID!
    # ): Song
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    hello: () => "Hello world!",
    // feeds: () => {
    //   const params = { TableName: process.env.feedsTable };
    //   return db.scan(params);
    // },
    comments: () => {
      const params = {
        TableName: process.env.tableName,
      };

      try {
        return db.scan(params);

        // return [{ userId: "tony", commentId: "comment" }];

        // dynamoDbLib
        //   .call("query", params)
        //   .then(data => resolve(data.items))
        //   .catch(e => resolve([{ userId: e.toString(), content: e }]));
        // const result = {
        //   Items: [{ userId: "tony", commentId: "comment" }]
        // };
      } catch (e) {
        return [e.toString()];
      }
    },
  },
  Mutation: {
    createFeed: (_, args) => {
      try {
        return dbService.createFeed(args, process.env.tableName);
      } catch (err) {
        return [err];
      }
    },
    // createSong: (_, args) => {
    //   try {
    //     return dbService.createComment(args, process.env.tableName);
    //   } catch (err) {
    //     return [e.toString];
    //   }
    // },
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

exports.graphqlHandler = server.createHandler({
  cors: {
    origin: "*",
    credentials: true,
  },
});
