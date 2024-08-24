document.getElementById('searchButton').addEventListener('click', function() {
  const query = document.getElementById('searchInput').value.toLowerCase();
  const resultsDiv = document.getElementById('results');
  resultsDiv.innerHTML = ''; // Clear previous results

  if (query) {
      fetch('https://andrewme89.github.io/HGCM_Learning/sitemap.xml')
          .then(response => response.text())
          .then(xmlText => {
              const parser = new DOMParser();
              const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
              const urls = Array.from(xmlDoc.getElementsByTagName('loc')).map(loc => loc.textContent);

              urls.forEach(page => {
                  fetch(page)
                      .then(response => response.text())
                      .then(html => {
                          const doc = parser.parseFromString(html, 'text/html');
                          const title = doc.querySelector('title').innerText.toLowerCase();

                          if (title.includes(query)) {
                              resultsDiv.innerHTML += `
                                  <div class="result">
                                      <a href="${page}" target="_blank">${doc.querySelector('title').innerText}</a>
                                  </div>
                              `;
                          }
                      })
                      .catch(error => {
                          console.error('Error fetching page:', page, error);
                      });
              });
          })
          .catch(error => {
              console.error('Error fetching results:', error);
              resultsDiv.innerHTML = '<div class="result">Could not fetch results.</div>';
          });
  } else {
      resultsDiv.innerHTML = '<div class="result">Please enter a search term.</div>';
  }
});

document.getElementById('searchInput').addEventListener('keypress', function(event) {
  if (event.key === 'Enter') {
      document.getElementById('searchButton').click();
  }
});