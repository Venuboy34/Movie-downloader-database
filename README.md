# Movie Scraper API

A powerful API for scraping movie download/streaming links and fetching movie details from TMDB. This API allows you to search for movies, get detailed information, and find download/streaming links from various sources.

## Features

- Search for movies across multiple sources
- Fetch detailed movie information from TMDB (cast, crew, ratings, etc.)
- Scrape download links from Tamil, English, and Hindi movie websites
- Get streaming links when available
- Find trending and recommended movies

## API Endpoints

### 1. Search Movies
```
GET /api/search?query=MOVIE_NAME&language=LANGUAGE
```
Search for movies by name and optionally filter by language (tamil, english, hindi).

**Parameters:**
- `query` (required): Movie name to search
- `language` (optional): Filter by language (tamil, english, hindi)

**Response:**
```json
{
  "query": "your search query",
  "tmdb": [
    {
      "id": 123456,
      "title": "Movie Title",
      "poster": "https://image.tmdb.org/t/p/w300/poster_path.jpg",
      "overview": "Movie description",
      "releaseDate": "2023-01-01",
      "rating": 8.5
    }
  ],
  "scraped": [
    {
      "title": "Movie Title",
      "link": "https://website.com/movie-page",
      "image": "https://website.com/image.jpg",
      "source": "website-name",
      "language": "Language"
    }
  ]
}
```

### 2. Movie Details
```
GET /api/movie/TMDB_ID
```
Get detailed information about a movie from TMDB by its ID.

**Parameters:**
- `id` (required): TMDB movie ID

**Response:**
```json
{
  "id": 123456,
  "title": "Movie Title",
  "overview": "Movie description",
  "poster": "https://image.tmdb.org/t/p/w500/poster_path.jpg",
  "backdrop": "https://image.tmdb.org/t/p/original/backdrop_path.jpg",
  "releaseDate": "2023-01-01",
  "rating": 8.5,
  "genres": ["Action", "Adventure"],
  "runtime": 120,
  "cast": [
    {
      "id": 123,
      "name": "Actor Name",
      "character": "Character Name",
      "profile": "https://image.tmdb.org/t/p/w185/profile_path.jpg"
    }
  ],
  "director": "Director Name",
  "trailer": "YouTube_Video_ID",
  "recommendations": [
    {
      "id": 789012,
      "title": "Recommended Movie",
      "poster": "https://image.tmdb.org/t/p/w300/poster_path.jpg",
      "releaseDate": "2023-02-02",
      "rating": 7.9
    }
  ]
}
```

### 3. Movie Links
```
GET /api/links?url=MOVIE_PAGE_URL&source=SOURCE_SITE&type=TYPE
```
Get download or streaming links for a movie.

**Parameters:**
- `url` (required): Full URL to the movie page
- `source` (required): Source site (tamiltech, filmxy, hdhub4u)
- `type` (optional): Type of links to get (download or stream)

**Response:**
```json
{
  "url": "https://website.com/movie-page",
  "source": "website-name",
  "type": "download",
  "links": [
    {
      "text": "720p Download",
      "url": "https://download-link.com/file"
    }
  ]
}
```

### 4. Trending Movies
```
GET /api/trending?language=LANGUAGE
```
Get trending movies from TMDB and latest movies from scraped sources.

**Parameters:**
- `language` (optional): Filter by language (tamil, english, hindi)

**Response:**
```json
{
  "tmdb": [
    {
      "id": 123456,
      "title": "Trending Movie",
      "poster": "https://image.tmdb.org/t/p/w300/poster_path.jpg",
      "releaseDate": "2023-01-01",
      "rating": 8.5
    }
  ],
  "scraped": [
    {
      "title": "Latest Movie",
      "link": "https://website.com/movie-page",
      "image": "https://website.com/image.jpg",
      "source": "website-name",
      "language": "Language"
    }
  ]
}
```

## Installation

1. Clone this repository:
```bash
git clone https://github.com/yourusername/movie-scraper-api.git
cd movie-scraper-api
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Your API will be available at `http://localhost:3000`

## Deployment on Vercel

This API is designed to be easily deployed on Vercel. Follow these steps to deploy:

1. Create a Vercel account if you don't have one: [https://vercel.com](https://vercel.com)

2. Install the Vercel CLI:
```bash
npm install -g vercel
```

3. Login to Vercel:
```bash
vercel login
```

4. Deploy the project:
```bash
vercel
```

5. For production deployment:
```bash
vercel --prod
```

## Environment Variables

No environment variables needed as the TMDB API key is hardcoded in the constants.js file. However, for production use, it's recommended to store it as an environment variable for better security.

## Technologies Used

- Next.js - React framework
- Axios - HTTP client
- Cheerio - HTML parsing
- Puppeteer - Web scraping with headless browser
- Chrome AWS Lambda - Optimized Puppeteer for serverless environments

## Notes

This API scrapes third-party websites to fetch movie links. Use it responsibly and ensure you have the rights to access and use the content you're scraping.

## License

MIT License
