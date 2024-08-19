document.addEventListener('DOMContentLoaded', () => {
    let products = [];
    let currentPage = 1;
    const itemsPerPage = 4;

    fetch('/images')
        .then(response => response.json())
        .then(data => {
            products = data.map((product, index) => ({
                id: index + 1,
                name: product.name,
                price: 100 * (index + 1), // 임의의 가격 설정
                image: product.url
            }));
            renderProducts(currentPage);
        });

    function renderProducts(page) {
        const productContainer = document.getElementById('product-list');
        if (productContainer) {
            productContainer.innerHTML = '';
            const start = (page - 1) * itemsPerPage;
            const end = start + itemsPerPage;
            const pageProducts = products.slice(start, end);

            pageProducts.forEach(product => {
                const productCard = document.createElement('div');
                productCard.className = 'col-md-3';
                productCard.innerHTML = `
                    <div class="card mb-4">
                        <img src="${product.image}" class="card-img-top" alt="${product.name}">
                        <div class="card-body">
                            <h5 class="card-title">${product.name}</h5>
                            <p class="card-text">Price: ${product.price}원</p>
                            <form class="add-to-cart-form">
                                <input type="hidden" name="productId" value="${product.id}">
                                <input type="hidden" name="productName" value="${product.name}">
                                <input type="hidden" name="productPrice" value="${product.price}">
                                <input type="hidden" name="productImage" value="${product.image}">
                                <div class="form-group">
                                    <label for="quantity-${product.id}">Quantity:</label>
                                    <input type="number" id="quantity-${product.id}" name="quantity" min="1" value="1" class="form-control">
                                </div>
                                <button type="submit" class="btn btn-primary">Add to Cart</button>
                            </form>
                        </div>
                    </div>
                `;
                productContainer.appendChild(productCard);
            });

            updateButtons();
        }
    }

    function updateButtons() {
        const prevButton = document.getElementById('prev-button');
        const nextButton = document.getElementById('next-button');

        if (prevButton && nextButton) {
            prevButton.disabled = currentPage === 1;
            nextButton.disabled = currentPage * itemsPerPage >= products.length;
        }
    }

    const prevButton = document.getElementById('prev-button');
    const nextButton = document.getElementById('next-button');

    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                renderProducts(currentPage);
            }
        });

        nextButton.addEventListener('click', () => {
            if (currentPage * itemsPerPage < products.length) {
                currentPage++;
                renderProducts(currentPage);
            }
        });
    }

    document.addEventListener('submit', (event) => {
        if (event.target.classList.contains('add-to-cart-form')) {
            event.preventDefault();
            const productId = event.target.productId.value;
            const productName = event.target.productName.value;
            const productPrice = event.target.productPrice.value;
            const productImage = event.target.productImage.value;
            const quantity = parseInt(event.target.quantity.value, 10);

            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItem = cart.find(item => item.id == productId);

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                cart.push({ id: productId, name: productName, price: productPrice, image: productImage, quantity });
            }

            localStorage.setItem('cart', JSON.stringify(cart));

            window.location.href = '/cart';
        }
    });

    function renderCartItems() {
        const cartItemsElement = document.getElementById('cart-items');
        const totalPriceElement = document.getElementById('total-price');

        if (cartItemsElement) {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            cartItemsElement.innerHTML = '';
            let totalPrice = 0;

            cart.forEach(item => {
                const li = document.createElement('li');
                li.className = 'list-group-item d-flex justify-content-between align-items-center';
                li.innerHTML = `
                    <img src="${item.image}" alt="${item.name}" class="img-thumbnail" style="width: 50px; height: 50px; margin-right: 10px;">
                    <span>${item.name}</span>
                    <span>${item.price}원</span>
                    <input type="number" min="1" value="${item.quantity}" class="form-control quantity-input" data-id="${item.id}" style="width: 60px;">
                    <button class="btn btn-danger btn-sm remove-item-btn" data-id="${item.id}">Remove</button>
                `;
                cartItemsElement.appendChild(li);
                totalPrice += item.price * item.quantity;
            });

            totalPriceElement.textContent = totalPrice;

            // 수량 변경 이벤트 처리
            document.querySelectorAll('.quantity-input').forEach(input => {
                input.addEventListener('change', (event) => {
                    const id = event.target.getAttribute('data-id');
                    const newQuantity = parseInt(event.target.value, 10);
                    const cart = JSON.parse(localStorage.getItem('cart')) || [];
                    const item = cart.find(item => item.id == id);

                    if (item) {
                        item.quantity = newQuantity;
                        localStorage.setItem('cart', JSON.stringify(cart));
                        renderCartItems();
                    }
                });
            });

            // 항목 제거 이벤트 처리
            document.querySelectorAll('.remove-item-btn').forEach(button => {
                button.addEventListener('click', (event) => {
                    const id = event.target.getAttribute('data-id');
                    let cart = JSON.parse(localStorage.getItem('cart')) || [];
                    cart = cart.filter(item => item.id != id);
                    localStorage.setItem('cart', JSON.stringify(cart));
                    renderCartItems();
                });
            });
        }
    }

    renderCartItems();
});
