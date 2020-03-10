const AWS = require("aws-sdk"); // eslint-disable-line import/no-extraneous-dependencies

const dynamoDb = new AWS.DynamoDB.DocumentClient();

module.exports = {
  scan: function(params) {
    return new Promise((resolve, reject) =>
      dynamoDb
        .scan(params)
        .promise()
        .then(data => resolve(data.Items))
        .catch(err => reject(err))
    );
  },

  get: function(params) {
    return new Promise((resolve, reject) =>
      dynamoDb
        .get(params)
        .promise()
        .then(data => resolve(data.Item))
        .catch(err => reject(err))
    );
  },

  createItem: function(params) {
    return new Promise((resolve, reject) =>
      dynamoDb
        .put(params)
        .promise()
        .then(() => resolve(params.Item))
        .catch(err => reject(err))
    );
  },

  updateItem: function(params, args) {
    return new Promise((resolve, reject) =>
      dynamoDb
        .update(params)
        .promise()
        .then(() => resolve(args))
        .catch(err => reject(err))
    );
  },

  deleteItem: function(params, args) {
    return new Promise((resolve, reject) =>
      dynamoDb
        .delete(params)
        .promise()
        .then(() => resolve(args))
        .catch(err => reject(err))
    );
  }
};
