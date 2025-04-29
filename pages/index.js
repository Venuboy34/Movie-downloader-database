import Head from 'next/head';

export default function Home() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <Head>
        <title>Movie Scraper API</title>
        <meta name="description" content="API for scraping movie links and fetching movie details" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header style={{ marginBottom: '30px', borderBottom: '1px solid #eaeaea', paddingBottom: '20px' }}>
        <h1 style={{ color: '#0070f3' }}>Movie Scraper API</h1>
        <p>An API for scraping movie download/streaming links and fetching movie details from TMDB</p>
      </header>

      <main>
        <section style={{ marginBottom: '20px' }}>
          <h2>API Endpoints</h2>
          
          <div style={{ background: '#f4f4f4', padding: '15px', borderRadius: '5px', marginBottom: '15px' }}>
            <h3>Search Movies</h3>
            <p><code>GET /api/search?query=MOVIE_NAME&language=LANGUAGE</code></p>
            <p>Search for movies by name and optionally filter by language (tamil, english, hindi)</p>
            <p>Returns movie information from TMDB and scraped sources</p>
          </div>
          
          <div style={{ background: '#f4f4f4', padding: '15px', borderRadius: '5px', marginBottom: '15px' }}>
            <h3>Movie Details</h3>
            <p><code>GET /api/movie/TMDB_ID</code></p>
            <p>Get detailed information about a movie from TMDB by its ID</p>
            <p>Returns movie details, cast, and recommendations</p>
          </div>
          
          <div style={{ background: '#f4f4f4', padding: '15px', borderRadius: '5px', marginBottom: '15px' }}>
            <h3>Movie Links</h3>
            <p><code>GET /api/links?url=MOVIE_PAGE_URL&source=SOURCE_SITE&type=TYPE</code></p>
            <p>Get download or streaming links for a movie</p>
            <p>Parameters:</p>
            <ul>
              <li><code>url</code>: Full URL to the movie page</li>
              <li><code>source</code>: Source site (tamiltech, filmxy, hdhub4u)</li>
              <li><code>type</code>: Type of links to get (download or stream)</li>
            </ul>
          </div>
          
          <div style={{ background: '#f4f4f4', padding: '15px', borderRadius: '5px', marginBottom: '15px' }}>
            <h3>Trending Movies</h3>
            <p><code>GET /api/trending?language=LANGUAGE</code></p>
            <p>Get trending movies from TMDB and latest movies from scraped sources</p>
            <p>Optionally filter by language (tamil, english, hindi)</p>
          </div>
        </section>
        
        <section style={{ marginBottom: '20px' }}>
          <h2>Example Usage</h2>
          <pre style={{ background: '#f4f4f4', padding: '15px', borderRadius: '5px', overflow: 'auto' }}>
            {`// Search for "Avengers" movies
fetch('/api/search?query=avengers')
  .then(res => res.json())
  .then(data => console.log(data));

// Get movie details for TMDB ID 299534 (Avengers: Endgame)
fetch('/api/movie/299534')
  .then(res => res.json())
  .then(data => console.log(data));

// Get download links for a Tamil movie
fetch('/api/links?url=http://example.com/movie-page&source=tamiltech&type=download')
  .then(res => res.json())
  .then(data => console.log(data));
`}
          </pre>
        </section>
      </main>

      <footer style={{ marginTop: '30px', borderTop: '1px solid #eaeaea', paddingTop: '20px', color: '#666' }}>
        <p>Movie Scraper API - Created with Next.js</p>
      </footer>
    </div>
  );
}
