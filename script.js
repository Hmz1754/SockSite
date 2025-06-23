// Product data with inventory
const products = [
    {
        id: 1,
        name: "Pizza Socks",
        description: "Delicious pizza slices on your feet! Perfect for food lovers.",
        price: 6.99,
        category: "food",
        image: "assets/Pizza socks.png",
        fallbackColor: "#FF6B6B",
        tag: "Best Seller",
        inventory: 12,
        isPopular: true
    },
    {
        id: 2,
        name: "Dinosaur Socks",
        description: "Rawr! These prehistoric pals will make your feet roar with style.",
        price: 8.49,
        category: "animal",
        image: "assets/Dinosaur Socks.jpg",
        fallbackColor: "#4ECDC4",
        tag: "Limited Edition",
        inventory: 3,
        isPopular: true
    },
    {
        id: 3,
        name: "Dad Joke Socks",
        description: "Why did the sock go to therapy? Because it had too many issues!",
        price: 4.99,
        category: "funny",
        image: "assets/Dad Joke socks.jpg",
        fallbackColor: "#FFE66D",
        inventory: 8,
        isPopular: true
    },
    {
        id: 4,
        name: "Christmas Tree Socks",
        description: "Deck your feet with holiday cheer! Perfect for the festive season.",
        price: 7.99,
        category: "holiday",
        image: "assets/Christmas Tree Socks.jpg",
        fallbackColor: "#2ECC71",
        tag: "Best Seller",
        inventory: 5,
        isPopular: false
    },
    {
        id: 5,
        name: "Cat Socks",
        description: "Meow! These purr-fect socks will make you feel feline fine.",
        price: 8.99,
        category: "animal",
        image: "assets/Cat Socks.jpg",
        fallbackColor: "#9B59B6",
        inventory: 15,
        isPopular: true
    },
    {
        id: 6,
        name: "Taco Socks",
        description: "Taco 'bout delicious! These socks are nacho average footwear.",
        price: 5.99,
        category: "food",
        image: "assets/Taco Socks.jpg",
        fallbackColor: "#F39C12",
        tag: "Limited Edition",
        inventory: 2,
        isPopular: false
    },
    {
        id: 7,
        name: "Pun Socks",
        description: "Sock it to me! These witty socks will keep you laughing.",
        price: 4.49,
        category: "funny",
        image: "assets/Pun Socks.jpg",
        fallbackColor: "#E74C3C",
        inventory: 20,
        isPopular: false
    },
    {
        id: 8,
        name: "Halloween Socks",
        description: "Spooky socks for the most haunting holiday of the year!",
        price: 6.49,
        category: "holiday",
        image: "assets/halloween socks.jpeg",
        fallbackColor: "#8E44AD",
        inventory: 7,
        isPopular: false
    }
];

// Referral system
let referrals = JSON.parse(localStorage.getItem('referrals')) || [];
let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

// Sock voting system
let sockVotes = JSON.parse(localStorage.getItem('sockVotes')) || {
    space: 0,
    ocean: 0,
    forest: 0
};

// Cart state
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentFilter = 'all';

// Performance optimization
let scrollTimeout;
let resizeTimeout;

// DOM elements - will be initialized after DOM loads
let productsGrid, popularGrid, cartCount, themeToggle, filterButtons, hamburger, navMenu, navbar;

// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    // Initialize DOM elements
    productsGrid = document.getElementById('productsGrid');
    popularGrid = document.getElementById('popularGrid');
    cartCount = document.querySelector('.cart-count');
    themeToggle = document.getElementById('themeToggle');
    filterButtons = document.querySelectorAll('.filter-btn');
    hamburger = document.querySelector('.hamburger');
    navMenu = document.querySelector('.nav-menu');
    navbar = document.querySelector('.navbar');
    
    // Initialize the app
    initializeTheme();
    loadProducts();
    loadPopularProducts();
    updateCartCount();
    setupEventListeners();
    initializeReferralSystem();
    updateVoteCounts();
    initializeScrollAnimations();
    initializeScrollEffects();
    
    // Add loading animation
    document.body.classList.add('loaded');
    
    // Add smooth scrolling to all internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', function(e) {
        const modal = document.getElementById('quickViewModal');
        if (e.target === modal) {
            closeQuickView();
        }
    });
    
    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeQuickView();
        }
    });
});

// Enhanced Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe all elements that should animate on scroll
    const animateElements = document.querySelectorAll('.product-card, .category-card, .review-card, .about-feature, .why-shop-feature, .faq-item');
    animateElements.forEach(el => {
        el.classList.add('scroll-animate');
        observer.observe(el);
    });
}

