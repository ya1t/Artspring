document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const imageInput = document.getElementById('productImages');
    const priceInput = document.getElementById('productPrices');
    const productTableContainer = document.getElementById('productTableContainer');

    const files = imageInput.files;
    const prices = priceInput.value.split(',');

    if (files.length !== prices.length) {
        alert('Please provide the same number of images and prices.');
        return;
    }

    // If the table does not exist, create it
    if (!document.getElementById('productTable')) {
        let tableHTML = `
            <table id="productTable">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        `;
        productTableContainer.innerHTML = tableHTML;
    }

    const tbody = document.querySelector('#productTable tbody');

    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const price = prices[i].trim();

        if (file && price) {
            const reader = new FileReader();

            reader.onload = function(e) {
                const imageUrl = e.target.result;

                const row = document.createElement('tr');
                row.className = 'product';

                const imgCell = document.createElement('td');
                const imgElement = document.createElement('img');
                imgElement.src = imageUrl;
                imgElement.alt = 'Product Image';
                imgCell.appendChild(imgElement);

                const priceCell = document.createElement('td');
                const priceInput = document.createElement('input');
                priceInput.type = 'text';
                priceInput.value = price;
                priceCell.appendChild(priceInput);

                const actionsCell = document.createElement('td');
                const deleteButton = document.createElement('button');
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = function() {
                    row.remove();
                };

                actionsCell.appendChild(deleteButton);

                row.appendChild(imgCell);
                row.appendChild(priceCell);
                row.appendChild(actionsCell);
                tbody.appendChild(row);
            };

            reader.readAsDataURL(file);
        }
    }
});

document.getElementById('saveButton').addEventListener('click', function() {
    const rows = document.querySelectorAll('#productTable tbody tr');
    const products = [];

    rows.forEach(row => {
        const imgSrc = row.querySelector('img').src;
        const price = row.querySelector('input[type="text"]').value;
        products.push({ imgSrc, price });
    });

    localStorage.setItem('products', JSON.stringify(products));
    alert('Products saved!');
});

document.addEventListener('DOMContentLoaded', function() {
    const savedProducts = JSON.parse(localStorage.getItem('products') || '[]');
    const productTableContainer = document.getElementById('productTableContainer');

    if (savedProducts.length > 0) {
        let tableHTML = `
            <table id="productTable">
                <thead>
                    <tr>
                        <th>Image</th>
                        <th>Price</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                </tbody>
            </table>
        `;
        productTableContainer.innerHTML = tableHTML;
        const tbody = document.querySelector('#productTable tbody');

        savedProducts.forEach(product => {
            const row = document.createElement('tr');
            row.className = 'product';

            const imgCell = document.createElement('td');
            const imgElement = document.createElement('img');
            imgElement.src = product.imgSrc;
            imgElement.alt = 'Product Image';
            imgCell.appendChild(imgElement);

            const priceCell = document.createElement('td');
            const priceInput = document.createElement('input');
            priceInput.type = 'text';
            priceInput.value = product.price;
            priceCell.appendChild(priceInput);

            const actionsCell = document.createElement('td');
            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.onclick = function() {
                row.remove();
            };

            actionsCell.appendChild(deleteButton);

            row.appendChild(imgCell);
            row.appendChild(priceCell);
            row.appendChild(actionsCell);
            tbody.appendChild(row);
        });
    }
});
