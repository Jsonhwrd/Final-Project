// 1. Initialise Icons and AOS
document.addEventListener('DOMContentLoaded', () => {
    if (window.lucide) {
        lucide.createIcons();
    }
    if (window.AOS) {
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
    }

    // Default gift card state + render cart from localStorage
    selectGiftCardValue(100);
    updateCartDisplay();
});

// 2. Product and Cart Data
const products = {
    'bbwhey49': { name: 'Isolate Whey', price: 49.99, img: 'source/image.jpg' },
    'bbcreat29': { name: 'Micronized Creatine', price: 29.99, img: 'source/creatine 2.jpg' },
    'bbpre34': { name: 'Essential BCAA', price: 34.99, img: 'source/bcaa.jpg' }
};

// 🔒 Persistent cart stored in localStorage (so checkout.html can read it)
let cart = JSON.parse(localStorage.getItem('cart') || '[]');
let selectedCardValue = 100; // State for the gift card value

const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};

// 3. Core Cart Functions
const updateCartDisplay = () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');
    const checkoutBtn = document.getElementById('checkout-btn');

    if (!cartItemsContainer || !cartCount || !cartTotal || !checkoutBtn) return;

    let total = 0;
    let count = 0;
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML =
            '<p class="text-gray-500 text-center italic mt-4">Your cart is empty.</p>';
        checkoutBtn.disabled = true;
        checkoutBtn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        checkoutBtn.disabled = false;
        checkoutBtn.classList.remove('opacity-50', 'cursor-not-allowed');

        cart.forEach(item => {
            total += item.price * item.quantity;
            count += item.quantity;

            const itemHtml = `
                <div class="flex items-center space-x-4 p-3 bg-gray-800 rounded-lg">
                    <img src="${item.img}" alt="${item.name}"
                         class="w-12 h-12 rounded object-cover border border-gray-700">
                    <div class="flex-grow">
                        <p class="font-semibold text-white truncate">${item.name}</p>
                        <p class="text-sm text-gray-400">Qty: ${item.quantity}</p>
                        <p class="text-sm text-cyan-400">$${item.price.toFixed(2)}</p>
                    </div>
                    <button onclick="removeFromCart('${item.id}')"
                            class="text-gray-500 hover:text-red-500 transition p-1">
                        <i data-lucide="trash-2" class="w-5 h-5"></i>
                    </button>
                </div>
            `;
            cartItemsContainer.insertAdjacentHTML('beforeend', itemHtml);
        });

        if (window.lucide) {
            lucide.createIcons(); // Re-render icons for new items
        }
    }

    cartCount.textContent = count;
    cartTotal.textContent = `$${total.toFixed(2)}`;
};

// Add item to cart (with quantity, and stored in localStorage)
const addToCart = (productId) => {
    const product = products[productId];
    if (!product) return;

    // If product already in cart, increase quantity
    const existing = cart.find(item => item.productId === productId);
    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: Date.now(),
            productId,
            name: product.name,
            price: product.price,
            img: product.img,
            quantity: 1
        });
    }

    saveCart();
    updateCartDisplay();
    showMessage('Item Added!', `${product.name} has been added to your cart.`);
};

// Remove item from cart
const removeFromCart = (itemId) => {
    cart = cart.filter(item => String(item.id) !== String(itemId));
    saveCart();
    updateCartDisplay();
};

// Open / close cart panel
const toggleCart = (open) => {
    const cartPanel = document.getElementById('cart-panel');
    const overlay = document.getElementById('overlay');

    if (!cartPanel || !overlay) return;

    if (open) {
        cartPanel.classList.add('open');
        overlay.classList.add('active');
        updateCartDisplay();
    } else {
        cartPanel.classList.remove('open');
        overlay.classList.remove('active');
    }
};

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
    const activeBtn = document.querySelector(
        `#gift-card-page button[data-value="${value}"]`
    );
    if (activeBtn) activeBtn.classList.add('border-cyan-500');
};

