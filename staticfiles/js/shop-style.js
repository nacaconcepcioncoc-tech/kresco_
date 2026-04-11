// Navigation interactions
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
        }
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// Cart icon animation
const cartIcon = document.querySelector('.cart-icon');
cartIcon.addEventListener('click', function() {
    this.style.animation = 'cart-bounce 0.5s ease';
    setTimeout(() => this.style.animation = '', 500);
    console.log('Cart clicked!');
});

const cartStyle = document.createElement('style');
cartStyle.textContent = `
    @keyframes cart-bounce {
        0%, 100% { transform: scale(1); }
        25% { transform: scale(1.2); }
        50% { transform: scale(0.9); }
        75% { transform: scale(1.1); }
    }
`;
document.head.appendChild(cartStyle);

// Search functionality
const searchInput = document.querySelector('.search-input');
const productItems = document.querySelectorAll('.product-item');

searchInput.addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    
    productItems.forEach(item => {
        const productName = item.querySelector('.product-name').textContent.toLowerCase();
        
        if (productName.includes(searchTerm)) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
});

// Filter functionality
const filterButtons = document.querySelectorAll('.filter-btn');

filterButtons.forEach(button => {
    button.addEventListener('click', function() {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        const filter = this.getAttribute('data-filter');
        console.log(`Filter selected: ${filter}`);
        
        // Filter products (currently all are bouquets)
        productItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            if (filter === 'bouquets' || category === filter) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
});

// Add to cart functionality
const addToCartButtons = document.querySelectorAll('.add-to-cart-btn');

addToCartButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        
        const productItem = this.closest('.product-item');
        const productName = productItem.querySelector('.product-name').textContent;
        const productPrice = productItem.querySelector('.product-price').textContent;
        
        console.log(`Added to cart: ${productName} - ${productPrice}`);
        
        // Button animation
        const originalText = this.textContent;
        this.textContent = 'Added!';
        this.style.background = '#4caf50';
        
        setTimeout(() => {
            this.textContent = originalText;
            this.style.background = '';
        }, 1500);
        
        // Animate cart icon
        cartIcon.style.animation = 'cart-bounce 0.5s ease';
        setTimeout(() => cartIcon.style.animation = '', 500);
    });
});

// Pagination functionality
const pageButtons = document.querySelectorAll('.page-number');
const prevButton = document.querySelector('.prev-btn');
const nextButton = document.querySelector('.next-btn');
let currentPage = 1;

pageButtons.forEach(button => {
    button.addEventListener('click', function() {
        pageButtons.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        currentPage = parseInt(this.textContent);
        console.log(`Page ${currentPage} selected`);
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
});

prevButton.addEventListener('click', function() {
    if (currentPage > 1) {
        currentPage--;
        updateActivePage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

nextButton.addEventListener('click', function() {
    if (currentPage < pageButtons.length) {
        currentPage++;
        updateActivePage();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});

function updateActivePage() {
    pageButtons.forEach((btn, index) => {
        btn.classList.remove('active');
        if (index + 1 === currentPage) {
            btn.classList.add('active');
        }
    });
}

// Chat button functionality
const chatButton = document.querySelector('.chat-button');

chatButton.addEventListener('click', function() {
    console.log('Chat opened');
    this.style.animation = 'pulse 0.5s ease';
    setTimeout(() => this.style.animation = '', 500);
    
    // You can add chat widget opening logic here
    alert('Chat feature coming soon!');
});

const chatStyle = document.createElement('style');
chatStyle.textContent = `
    @keyframes pulse {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.15); }
    }
`;
document.head.appendChild(chatStyle);

// Product items fade-in animation
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const productObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

window.addEventListener('load', () => {
    productItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(30px)';
        item.style.transition = `all 0.6s ease ${index * 0.05}s`;
        productObserver.observe(item);
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll > 50) {
        navbar.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
    } else {
        navbar.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
    }
    
    lastScroll = currentScroll;
});

// Page load fade-in
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

console.log('Shop page loaded successfully!');