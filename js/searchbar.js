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

                // Keep track of promises
                const fetchPromises = urls.map(page => 
                    fetch(page)
                        .then(response => response.text())
                        .then(html => {
                            const doc = parser.parseFromString(html, 'text/html');
                            const title = doc.querySelector('title').innerText.toLowerCase();

                            if (title.includes(query)) {
                                return `
                                    <div class="result">
                                        <a href="${page}" target="_blank">${doc.querySelector('title').innerText}</a>
                                    </div>
                                `;
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching page:', page, error);
                        })
                );

                // Once all promises are resolved, display results
                Promise.all(fetchPromises).then(results => {
                    resultsDiv.innerHTML = results.filter(result => result).join('');
                });
            })
            .catch(error => {
                console.error('Error fetching sitemap:', error);
                resultsDiv.innerHTML = '<div class="result">Could not fetch sitemap.</div>';
            });
    } else {
        resultsDiv.innerHTML = '<div class="result">Please enter a search term.</div>';
    }
});

// Close the dropdown menu if the user clicks outside of it
document.addEventListener('click', function(event) {
    if (!document.getElementById('results').contains(event.target) &&
        !event.target.matches('#searchButton')) {
        document.getElementById('results').style.display = 'none'; // Hide the dropdown
    }
});

// Open the results dropdown
document.getElementById('searchInput').addEventListener('input', function() {
    document.getElementById('results').style.display = 'block'; // Show the dropdown
});

document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        document.getElementById('searchButton').click();
    }
});