// Enhanced Scroll Effects
function initializeScrollEffects() {
    // Navbar scroll effect
    window.addEventListener('scroll', throttle(() => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, 16));
    
    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Performance optimization utilities
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Enhanced Load Popular Products
function loadPopularProducts() {
    if (!popularGrid) {
        return;
    }
    
    const popularProducts = products.filter(product => product.isPopular);
    
    popularGrid.innerHTML = '';
    
    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    
    popularProducts.forEach((product, index) => {
        const productCard = createProductCard(product);
        // Stagger animation
        productCard.style.animationDelay = `${index * 0.1}s`;
        fragment.appendChild(productCard);
    });
    
    popularGrid.appendChild(fragment);
}

// Enhanced New Arrivals Function
window.showNewArrivals = function() {
    // Add loading state
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.classList.add('loading');
    }
    
    // Filter to show only products with "Limited Edition" tag
    const newArrivals = products.filter(product => product.tag === "Limited Edition");
    
    setTimeout(() => {
        if (newArrivals.length > 0) {
            loadProducts('new-arrivals');
            showNotification('Showing Limited Edition New Arrivals!', 'success');
            // Scroll to products
            if (productsSection) {
                productsSection.scrollIntoView({ behavior: 'smooth' });
            }
        } else {
            showNotification('No new arrivals at the moment!', 'info');
        }
        
        // Remove loading state
        if (productsSection) {
            productsSection.classList.remove('loading');
        }
    }, 500);
}

// Enhanced Custom Sock Submission
window.submitCustomSock = function(event) {
    event.preventDefault();
    const form = event.target;
    const submitBtn = form.querySelector('.custom-sock-btn');
    
    // Add loading state
    submitBtn.classList.add('loading');
    submitBtn.textContent = 'Submitting...';
    
    const formData = new FormData(form);
    
    // Get form values
    const firstName = form.querySelector('input[placeholder="First Name"]').value;
    const lastName = form.querySelector('input[placeholder="Last Name"]').value;
    const email = form.querySelector('input[type="email"]').value;
    const idea = form.querySelector('textarea').value;
    
    // Validate form
    if (!firstName || !lastName || !email || !idea) {
        showNotification('Please fill in all fields!', 'error');
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'Submit Idea';
        return;
    }
    
    // Store in localStorage (in a real app, this would go to a server)
    const customSockIdeas = JSON.parse(localStorage.getItem('customSockIdeas')) || [];
    customSockIdeas.push({
        id: Date.now(),
        firstName,
        lastName,
        email,
        idea,
        date: new Date().toISOString()
    });
    localStorage.setItem('customSockIdeas', JSON.stringify(customSockIdeas));
    
    // Reset form
    form.reset();
    
    // Show success message
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        submitBtn.textContent = 'Submit Idea';
        showNotification('Thank you for your idea! We\'ll get back to you soon.', 'success');
    }, 1000);
}

// Enhanced Sock Voting
window.voteForSock = function(type) {
    const voteBtn = document.querySelector(`[onclick="voteForSock('${type}')"]`);
    const voteCount = document.querySelector(`#${type}Votes`);
    
    // Add loading state
    voteBtn.classList.add('loading');
    
    setTimeout(() => {
        sockVotes[type]++;
        localStorage.setItem('sockVotes', JSON.stringify(sockVotes));
        updateVoteCounts();
        
        // Remove loading state
        voteBtn.classList.remove('loading');
        
        // Show success message
        showNotification(`Vote recorded for ${type} socks!`, 'success');
    }, 500);
}

// Enhanced Vote Counts Update
function updateVoteCounts() {
    Object.keys(sockVotes).forEach(type => {
        const voteElement = document.getElementById(`${type}Votes`);
        if (voteElement) {
            voteElement.textContent = sockVotes[type];
        }
    });
}

// Enhanced Referral System
function initializeReferralSystem() {
    // Check for referral code in URL
    const urlParams = new URLSearchParams(window.location.search);
    const referralCode = urlParams.get('ref');
    
    if (referralCode && !currentUser) {
        // Generate unique user ID
        const userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        currentUser = { id: userId, referralCode: referralCode };
        localStorage.setItem('currentUser', JSON.stringify(currentUser));
        
        // Add to referrals
        referrals.push({
            referrer: referralCode,
            referred: userId,
            date: new Date().toISOString()
        });
        localStorage.setItem('referrals', JSON.stringify(referrals));
        
        showNotification('Welcome! You\'ve been referred by a friend!', 'success');
    }
    
    // Generate referral link for current user
    if (currentUser) {
        const referralLink = `${window.location.origin}${window.location.pathname}?ref=${currentUser.id}`;
        const referralInput = document.querySelector('.referral-link-input');
        if (referralInput) {
            referralInput.value = referralLink;
        }
    }
}

