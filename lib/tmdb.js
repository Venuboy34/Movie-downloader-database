import axios from 'axios';
import { TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE_URL } from './constants';

// Search for movies
export async function searchMovie(query) {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/search/movie`, {
      params: {
        api_key: TMDB_API_KEY,
        query,
        include_adult: false,
      },
    });
    
    return response.data.results;
  } catch (error) {
    console.error('Error searching movie:', error);
    return [];
  }
}

// Get movie details by ID
export async function getMovieDetails(movieId) {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}`, {
      params: {
        api_key: TMDB_API_KEY,
        append_to_response: 'credits,videos,images',
      },
    });
    
    // Format the data for easier consumption
    const { 
      id, title, overview, poster_path, backdrop_path, 
      release_date, vote_average, genres, runtime,
      credits, videos
    } = response.data;
    
    const formattedData = {
      id,
      title,
      overview,
      poster: poster_path ? `${TMDB_IMAGE_BASE_URL}/w500${poster_path}` : null,
      backdrop: backdrop_path ? `${TMDB_IMAGE_BASE_URL}/original${backdrop_path}` : null,
      releaseDate: release_date,
      rating: vote_average,
      genres: genres.map(g => g.name),
      runtime,
      cast: credits?.cast?.slice(0, 10).map(actor => ({
        id: actor.id,
        name: actor.name,
        character: actor.character,
        profile: actor.profile_path ? `${TMDB_IMAGE_BASE_URL}/w185${actor.profile_path}` : null,
      })),
      director: credits?.crew?.find(c => c.job === 'Director')?.name,
      trailer: videos?.results?.find(v => v.type === 'Trailer' && v.site === 'YouTube')?.key,
    };
    
    return formattedData;
  } catch (error) {
    console.error('Error getting movie details:', error);
    return null;
  }
}

// Get recommended movies based on a movie ID
export async function getRecommendedMovies(movieId) {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/movie/${movieId}/recommendations`, {
      params: {
        api_key: TMDB_API_KEY,
      },
    });
    
    return response.data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      poster: movie.poster_path ? `${TMDB_IMAGE_BASE_URL}/w300${movie.poster_path}` : null,
      releaseDate: movie.release_date,
      rating: movie.vote_average,
    }));
  } catch (error) {
    console.error('Error getting recommended movies:', error);
    return [];
  }
}
