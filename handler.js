const uuidv1 = require('uuid/v1');
const AWS = require('aws-sdk');
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

const usersTable = process.env.USERS_TABLE;

const response = (status, message) => ({
  statusCode: status,
  body: JSON.stringify(message)
});

module.exports.createMessage = (event, context, callback) => {
  const { from, to, content } = event;

  const message = {
    id: uuidv1(),
    from,
    to,
    content,
    createdAt: new Date().toISOString()
  }

  return db.put({
    TableName: usersTable,
    Item: message
  })
    .promise()
    .then(() => callback(null, response(201, message)))
    .catch(error => response(null, response(error.statusCode, error)))
}
