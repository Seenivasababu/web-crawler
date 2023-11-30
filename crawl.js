const { JSDOM } = require('jsdom');

async function crawlPage(currentURL) {
  console.log(`Actively crawling ${currentURL}`);
  try {
    const res = await fetch(currentURL);

    if (res.status > 399) {
      console.log(
        `Error is fetching with status code: ${res.status} on page ${currentURL}`
      );
      return;
    }
    const contentType = res.headers.get('content-type');
    if (!contentType.includes('text/html')) {
      console.log('Non html response :' + contentType);
      return 
    }
    const htmlBody = await res.text();
    const linkElements = getURLsFromHTML(htmlBody, currentURL);
    for (const linkElement of linkElements) {
    }
  } catch (err) {
    console.log(`Error while fetching the URL: ${currentURL}`);
  }
}

function getURLsFromHTML(htmlBody, baseURL) {
  const urls = [];
  const dom = new JSDOM(htmlBody);
  const linkElements = dom.window.document.querySelectorAll('a');

  for (const linkElement of linkElements) {
    if (linkElement.href.slice(0, 1) === '/') {
      try {
        const urlObj = new URL(`${baseURL}${linkElement.href}`);
        urls.push(urlObj.href);
      } catch (error) {
        console.log(`error with relative url: ${error.message}`);
      }
    } else {
      try {
        const urlObj = new URL(`${linkElement.href}`);
        urls.push(urlObj.href);
      } catch (error) {
        console.log(`error with absolute url: ${error.message}`);
      }
    }
  }

  return urls;
}

function normalizeURL(urlString) {
  const newObj = new URL(urlString);
  const hostPath = `${newObj.hostname}${newObj.pathname}`;

  if (hostPath.length > 0 && hostPath.slice(-1) === '/') {
    return hostPath.slice(0, -1);
  }

  return hostPath;
}

module.exports = {
  normalizeURL,
  getURLsFromHTML,
  crawlPage,
};
