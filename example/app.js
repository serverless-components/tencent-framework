exports.handler = async (event, context, callback) => {
  console.log(event)
  return {
    statusCode: 200,
    body: JSON.stringify({
      msg: 'Hello world'
    }),
    headers: {
      'content-type': 'application/json'
    },
    isBase64Encoded: false
  }
}