// Enhanced Referral Gift Check
function hasReferralGift() {
    if (!currentUser) return false;
    
    const userReferrals = referrals.filter(ref => ref.referrer === currentUser.id);
    return userReferrals.length >= 3; // Gift after 3 successful referrals
}

// Enhanced Event Listeners
function setupEventListeners() {
    // Theme toggle
    if (themeToggle) {
        themeToggle.addEventListener('click', toggleTheme);
    }
    
    // Filter buttons
    filterButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const category = this.dataset.category;
            filterProducts(category);
            
            // Update active state
            filterButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Mobile menu
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            navMenu.classList.remove('active');
            hamburger.classList.remove('active');
        }
    });
    
    // Copy referral link
    const copyBtn = document.querySelector('.copy-btn');
    if (copyBtn) {
        copyBtn.addEventListener('click', copyReferralLink);
    }
    
    // Claim gift button
    const claimGiftBtn = document.querySelector('.claim-gift-btn');
    if (claimGiftBtn) {
        claimGiftBtn.addEventListener('click', claimReferralGift);
    }
    
    // FAQ accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(question => {
        question.addEventListener('click', toggleFAQ);
    });
    
    // Newsletter form
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
    
    // Referral form
    const referralForm = document.querySelector('.referral-form');
    if (referralForm) {
        referralForm.addEventListener('submit', handleReferralSubmit);
    }
}

// Enhanced Theme Management
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);
}

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon(newTheme);
    
    // Add transition effect
    document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    setTimeout(() => {
        document.body.style.transition = '';
    }, 300);
}

function updateThemeIcon(theme) {
    const icon = themeToggle.querySelector('i');
    icon.className = theme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
}

// Enhanced Product Loading
function loadProducts(filter = 'all') {
    if (!productsGrid) return;
    
    let filteredProducts = products;
    
    if (filter === 'new-arrivals') {
        filteredProducts = products.filter(product => product.tag === "Limited Edition");
    } else if (filter !== 'all') {
        filteredProducts = products.filter(product => product.category === filter);
    }
    
    productsGrid.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsGrid.innerHTML = `
            <div style="grid-column: 1 / -1; text-align: center; padding: 2rem;">
                <i class="fas fa-search" style="font-size: 3rem; color: var(--text-secondary); margin-bottom: 1rem;"></i>
                <h3 style="color: var(--text-secondary);">No products found</h3>
                <p style="color: var(--text-secondary);">Try adjusting your filters or check back later!</p>
            </div>
        `;
        return;
    }
    
    // Use DocumentFragment for better performance
    const fragment = document.createDocumentFragment();
    
    filteredProducts.forEach((product, index) => {
        const productCard = createProductCard(product);
        // Stagger animation
        productCard.style.animationDelay = `${index * 0.1}s`;
        fragment.appendChild(productCard);
    });
    
    productsGrid.appendChild(fragment);
}

