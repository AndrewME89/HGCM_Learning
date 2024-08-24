$(document).ready(function(){
  $("#searchButton").click(function(){
      performSearch();
      $("#results").toggle(); // Toggle visibility of the dropdown
  });

  $(document).click(function(event) {
      // Check if the click was outside the search input and results
      if (!$(event.target).closest('#searchInput, #results, #searchButton').length) {
          $("#results").hide(); // Hide the dropdown
      }
  });
});

function performSearch() {
  const query = $('#searchInput').val().toLowerCase();
  const resultsDiv = $('#results');
  resultsDiv.empty(); // Clear previous results

  const addedTitles = new Set(); // Set to track added titles

  if (query) {
      fetch('https://andrewme89.github.io/HGCM_Learning/sitemap.xml')
          .then(response => response.text())
          .then(xmlText => {
              const parser = new DOMParser();
              const xmlDoc = parser.parseFromString(xmlText, 'application/xml');
              const urls = Array.from(xmlDoc.getElementsByTagName('loc')).map(loc => loc.textContent);

              const fetchPromises = urls.map(page => fetch(page)
                  .then(response => response.text())
                  .then(html => {
                      const doc = parser.parseFromString(html, 'text/html');
                      const title = doc.querySelector('title').innerText.trim();

                      if (title.toLowerCase().includes(query) && !addedTitles.has(title)) {
                          resultsDiv.append(`
                              <div class="result">
                                  <a href="${page}" target="_blank">${title}</a>
                              </div>
                          `);
                          addedTitles.add(title);
                      }
                  })
                  .catch(error => {
                      console.error('Error fetching page:', page, error);
                  })
              );

              Promise.all(fetchPromises).then(() => {
                  if (addedTitles.size > 0) {
                      resultsDiv.show(); // Show results if any match
                  } else {
                      resultsDiv.append('<div class="result">No results found.</div>');
                      resultsDiv.show();
                  }
              });
          })
          .catch(error => {
              console.error('Error fetching sitemap:', error);
              resultsDiv.append('<div class="result">Could not fetch sitemap.</div>');
              resultsDiv.show();
          });
  } else {
      resultsDiv.append('<div class="result">Please enter a search term.</div>');
      resultsDiv.show();
  }
}

$('#searchInput').keypress(function(event) {
  if (event.key === 'Enter') {
      $('#searchButton').click();
  }
});