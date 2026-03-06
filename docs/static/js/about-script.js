// Smooth scroll behavior for navigation
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        if (this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
        }
    });
});

// Active navigation state
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', function() {
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// Cart icon interaction
const cartIcon = document.querySelector('.cart-icon');

cartIcon.addEventListener('click', function() {
    this.style.animation = 'cart-bounce 0.5s ease';
    setTimeout(() => {
        this.style.animation = '';
    }, 500);
    console.log('Cart clicked!');
});

// Add cart bounce animation
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

// Scroll animations for content
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Apply fade-in animation to elements
window.addEventListener('load', () => {
    const animatedElements = [
        document.querySelector('.section-title'),
        document.querySelector('.intro-text'),
        document.querySelector('.description-box'),
        document.querySelector('.image-card')
    ];

    animatedElements.forEach((el, index) => {
        if (el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = `all 0.6s ease ${index * 0.1}s`;
            fadeInObserver.observe(el);
        }
    });
});

// Floating animation for clouds
const clouds = document.querySelectorAll('.cloud-decor');

clouds.forEach((cloud, index) => {
    const floatAnimation = `float-${index}`;
    const keyframes = `
        @keyframes ${floatAnimation} {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-${10 + index * 5}px); }
        }
    `;
    
    const style = document.createElement('style');
    style.textContent = keyframes;
    document.head.appendChild(style);
    
    cloud.style.animation = `${floatAnimation} ${3 + index}s ease-in-out infinite`;
});

// Parallax effect for flower decorations
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const flowerLeft = document.querySelector('.flower-left');
    const flowerRight = document.querySelector('.flower-right');
    
    if (flowerLeft) {
        flowerLeft.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
    
    if (flowerRight) {
        flowerRight.style.transform = `translateY(${-scrolled * 0.1}px)`;
    }
});

// Features list animation on scroll
const featureItems = document.querySelectorAll('.features-list li');

const featureObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateX(0)';
            }, index * 100);
        }
    });
}, observerOptions);

featureItems.forEach(item => {
    item.style.opacity = '0';
    item.style.transform = 'translateX(-20px)';
    item.style.transition = 'all 0.5s ease';
    featureObserver.observe(item);
});

// Image card tilt effect on mouse move
const imageCard = document.querySelector('.image-card');

if (imageCard) {
    imageCard.addEventListener('mousemove', (e) => {
        const rect = imageCard.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        imageCard.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
    
    imageCard.addEventListener('mouseleave', () => {
        imageCard.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) rotate(-2deg)';
    });
}

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

console.log('Why Choose KRES page loaded successfully!');