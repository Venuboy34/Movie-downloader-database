/**
 * Handles API errors and returns an appropriate response
 * @param {Error} error - The error object
 * @param {Object} res - The response object
 * @param {string} source - Source of the error (e.g., 'scraper', 'tmdb')
 * @returns {Object} Response with error details
 */
export function handleApiError(error, res, source = 'api') {
  console.error(`Error in ${source}:`, error);
  
  // Determine status code based on error
  let statusCode = 500;
  let message = 'Internal server error';
  
  if (error.response) {
    // Error from an HTTP request
    statusCode = error.response.status || 500;
    message = error.response.data?.message || error.message || 'Request failed';
  } else if (error.code === 'ENOTFOUND' || error.code === 'ETIMEDOUT') {
    // Network error
    statusCode = 503;
    message = 'Service unavailable. Could not connect to server.';
  } else if (error.message.includes('timeout')) {
    // Timeout error
    statusCode = 504;
    message = 'Request timed out';
  } else if (error.message.includes('not found')) {
    // Not found error
    statusCode = 404;
    message = 'Resource not found';
  }
  
  // Protect API keys or sensitive info from being exposed
  const sanitizedError = {
    error: message,
    status: statusCode,
    source,
    timestamp: new Date().toISOString()
  };
  
  return res.status(statusCode).json(sanitizedError);
}

/**
 * Creates a rate limiter middleware
 * Very simple implementation - for production use a more robust solution
 * @param {number} limit - Max requests per window
 * @param {number} windowMs - Time window in milliseconds
 * @returns {Function} Middleware function
 */
export function rateLimit(limit = 10, windowMs = 60000) {
  const ips = new Map();
  
  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const now = Date.now();
    
    if (ips.has(ip)) {
      const { count, resetTime } = ips.get(ip);
      
      // Reset count if window has passed
      if (now > resetTime) {
        ips.set(ip, { count: 1, resetTime: now + windowMs });
      } else if (count >= limit) {
        return res.status(429).json({
          error: 'Too many requests',
          status: 429,
          retryAfter: Math.ceil((resetTime - now) / 1000)
        });
      } else {
        ips.set(ip, { count: count + 1, resetTime });
      }
    } else {
      ips.set(ip, { count: 1, resetTime: now + windowMs });
    }
    
    // Clean up old entries
    if (ips.size > 10000) {  // Prevent memory issues
      const ipEntries = [...ips.entries()];
      const oldestEntries = ipEntries
        .sort((a, b) => a[1].resetTime - b[1].resetTime)
        .slice(0, Math.floor(ipEntries.length / 2));
        
      oldestEntries.forEach(([key]) => ips.delete(key));
    }
    
    if (typeof next === 'function') {
      next();
    }
  };
}
