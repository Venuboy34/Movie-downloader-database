import { searchMovie } from '../../lib/tmdb';
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
    
    const { query, language } = req.query;
    
    if (!query) {
      return res.status(400).json({ error: 'Query parameter is required' });
    }
    
    // Get TMDB results
    const tmdbResults = await searchMovie(query);
    
    // Get scraped results based on language
    let scrapedResults = [];
    
    if (!language || language.toLowerCase() === 'tamil') {
      const tamilResults = await scrapeTamilMovies(query);
      scrapedResults = [...scrapedResults, ...tamilResults];
    }
    
    if (!language || language.toLowerCase() === 'english') {
      const englishResults = await scrapeEnglishMovies(query);
      scrapedResults = [...scrapedResults, ...englishResults];
    }
    
    if (!language || language.toLowerCase() === 'hindi') {
      const hindiResults = await scrapeHindiMovies(query);
      scrapedResults = [...scrapedResults, ...hindiResults];
    }
    
    // Format response
    const response = {
      query,
      tmdb: tmdbResults.map(movie => ({
        id: movie.id,
        title: movie.title,
        poster: movie.poster_path ? `https://image.tmdb.org/t/p/w300${movie.poster_path}` : null,
        overview: movie.overview,
        releaseDate: movie.release_date,
        rating: movie.vote_average
      })),
      scraped: scrapedResults
    };
    
    return res.status(200).json(response);
  } catch (error) {
    return handleApiError(error, res, 'search-api');
  }
}
