// Checkout functionality
let currentStep = 1;
let checkoutData = {
    shipping: {},
    payment: {},
    order: {}
};

// Initialize checkout
document.addEventListener('DOMContentLoaded', function() {
    initializeCheckout();
    updateOrderSummary();
    setupFormValidation();
});

function initializeCheckout() {
    // Check if cart is empty
    if (cart.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    // Initialize form data
    checkoutData.order = {
        items: cart,
        subtotal: calculateSubtotal(),
        shipping: 4.99,
        tax: 0,
        total: 0
    };
    
    updateTotals();
}

function setupFormValidation() {
    // Card number formatting
    const cardNumber = document.getElementById('cardNumber');
    if (cardNumber) {
        cardNumber.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            value = value.replace(/\D/g, '');
            value = value.replace(/(\d{4})/g, '$1 ').trim();
            e.target.value = value;
        });
    }
    
    // Expiry date formatting
    const expiryDate = document.getElementById('expiryDate');
    if (expiryDate) {
        expiryDate.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
    
    // CVV validation
    const cvv = document.getElementById('cvv');
    if (cvv) {
        cvv.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
}

function nextStep() {
    if (validateCurrentStep()) {
        if (currentStep < 3) {
            currentStep++;
            showStep(currentStep);
            updateProgress();
        }
    }
}

function prevStep() {
    if (currentStep > 1) {
        currentStep--;
        showStep(currentStep);
        updateProgress();
    }
}

function showStep(step) {
    // Hide all steps
    document.querySelectorAll('.checkout-step').forEach(s => s.classList.remove('active'));
    
    // Show current step
    document.getElementById(`step${step}`).classList.add('active');
    
    // Update step-specific content
    if (step === 3) {
        populateReviewStep();
    }
}

function updateProgress() {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        if (index + 1 <= currentStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

function validateCurrentStep() {
    const currentStepElement = document.getElementById(`step${currentStep}`);
    const form = currentStepElement.querySelector('form');
    
    if (!form) return true;
    
    // Basic form validation
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;
    
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            field.classList.add('error');
            isValid = false;
        } else {
            field.classList.remove('error');
        }
    });
    
    // Step-specific validation
    if (currentStep === 1) {
        isValid = validateShippingForm();
    } else if (currentStep === 2) {
        isValid = validatePaymentForm();
    }
    
    if (!isValid) {
        showNotification('Please fill in all required fields correctly.', 'error');
    }
    
    return isValid;
}

function validateShippingForm() {
    const email = document.getElementById('email').value;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!emailRegex.test(email)) {
        document.getElementById('email').classList.add('error');
        return false;
    }
    
    // Save shipping data
    checkoutData.shipping = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: email,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        state: document.getElementById('state').value,
        zipCode: document.getElementById('zipCode').value,
        shippingMethod: document.querySelector('input[name="shipping"]:checked').value
    };
    
    // Update shipping cost
    const shippingCosts = {
        standard: 4.99,
        express: 9.99,
        overnight: 19.99
    };
    
    checkoutData.order.shipping = shippingCosts[checkoutData.shipping.shippingMethod];
    updateTotals();
    
    return true;
}

function validatePaymentForm() {
    const cardNumber = document.getElementById('cardNumber').value.replace(/\s/g, '');
    const expiryDate = document.getElementById('expiryDate').value;
    const cvv = document.getElementById('cvv').value;
    
    // Basic card validation
    if (cardNumber.length < 13 || cardNumber.length > 19) {
        document.getElementById('cardNumber').classList.add('error');
        return false;
    }
    
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
        document.getElementById('expiryDate').classList.add('error');
        return false;
    }
    
    if (cvv.length < 3 || cvv.length > 4) {
        document.getElementById('cvv').classList.add('error');
        return false;
    }
    
    // Save payment data
    checkoutData.payment = {
        cardNumber: cardNumber,
        expiryDate: expiryDate,
        cvv: cvv,
        cardName: document.getElementById('cardName').value
    };
    
    return true;
}

function populateReviewStep() {
    // Populate shipping review
    const shippingReview = document.getElementById('shippingReview');
    shippingReview.innerHTML = `
        <p><strong>${checkoutData.shipping.firstName} ${checkoutData.shipping.lastName}</strong></p>
        <p>${checkoutData.shipping.address}</p>
        <p>${checkoutData.shipping.city}, ${checkoutData.shipping.state} ${checkoutData.shipping.zipCode}</p>
        <p>Email: ${checkoutData.shipping.email}</p>
        <p>Phone: ${checkoutData.shipping.phone || 'Not provided'}</p>
        <p>Shipping: ${checkoutData.shipping.shippingMethod.charAt(0).toUpperCase() + checkoutData.shipping.shippingMethod.slice(1)}</p>
    `;
    
    // Populate payment review
    const paymentReview = document.getElementById('paymentReview');
    const maskedCard = '**** **** **** ' + checkoutData.payment.cardNumber.slice(-4);
    paymentReview.innerHTML = `
        <p><strong>${checkoutData.payment.cardName}</strong></p>
        <p>${maskedCard}</p>
        <p>Expires: ${checkoutData.payment.expiryDate}</p>
    `;
    
    // Populate order items review
    const orderItemsReview = document.getElementById('orderItemsReview');
    orderItemsReview.innerHTML = cart.map(item => `
        <div class="review-item">
            <img src="${item.image}" alt="${item.name}" width="50" height="50">
            <div class="item-details">
                <h4>${item.name}</h4>
                <p>Quantity: ${item.quantity}</p>
                <p>$${(item.price * item.quantity).toFixed(2)}</p>
            </div>
        </div>
    `).join('');
}

function updateOrderSummary() {
    const orderSummaryItems = document.getElementById('orderSummaryItems');
    
    orderSummaryItems.innerHTML = cart.map(item => `
        <div class="summary-item">
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>Qty: ${item.quantity}</p>
            </div>
            <div class="item-price">
                $${(item.price * item.quantity).toFixed(2)}
            </div>
        </div>
    `).join('');
}

function calculateSubtotal() {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function updateTotals() {
    const subtotal = calculateSubtotal();
    const shipping = checkoutData.order.shipping;
    const tax = subtotal * 0.08; // 8% tax rate
    const total = subtotal + shipping + tax;
    
    document.getElementById('subtotal').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('shippingCost').textContent = `$${shipping.toFixed(2)}`;
    document.getElementById('taxAmount').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;
    
    checkoutData.order.subtotal = subtotal;
    checkoutData.order.tax = tax;
    checkoutData.order.total = total;
}

function placeOrder() {
    // Show loading state
    const placeOrderBtn = document.querySelector('.btn-large');
    const originalText = placeOrderBtn.innerHTML;
    placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    placeOrderBtn.disabled = true;
    
    // Simulate order processing
    setTimeout(() => {
        // Clear cart
        cart = [];
        localStorage.setItem('cart', JSON.stringify(cart));
        
        // Show success message
        showNotification('Order placed successfully! Thank you for your purchase.', 'success');
        
        // Redirect to confirmation page or home
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
        
    }, 2000);
}

// Make functions globally accessible
window.nextStep = nextStep;
window.prevStep = prevStep;
window.placeOrder = placeOrder; 