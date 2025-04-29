/**
 * Formats a JSON response for pretty printing
 * @param {Object} data - The data to prettify
 * @returns {string} Pretty formatted JSON string
 */
export function prettify(data) {
  return JSON.stringify(data, null, 2);
}

/**
 * Middleware to prettify JSON responses if query param is present
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @param {Function} originalJson - Original res.json function
 * @returns {void}
 */
export function prettifyMiddleware(req, res, next) {
  const originalJson = res.json;
  
  res.json = function(data) {
    // Check if pretty param is present
    if (req.query.pretty === 'true' || req.query.pretty === '1') {
      // Set pretty printed content
      const prettyJson = prettify(data);
      res.setHeader('Content-Type', 'application/json');
      res.send(prettyJson);
      return;
    }
    
    // Otherwise use the original json method
    return originalJson.call(this, data);
  };
  
  if (typeof next === 'function') {
    next();
  }
}
