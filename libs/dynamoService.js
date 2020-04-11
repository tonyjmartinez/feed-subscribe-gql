const db = require("./dynamo");

module.exports = {
  createComment: function (args, tableName) {
    const params = {
      TableName: tableName,
      Item: {
        // id: uuid(),
        content: args.content,
        userId: args.userId,
        commentId: args.commentId,
      },
    };

    return db.createItem(params);
  },
  createFeed: function (args, tableName) {
    const params = {
      TableName: tableName,
      Item: {
        name: args.name,
        source: args.source,
      },
    };
    try {
      return db.createItem(params);
    } catch (err) {
      return err;
    }
  },
};
