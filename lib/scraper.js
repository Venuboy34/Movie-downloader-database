import axios from 'axios';
import cheerio from 'cheerio';
import chromium from 'chrome-aws-lambda';
import { SCRAPE_SITES } from './constants';

// Get browser instance for Puppeteer
async function getBrowser() {
  return chromium.puppeteer.launch({
    args: chromium.args,
    defaultViewport: chromium.defaultViewport,
    executablePath: await chromium.executablePath,
    headless: true,
    ignoreHTTPSErrors: true,
  });
}

// Scrape Tamil movies from tamiltech
export async function scrapeTamilMovies(searchTerm = '') {
  try {
    const response = await axios.get(SCRAPE_SITES.tamil);
    const $ = cheerio.load(response.data);
    const movies = [];

    // Find all movie cards on the page
    $('.recent-posts .post').each((i, element) => {
      const title = $(element).find('.post-title a').text().trim();
      
      if (!searchTerm || title.toLowerCase().includes(searchTerm.toLowerCase())) {
        const link = $(element).find('.post-title a').attr('href');
        const image = $(element).find('img').attr('src');
        
        movies.push({
          title,
          link,
          image,
          source: 'tamiltech',
          language: 'Tamil'
        });
      }
    });

    return movies;
  } catch (error) {
    console.error('Error scraping Tamil movies:', error);
    return [];
  }
}

// Scrape English movies from filmxy
export async function scrapeEnglishMovies(searchTerm = '') {
  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.goto(SCRAPE_SITES.english, { waitUntil: 'networkidle2' });
    
    const movies = await page.evaluate((search) => {
      const results = [];
      const movieElements = document.querySelectorAll('.movies-list .ml-item');
      
      movieElements.forEach(element => {
        const title = element.querySelector('h2').textContent.trim();
        
        if (!search || title.toLowerCase().includes(search.toLowerCase())) {
          const link = element.querySelector('a').href;
          const image = element.querySelector('img').src;
          
          results.push({
            title,
            link,
            image,
            source: 'filmxy',
            language: 'English'
          });
        }
      });
      
      return results;
    }, searchTerm);
    
    await browser.close();
    return movies;
  } catch (error) {
    console.error('Error scraping English movies:', error);
    return [];
  }
}

// Scrape Hindi movies from hdhub4u
export async function scrapeHindiMovies(searchTerm = '') {
  try {
    const response = await axios.get(SCRAPE_SITES.hindi);
    const $ = cheerio.load(response.data);
    const movies = [];

    // Find all movie cards on the page
    $('.blog-posts .post-outer').each((i, element) => {
      const title = $(element).find('.post-title a').text().trim();
      
      if (!searchTerm || title.toLowerCase().includes(searchTerm.toLowerCase())) {
        const link = $(element).find('.post-title a').attr('href');
        const image = $(element).find('img').attr('src') || '';
        
        movies.push({
          title,
          link,
          image,
          source: 'hdhub4u',
          language: 'Hindi'
        });
      }
    });

    return movies;
  } catch (error) {
    console.error('Error scraping Hindi movies:', error);
    return [];
  }
}

// Get movie download links from a specific movie page
export async function getMovieDownloadLinks(url, source) {
  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    
    let downloadLinks = [];
    
    if (source === 'tamiltech') {
      downloadLinks = await page.evaluate(() => {
        const links = [];
        document.querySelectorAll('.entry-content a').forEach(el => {
          if (el.href.includes('download') || el.textContent.toLowerCase().includes('download')) {
            links.push({
              text: el.textContent.trim(),
              url: el.href
            });
          }
        });
        return links;
      });
    } else if (source === 'filmxy') {
      downloadLinks = await page.evaluate(() => {
        const links = [];
        document.querySelectorAll('.dls_table tbody tr').forEach(row => {
          const quality = row.querySelector('td:first-child').textContent.trim();
          const linkElement = row.querySelector('a');
          if (linkElement) {
            links.push({
              text: `${quality} Download`,
              url: linkElement.href
            });
          }
        });
        return links;
      });
    } else if (source === 'hdhub4u') {
      downloadLinks = await page.evaluate(() => {
        const links = [];
        document.querySelectorAll('.entry-content a').forEach(el => {
          if (el.href.includes('download') || el.textContent.toLowerCase().includes('download')) {
            links.push({
              text: el.textContent.trim(),
              url: el.href
            });
          }
        });
        return links;
      });
    }
    
    await browser.close();
    return downloadLinks;
  } catch (error) {
    console.error('Error getting movie download links:', error);
    return [];
  }
}

// Get movie streaming links
export async function getMovieStreamingLinks(url, source) {
  try {
    const browser = await getBrowser();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
    
    let streamingLinks = [];
    
    if (source === 'tamiltech') {
      streamingLinks = await page.evaluate(() => {
        const links = [];
        document.querySelectorAll('.entry-content iframe').forEach(el => {
          links.push({
            url: el.src
          });
        });
        return links;
      });
    } else if (source === 'filmxy') {
      streamingLinks = await page.evaluate(() => {
        const links = [];
        document.querySelectorAll('.embed-selector li').forEach(li => {
          const server = li.textContent.trim();
          const dataEmbed = li.getAttribute('data-embed');
          if (dataEmbed) {
            links.push({
              server,
              url: dataEmbed
            });
          }
        });
        return links;
      });
    } else if (source === 'hdhub4u') {
      streamingLinks = await page.evaluate(() => {
        const links = [];
        document.querySelectorAll('.entry-content iframe').forEach(el => {
          links.push({
            url: el.src
          });
        });
        return links;
      });
    }
    
    await browser.close();
    return streamingLinks;
  } catch (error) {
    console.error('Error getting movie streaming links:', error);
    return [];
  }
}