const purchaseGiftCard = (event) => {
    showMessage(
        'Gift Card Purchase',
        `A $${selectedCardValue} BulkBase Gift Card has been successfully purchased (simulated). The digital card will be delivered to your email.`,
        event
    );
};

// 4. UI Management Functions
const mobileMenu = document.getElementById('mobile-menu');
const menuIconOpen = document.getElementById('menu-icon-open');
const menuIconClose = document.getElementById('menu-icon-close');
const backToTopBtn = document.getElementById('back-to-top');

// Scroll listener for Back to Top button
window.addEventListener('scroll', () => {
    if (!backToTopBtn) return;
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
    } else {
        backToTopBtn.classList.remove('visible');
    }
});

const toggleMobileMenu = (forceState) => {
    if (!mobileMenu || !menuIconOpen || !menuIconClose) return;

    const isOpen = mobileMenu.classList.contains('is-open');

    if (forceState === false || isOpen) {
        // Close Menu
        mobileMenu.style.maxHeight = '0';
        mobileMenu.classList.remove('is-open');
        menuIconOpen.classList.remove('hidden');
        menuIconClose.classList.add('hidden');
    } else {
        // Open Menu
        mobileMenu.style.maxHeight = mobileMenu.scrollHeight + 'px';
        mobileMenu.classList.add('is-open');
        menuIconOpen.classList.add('hidden');
        menuIconClose.classList.remove('hidden');
    }
};

const mobileMenuButton = document.getElementById('mobile-menu-button');
if (mobileMenuButton) {
    mobileMenuButton.addEventListener('click', () => toggleMobileMenu());
}

const showPage = (pageId) => {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.remove('active');
    });

    const target = document.getElementById(pageId);
    if (target) {
        target.classList.add('active');
    }

    // Load orders
    if (pageId === "profile-page") {
        loadOrderHistory();
    }

    window.scrollTo(0, 0);
};


const showProductDetail = (productId) => {
    const product = products[productId];
    if (product) {
        showMessage(
            'Product Details',
            `Details for ${product.name} - Price: $${product.price.toFixed(2)}. This would link to a full product page in a real store.`
        );
    }
};

const showMessage = (title, text, event) => {
    if (event) event.preventDefault();
    const titleEl = document.getElementById('message-title');
    const textEl = document.getElementById('message-text');
    const box = document.getElementById('message-box');

    if (!titleEl || !textEl || !box) return;

    titleEl.textContent = title;
    textEl.textContent = text;
    box.classList.remove('hidden');
    box.classList.add('flex');
};

// ⭐ LOAD ORDER HISTORY INTO PROFILE PAGE
function loadOrderHistory() {
    const container = document.querySelector("#profile-page .order-history-container");
    if (!container) return;

    let orders = JSON.parse(localStorage.getItem("orders") || "[]");

    if (orders.length === 0) {
        container.innerHTML = `
            <p class="text-gray-400 text-center italic">No orders yet.</p>
        `;
        return;
    }

    container.innerHTML = "";

    orders.forEach(order => {
        const itemsText = order.items
            .map(i => `${i.name} (x${i.quantity})`)
            .join(", ");

        const html = `
            <div class="bg-gray-800 p-4 rounded-lg border-l-4 border-cyan-500">
                <div class="flex justify-between mb-2">
                    <span class="text-sm font-medium text-gray-400">Order #${order.id}</span>
                    <span class="text-sm font-semibold text-green-400">${order.status}</span>
                </div>
                <div class="flex justify-between text-white">
                    <span class="font-bold">$${order.total}</span>
                    <span class="text-xs text-gray-500">Placed: ${order.date}</span>
                </div>
                <p class="text-xs text-gray-500 mt-2">Items: ${itemsText}</p>
            </div>
        `;

        container.insertAdjacentHTML("beforeend", html);
    });
}
