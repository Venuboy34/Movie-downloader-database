import axios from 'axios';
import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL } from '../../lib/constants';
import { scrapeTamilMovies, scrapeEnglishMovies, scrapeHindiMovies } from '../../lib/scraper';
import { handleApiError } from '../../lib/error-handler';
import { prettifyMiddleware } from '../../lib/prettify';

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
    
    const { language } = req.query;
    
    // Get trending movies from TMDB
    const tmdbResponse = await axios.get(`${TMDB_BASE_URL}/trending/movie/week`, {
      params: {
        api_key: TMDB_API_KEY,
      },
    });
    
    const tmdbTrending = tmdbResponse.data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      poster: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}/w300${movie.poster_path}` : null,
      releaseDate: movie.release_date,
      rating: movie.vote_average
    }));
    
    // Get scraped trending movies based on language
    let scrapedTrending = [];
    
    if (!language || language.toLowerCase() === 'tamil') {
      const tamilMovies = await scrapeTamilMovies();
      scrapedTrending = [...scrapedTrending, ...(tamilMovies.slice(0, 10))];
    }
    
    if (!language || language.toLowerCase() === 'english') {
      const englishMovies = await scrapeEnglishMovies();
      scrapedTrending = [...scrapedTrending, ...(englishMovies.slice(0, 10))];
    }
    
    if (!language || language.toLowerCase() === 'hindi') {
      const hindiMovies = await scrapeHindiMovies();
      scrapedTrending = [...scrapedTrending, ...(hindiMovies.slice(0, 10))];
    }
    
    // Format the response
    const response = {
      tmdb: tmdbTrending,
      scraped: scrapedTrending
    };
    
    return res.status(200).json(response);
  } catch (error) {
    return handleApiError(error, res, 'trending-api');
  }
}
