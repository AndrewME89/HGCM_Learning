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

                const fetchPromises = urls.map(page => 
                    fetch(page)
                        .then(response => response.text())
                        .then(html => {
                            const doc = parser.parseFromString(html, 'text/html');
                            const title = doc.querySelector('title').innerText.toLowerCase();

                            if (title.includes(query)) {
                                return `
                                    <div class="result">
                                        <a href="${page}">${doc.querySelector('title').innerText}</a>
                                    </div>
                                `;
                            }
                        })
                        .catch(error => {
                            console.error('Error fetching page:', page, error);
                        })
                );

                Promise.all(fetchPromises).then(results => {
                    resultsDiv.innerHTML = results.filter(result => result).join('');
                    resultsDiv.style.display = 'block'; // Show the results
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

// Close the dropdown when clicking outside of it
document.addEventListener('click', function(event) {
    const resultsDiv = document.getElementById('results');
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    if (!resultsDiv.contains(event.target) && !searchInput.contains(event.target) && !searchButton.contains(event.target)) {
        resultsDiv.style.display = 'none';
    }
});

document.getElementById('searchInput').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        document.getElementById('searchButton').click();
    }
});
