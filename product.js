// Product detail page functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize theme and cart count
    initializeTheme();
    updateCartCount();
    setupEventListeners();
    
    // Load product details
    loadProductDetails();
});

function loadProductDetails() {
    const urlParams = new URLSearchParams(window.location.search);
    const productId = parseInt(urlParams.get('id'));
    
    if (!productId) {
        showProductNotFound();
        return;
    }
    
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        showProductNotFound();
        return;
    }
    
    displayProductDetails(product);
}

function displayProductDetails(product) {
    const container = document.querySelector('.product-detail-container');
    const isInCart = cart.some(item => item.id === product.id);
    
    container.innerHTML = `
        <div class="product-detail">
            <div class="product-detail-image">
                <img src="${product.image}" alt="${product.name}" loading="lazy"
                     onerror="this.style.background='${product.fallbackColor}'; this.style.display='flex'; this.style.alignItems='center'; this.style.justifyContent='center'; this.style.color='white'; this.style.fontWeight='bold'; this.style.fontSize='2rem'; this.src=''; this.innerHTML='${product.name}';">
            </div>
            <div class="product-detail-info">
                <div class="product-detail-header">
                    <h1 class="product-detail-name">${product.name}</h1>
                    <span class="product-detail-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
                </div>
                <p class="product-detail-description">${product.description}</p>
                <div class="product-detail-price">$${product.price.toFixed(2)}</div>
                <div class="product-detail-actions">
                    <button class="add-to-cart-btn-large" 
                            onclick="addToCartFromDetail(${product.id})"
                            ${isInCart ? 'disabled' : ''}>
                        ${isInCart ? 'In Cart' : 'Add to Cart'}
                    </button>
                    <a href="index.html#products" class="back-to-products-btn">
                        <i class="fas fa-arrow-left"></i> Back to Products
                    </a>
                </div>
                <div class="product-detail-features">
                    <div class="feature">
                        <i class="fas fa-shipping-fast"></i>
                        <span>Free Shipping</span>
                    </div>
                    <div class="feature">
                        <i class="fas fa-undo"></i>
                        <span>30-Day Returns</span>
                    </div>
                    <div class="feature">
                        <i class="fas fa-shield-alt"></i>
                        <span>Quality Guarantee</span>
                    </div>
                </div>
            </div>
        </div>
    `;
    
    // Update page title
    document.title = `${product.name} - Sock Drop`;
}

function showProductNotFound() {
    const container = document.querySelector('.product-detail-container');
    
    container.innerHTML = `
        <div class="product-not-found">
            <div class="not-found-icon">
                <i class="fas fa-socks"></i>
            </div>
            <h1>Product Not Found</h1>
            <p>Sorry, we couldn't find the product you're looking for.</p>
            <a href="index.html#products" class="cta-button">
                Browse All Products
            </a>
        </div>
    `;
    
    document.title = 'Product Not Found - Sock Drop';
}

function addToCartFromDetail(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCount();
    
    // Update button state
    const button = document.querySelector('.add-to-cart-btn-large');
    if (button) {
        button.disabled = true;
        button.textContent = 'In Cart';
    }
    
    // Show success message
    showNotification(`${product.name} added to cart!`);
} 