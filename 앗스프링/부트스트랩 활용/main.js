document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');

    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            // Perform search action here (e.g., redirect to search results page or call an API)
            alert(`Searching for: ${query}`);
        }
    }

    searchInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    searchButton.addEventListener('click', performSearch);
});
