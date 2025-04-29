import { getMovieDetails, getRecommendedMovies } from '../../../lib/tmdb';
import { handleApiError } from '../../../lib/error-handler';
import { prettifyMiddleware } from '../../../lib/prettify';

export default async function handler(req, res) {
  // Apply prettify middleware
  prettifyMiddleware(req, res);
  
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'Movie ID is required' });
    }
    
    // Get movie details from TMDB
    const movieDetails = await getMovieDetails(id);
    
    if (!movieDetails) {
      return res.status(404).json({ error: 'Movie not found' });
    }
    
    // Get recommended movies
    const recommendations = await getRecommendedMovies(id);
    
    // Format the response
    const response = {
      ...movieDetails,
      recommendations
    };
    
    return res.status(200).json(response);
  } catch (error) {
    return handleApiError(error, res, 'movie-api');
  }
}
