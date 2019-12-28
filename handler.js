const uuidv1 = require('uuid/v1');
const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const usersTable = process.env.USERS_TABLE;

const response = (status, message) => ({
  statusCode: status,
  body: JSON.stringify(message)
});

module.exports.createMessage = async (event, _context, callback) => {
  const data = JSON.parse(event.body);

  const message = {
    id: uuidv1(),
    from: data.from,
    to: data.to,
    content: data.content,
    createdAt: new Date().toISOString()
  }

  try {
    await db.put({
      TableName: usersTable,
      Item: message
    })
      .promise();
    return callback(null, response(201, message));
  }
  catch (error) {
    return response(null, response(error.statusCode, error));
  }
}
