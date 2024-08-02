document.addEventListener('DOMContentLoaded', () => {
    let currentPage = 1;
    const itemsPerPage = 12;
  
    const gallery = document.getElementById('gallery');
    const prevButton = document.getElementById('prev');
    const nextButton = document.getElementById('next');
    const pageNumberElement = document.getElementById('page-number');
  
    function fetchImages(page) {
      fetch('/images')
        .then(response => response.json())
        .then(images => {
          gallery.innerHTML = '';
          const start = (page - 1) * itemsPerPage;
          const end = start + itemsPerPage;
          const paginatedImages = images.slice(start, end);
  
          paginatedImages.forEach(image => {
            const col = document.createElement('div');
            col.className = 'col-lg-3 col-md-4 col-6 mb-4';
            const imgElement = document.createElement('img');
            imgElement.src = `/uploads/${image}`;
            imgElement.className = 'img-fluid';
            col.appendChild(imgElement);
            gallery.appendChild(col);
          });
  
          prevButton.disabled = page === 1;
          nextButton.disabled = end >= images.length;
          pageNumberElement.textContent = `Page ${page}`;
        })
        .catch(error => console.error('Error fetching images:', error));
    }
  
    prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        fetchImages(currentPage);
      }
    });
  
    nextButton.addEventListener('click', () => {
      currentPage++;
      fetchImages(currentPage);
    });
  
    fetchImages(currentPage);
  });
  