import { getMovieDownloadLinks, getMovieStreamingLinks } from '../../lib/scraper';

export default async function handler(req, res) {
  try {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }
    
    const { url, source, type } = req.query;
    
    if (!url || !source) {
      return res.status(400).json({ error: 'URL and source parameters are required' });
    }
    
    let links = [];
    
    // Get download links or streaming links based on type
    if (type === 'stream') {
      links = await getMovieStreamingLinks(url, source);
    } else {
      links = await getMovieDownloadLinks(url, source);
    }
    
    // Format the response
    const response = {
      url,
      source,
      type: type || 'download',
      links
    };
    
    return res.status(200).json(response);
  } catch (error) {
    console.error('Links API error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
