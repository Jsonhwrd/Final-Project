
// 1. Initialise Icons and AOS
document.addEventListener('DOMContentLoaded', () => {
    lucide.createIcons();
    AOS.init({
        duration: 1000,
        once: true,
        // Disable AOS on smaller screens (less than 768px) for performance
        disable: window.innerWidth < 768,
    });
    // Re-initialize AOS on resize to handle changes across breakpoints
    window.addEventListener('resize', () => {
        AOS.init({ disable: window.innerWidth < 768 });
    });
    selectGiftCardValue(100); // Initialize default value for the gift card page
});

// 2. Product and Cart Data
const products = {
    'bbwhey49': { name: 'Premium Whey Blend', price: 49.99, img: 'source/image.jpg' },
    'bbcreat29': { name: 'Micronized Creatine', price: 29.99, img: 'source/creatine 2.jpg' },
    'bbpre34': { name: 'Essential Pre-Workout', price: 34.99, img: 'source/bcaa.jpg' }
};
let cart = [];
let selectedCardValue = 100; // State for the gift card value

// 3. Core Cart Functions
const updateCartDisplay = () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');
    let total = 0;
    let count = 0;
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="text-gray-500 text-center italic mt-4">Your cart is empty.</p>';
        checkoutBtn.disabled = true;
        checkoutBtn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        checkoutBtn.disabled = false;
        checkoutBtn.classList.remove('opacity-50', 'cursor-not-allowed');

        cart.forEach(item => {
            total += item.product.price;
            count++;

            const itemHtml = `
                        <div class="flex items-center space-x-4 p-3 bg-gray-800 rounded-lg">
                            <img src="${item.product.img}" alt="${item.product.name}" class="w-12 h-12 rounded object-cover border border-gray-700">
                            <div class="flex-grow">
                                <p class="font-semibold text-white truncate">${item.product.name}</p>
                                <p class="text-sm text-cyan-400">$${item.product.price.toFixed(2)}</p>
                            </div>
                            <button onclick="removeFromCart('${item.id}')" class="text-gray-500 hover:text-red-500 transition p-1">
                                <i data-lucide="trash-2" class="w-5 h-5"></i>
                            </button>
                        </div>
                    `;
            cartItemsContainer.insertAdjacentHTML('beforeend', itemHtml);
        });
        lucide.createIcons(); // Re-render icons for new items
    }

    cartCount.textContent = count;
    cartTotal.textContent = `$${total.toFixed(2)}`;
};

const addToCart = (productId) => {
    const product = products[productId];
    if (product) {
        cart.push({ id: Date.now(), product: product });
        updateCartDisplay();
        showMessage('Item Added!', `${product.name} has been added to your cart.`, event);
    }
};

const removeFromCart = (itemId) => {
    const index = cart.findIndex(item => item.id == itemId);
    if (index > -1) {
        cart.splice(index, 1);
        updateCartDisplay();
    }
};

const toggleCart = (open) => {
    const cartPanel = document.getElementById('cart-panel');
    const overlay = document.getElementById('overlay');

    if (open) {
        cartPanel.classList.add('open');
        overlay.classList.add('active');
        updateCartDisplay();
    } else {
        cartPanel.classList.remove('open');
        overlay.classList.remove('active');
    }
};

const handleCheckout = () => {
    showMessage('Checkout Pending', 'The checkout process is currently under development. Thanks for your understanding!', event);
    toggleCart(false);
    cart = []; // Clear cart on simulated checkout
    updateCartDisplay();
}

// Gift Card Functions
const selectGiftCardValue = (value) => {
    selectedCardValue = value;
    const valueDisplay = document.getElementById('selected-card-value');
    const cardDisplay = document.getElementById('card-display-value');
    if (valueDisplay) valueDisplay.textContent = `Selected: $${value}`;
    if (cardDisplay) cardDisplay.textContent = `$${value}`;

    // Highlight selected button (optional visual cue)
    document.querySelectorAll('#gift-card-page button[data-value]').forEach(btn => {
        btn.classList.remove('border-cyan-500');
    });
    document.querySelector(`#gift-card-page button[data-value="${value}"]`)?.classList.add('border-cyan-500');
}

const purchaseGiftCard = (event) => {
    showMessage('Gift Card Purchase', `A $${selectedCardValue} BulkBase Gift Card has been successfully purchased (simulated). The digital card will be delivered to your email.`, event);
}

// 4. UI Management Functions
const mobileMenu = document.getElementById('mobile-menu');
const menuIconOpen = document.getElementById('menu-icon-open');
const menuIconClose = document.getElementById('menu-icon-close');
const backToTopBtn = document.getElementById('back-to-top');

// Scroll listener for Back to Top button
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

const toggleMobileMenu = (forceState) => {
    const isOpen = mobileMenu.classList.contains('is-open');

    if (forceState === false || isOpen) {
        // Close Menu
        mobileMenu.style.maxHeight = '0'; // Use style to animate
        mobileMenu.classList.remove('is-open');
        menuIconOpen.classList.remove('hidden');
        menuIconClose.classList.add('hidden');
    } else {
        // Open Menu
        // Calculate and set max height to allow smooth transition
        mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
        mobileMenu.classList.add('is-open');
        menuIconOpen.classList.add('hidden');
        menuIconClose.classList.remove('hidden');
    }
};

document.getElementById('mobile-menu-button').addEventListener('click', () => toggleMobileMenu());

const showPage = (pageId) => {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });
    document.getElementById(pageId).classList.add('active');
    window.scrollTo(0, 0); // Scroll to top on page switch
}

const showProductDetail = (productId) => {
    const product = products[productId];
    if (product) {
        showMessage('Product Details', `Details for ${product.name} - Price: $${product.price.toFixed(2)}. This would link to a full product page in a real store.`, event);
    }
}

const showMessage = (title, text, event) => {
    if (event) event.preventDefault();
    document.getElementById('message-title').textContent = title;
    document.getElementById('message-text').textContent = text;
    document.getElementById('message-box').classList.remove('hidden');
    document.getElementById('message-box').classList.add('flex');
}