// Enhanced Product Card Creation
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        ${product.tag ? `<div class="product-tag ${product.tag.toLowerCase().replace(' ', '-')}">${product.tag}</div>` : ''}
        ${product.inventory <= 5 && product.inventory > 0 ? `<div class="inventory-warning">Only ${product.inventory} left!</div>` : ''}
        ${product.inventory === 0 ? `<div class="out-of-stock">Out of Stock</div>` : ''}
        <div class="product-image" style="background: ${product.fallbackColor}">
            <img src="${product.image}" alt="${product.name}" onerror="this.style.display='none'">
        </div>
        <div class="product-info">
            <a href="#" class="product-link" onclick="showQuickView(${product.id}); return false;">
                <h3 class="product-name">${product.name}</h3>
            </a>
            <p class="product-description">${product.description}</p>
            <div class="product-price">$${product.price.toFixed(2)}</div>
            <button class="add-to-cart-btn" onclick="addToCart(${product.id}, this)" ${product.inventory === 0 ? 'disabled' : ''}>
                ${product.inventory === 0 ? 'Out of Stock' : 'Add to Cart'}
            </button>
            <button class="quick-view-btn" onclick="showQuickView(${product.id})">Quick View</button>
        </div>
    `;
    
    return card;
}

// Enhanced Product Filtering
function filterProducts(category) {
    currentFilter = category;
    loadProducts(category);
    
    // Update URL without page reload
    const url = new URL(window.location);
    if (category === 'all') {
        url.searchParams.delete('category');
    } else {
        url.searchParams.set('category', category);
    }
    window.history.pushState({}, '', url);
}

// Enhanced Add to Cart
function addToCart(productId, btn) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    if (product.inventory === 0) {
        showNotification('Sorry, this product is out of stock!', 'error');
        return;
    }
    
    // Add loading state
    btn.classList.add('loading');
    btn.textContent = 'Adding...';
    
    setTimeout(() => {
        const existingItem = cart.find(item => item.id === productId);
        
        if (existingItem) {
            if (existingItem.quantity < product.inventory) {
                existingItem.quantity++;
            } else {
                showNotification('Sorry, no more stock available!', 'error');
                btn.classList.remove('loading');
                btn.textContent = 'Add to Cart';
                return;
            }
        } else {
            cart.push({
                id: productId,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }
        
        // Update inventory
        product.inventory--;
        
        saveCart();
        updateCartCount();
        updateProductButtons();
        
        // Re-render cart if on cart page
        if (window.location.pathname.includes('cart.html')) {
            renderCart();
        }
        
        // Remove loading state
        btn.classList.remove('loading');
        btn.textContent = 'Add to Cart';
        
        // Show success message
        showNotification(`${product.name} added to cart!`, 'success');
        
        // Animate cart count
        cartCount.classList.add('cart-bounce');
        setTimeout(() => cartCount.classList.remove('cart-bounce'), 500);
        
    }, 500);
}

// Enhanced Remove from Cart
function removeFromCart(productId) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);
    
    if (cartItem && product) {
        // Restore inventory
        product.inventory += cartItem.quantity;
        
        // Remove from cart
        cart = cart.filter(item => item.id !== productId);
        saveCart();
        updateCartCount();
        updateProductButtons();
        
        // Re-render cart if on cart page
        if (window.location.pathname.includes('cart.html')) {
            renderCart();
        }
        
        showNotification(`${product.name} removed from cart!`, 'info');
    }
}

// Enhanced Quantity Update
function updateQuantity(productId, change) {
    const product = products.find(p => p.id === productId);
    const cartItem = cart.find(item => item.id === productId);
    
    if (!cartItem || !product) return;
    
    const newQuantity = cartItem.quantity + change;
    
    if (newQuantity <= 0) {
        removeFromCart(productId);
        return;
    }
    
    if (newQuantity > product.inventory + cartItem.quantity) {
        showNotification('Sorry, no more stock available!', 'error');
        return;
    }
    
    // Update inventory
    product.inventory -= change;
    cartItem.quantity = newQuantity;
    
    saveCart();
    updateCartCount();
    updateProductButtons();
    
    // Re-render cart if on cart page
    if (window.location.pathname.includes('cart.html')) {
        renderCart();
    }
}

// Enhanced Cart Management
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        
        // Add animation for cart updates
        if (totalItems > 0) {
            cartCount.style.animation = 'cartBounce 0.5s';
            setTimeout(() => {
                cartCount.style.animation = '';
            }, 500);
        }
    }
}

function updateProductButtons() {
    const addButtons = document.querySelectorAll('.add-to-cart-btn');
    addButtons.forEach(btn => {
        const productId = parseInt(btn.getAttribute('onclick').match(/\d+/)[0]);
        const product = products.find(p => p.id === productId);
        const cartItem = cart.find(item => item.id === productId);
        
        if (product.inventory === 0) {
            btn.disabled = true;
            btn.textContent = 'Out of Stock';
        } else if (cartItem && cartItem.quantity >= product.inventory) {
            btn.disabled = true;
            btn.textContent = 'Max Quantity';
        } else {
            btn.disabled = false;
            btn.textContent = 'Add to Cart';
        }
    });
}

// Enhanced Navigation Functions
function scrollToProducts() {
    const productsSection = document.getElementById('products');
    if (productsSection) {
        productsSection.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
}

// Enhanced Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${getNotificationIcon(type)}"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${getNotificationColor(type)};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15);
        z-index: 10000;
        animation: slideInRight 0.3s ease;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'fa-check-circle',
        error: 'fa-exclamation-circle',
        warning: 'fa-exclamation-triangle',
        info: 'fa-info-circle'
    };
    return icons[type] || icons.info;
}

function getNotificationColor(type) {
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6'
    };
    return colors[type] || colors.info;
}

// Enhanced Quick View Modal
window.showQuickView = function(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('quickViewModal');
    const content = document.getElementById('quickViewContent');
    
    content.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; align-items: start;">
            <div class="product-image" style="background: ${product.fallbackColor}; height: 300px; border-radius: 12px;">
                <img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: contain; padding: 1rem;">
            </div>
            <div>
                <h2 style="color: var(--text-primary); margin-bottom: 0.5rem;">${product.name}</h2>
                <p style="color: var(--text-secondary); margin-bottom: 1rem;">${product.description}</p>
                <div style="font-size: 1.5rem; font-weight: 700; color: var(--primary-color); margin-bottom: 1rem;">
                    $${product.price.toFixed(2)}
                </div>
                <div style="margin-bottom: 1rem;">
                    <strong>Category:</strong> ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}
                </div>
                <div style="margin-bottom: 1rem;">
                    <strong>Inventory:</strong> ${product.inventory} available
                </div>
                ${product.tag ? `<div style="margin-bottom: 1rem;"><strong>Tag:</strong> ${product.tag}</div>` : ''}
                <button class="add-to-cart-btn" onclick="addToCart(${product.id}, this); closeQuickView();" ${product.inventory === 0 ? 'disabled' : ''} style="width: 100%; margin-bottom: 0.5rem;">
                    ${product.inventory === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button onclick="closeQuickView()" style="width: 100%; padding: 0.75rem; border: 1px solid var(--border-color); background: transparent; border-radius: 8px; cursor: pointer; transition: all 0.3s ease;">
                    Close
                </button>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

window.closeQuickView = function() {
    const modal = document.getElementById('quickViewModal');
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Enhanced Form Handlers
function handleNewsletterSubmit(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    
    if (!email) {
        showNotification('Please enter your email address!', 'error');
        return;
    }
    
    showNotification('Thank you for subscribing to our newsletter!', 'success');
    event.target.reset();
}

function handleReferralSubmit(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;
    
    if (!email) {
        showNotification('Please enter your friend\'s email!', 'error');
        return;
    }
    
    showNotification('Referral invitation sent!', 'success');
    event.target.reset();
}

// Enhanced Copy Functions
function copyReferralLink() {
    const referralInput = document.querySelector('.referral-link-input');
    if (referralInput) {
        referralInput.select();
        document.execCommand('copy');
        showNotification('Referral link copied to clipboard!', 'success');
    }
}

function claimReferralGift() {
    if (hasReferralGift()) {
        showNotification('Congratulations! Your gift has been claimed!', 'success');
        // In a real app, this would trigger a discount code or free product
    } else {
        showNotification('You need 3 successful referrals to claim a gift!', 'info');
    }
}

// Enhanced FAQ Toggle
function toggleFAQ(event) {
    const question = event.currentTarget;
    const answer = question.nextElementSibling;
    const icon = question.querySelector('i');
    
    question.classList.toggle('active');
    answer.classList.toggle('active');
    
    if (icon) {
        icon.style.transform = question.classList.contains('active') ? 'rotate(180deg)' : 'rotate(0deg)';
    }
}

// Enhanced Checkout
function checkout() {
    if (cart.length === 0) {
        showNotification('Your cart is empty!', 'error');
        return;
    }
    
    // Redirect to checkout page
    window.location.href = 'checkout.html';
}

// Enhanced Cart Rendering
function renderCart() {
    const cartContainer = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    if (!cartContainer) return;
    
    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="empty-cart">
                <i class="fas fa-shopping-cart"></i>
                <h3>Your cart is empty</h3>
                <p>Add some awesome socks to get started!</p>
                <a href="index.html" class="continue-shopping-btn">
                    Continue Shopping
                </a>
            </div>
        `;
        if (cartSummary) cartSummary.style.display = 'none';
        return;
    }
    
    cartContainer.innerHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}">
            <div class="cart-item-info">
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)}</p>
            </div>
            <div class="cart-item-quantity">
                <button onclick="updateQuantity(${item.id}, -1)">-</button>
                <span>${item.quantity}</span>
                <button onclick="updateQuantity(${item.id}, 1)">+</button>
            </div>
            <button onclick="removeFromCart(${item.id})" class="cart-item-remove">
                <i class="fas fa-trash"></i>
            </button>
        </div>
    `).join('');
    
    // Update total and show summary
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalElement = document.getElementById('cartTotal');
    if (totalElement) {
        totalElement.textContent = `$${total.toFixed(2)}`;
    }
    if (cartSummary) cartSummary.style.display = 'block';
}

// Make cart functions globally accessible
window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.updateQuantity = updateQuantity;
window.checkout = checkout;
window.renderCart = renderCart;

// Initialize cart page if on cart.html
if (window.location.pathname.includes('cart.html')) {
    document.addEventListener('DOMContentLoaded', function() {
        renderCart();
        updateCartCount();
    });
} 