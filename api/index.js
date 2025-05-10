// This file serves as a Vercel API endpoint
const handler = require('../dist/server/vercel-adapter.js').default;

module.exports = async (req, res) => {
  // Forward to our Express app
  return handler(req, res);
};