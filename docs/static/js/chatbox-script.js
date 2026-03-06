// Bot responses based on keywords
const getBotResponses = {
    greeting: [
        "Hello! Welcome to KRES PRESENTS. How can I help you today?",
        "Hi there! 🌸 What can we help you with?",
        "Welcome! Ask us anything about our flowers and services!"
    ],
    flowers: [
        "We have a beautiful selection of fresh flowers! Would you like to know about specific types?",
        "Our flower selection includes roses, tulips, sunflowers, orchids, and many more! What's your favorite?",
        "We offer premium quality flowers. Would you like recommendations?"
    ],
    delivery: [
        "We offer same-day delivery for orders placed before 2 PM. Delivery fee is PHP 100-300 depending on location.",
        "Delivery is available within Metro Manila. Rush delivery available for an additional fee.",
        "Free delivery for orders over PHP 2,000! Standard delivery is PHP 150."
    ],
    price: [
        "Our prices range from PHP 500 to PHP 5,000+ depending on the arrangement. What's your budget?",
        "We have options for every budget! From PHP 500 starter bouquets to premium arrangements.",
        "Pricing varies based on flower type and arrangement complexity. Would you like a specific suggestion?"
    ],
    custom: [
        "Absolutely! We specialize in custom arrangements. Just tell us your vision and budget!",
        "Yes, we can customize anything! What colors and flowers are you interested in?",
        "Custom arrangements are our specialty! What's the occasion?"
    ],
    advance: [
        "Yes, we accept advance orders! Book now for future dates.",
        "Advance orders welcome! Just let us know your preferred date.",
        "We take advance orders for all occasions. When do you need them?"
    ],
    walk_in: [
        "Yes, we welcome walk-ins! Visit us at our shop location.",
        "Walk-ins are welcome! We're open daily from 9 AM to 6 PM.",
        "Of course! Stop by our store whenever you're ready!"
    ]
};

function getBotResponse(userMessage) {
    const msg = userMessage.toLowerCase();

    if (msg.includes('hi') || msg.includes('hello') || msg.includes('hey')) {
        return getBotResponses.greeting[Math.floor(Math.random() * getBotResponses.greeting.length)];
    } else if (msg.includes('flower') || msg.includes('bouquet') || msg.includes('arrangement')) {
        return getBotResponses.flowers[Math.floor(Math.random() * getBotResponses.flowers.length)];
    } else if (msg.includes('delivery') || msg.includes('ship') || msg.includes('send')) {
        return getBotResponses.delivery[Math.floor(Math.random() * getBotResponses.delivery.length)];
    } else if (msg.includes('price') || msg.includes('cost') || msg.includes('how much')) {
        return getBotResponses.price[Math.floor(Math.random() * getBotResponses.price.length)];
    } else if (msg.includes('custom') || msg.includes('personalize') || msg.includes('design')) {
        return getBotResponses.custom[Math.floor(Math.random() * getBotResponses.custom.length)];
    } else if (msg.includes('advance') || msg.includes('future') || msg.includes('booking')) {
        return getBotResponses.advance[Math.floor(Math.random() * getBotResponses.advance.length)];
    } else if (msg.includes('walk-in') || msg.includes('visit') || msg.includes('store')) {
        return getBotResponses.walk_in[Math.floor(Math.random() * getBotResponses.walk_in.length)];
    } else {
        return "Thank you for your message! For more detailed information, please feel free to call us or visit our store. We're here to help! 🌺";
    }
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const messageText = messageInput.value.trim();

    if (messageText === '') return;

    // Remove welcome message if it exists
    const welcomeMsg = document.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }

    addMessage(messageText, 'user');
    messageInput.value = '';

    setTimeout(() => {
        const botResponse = getBotResponse(messageText);
        addMessage(botResponse, 'bot');
    }, 500);
}

function addMessage(message, sender) {
    const messagesContainer = document.getElementById('messagesContainer');
    const messageDiv = document.createElement('div');
    messageDiv.className = 'message ' + sender + '-message';

    const messageBubble = document.createElement('div');
    messageBubble.className = 'message-bubble';
    messageBubble.textContent = message;

    messageDiv.appendChild(messageBubble);
    messagesContainer.appendChild(messageDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function sendQuickReply(message) {
    // Remove welcome message if it exists
    const welcomeMsg = document.querySelector('.welcome-message');
    if (welcomeMsg) {
        welcomeMsg.remove();
    }

    addMessage(message, 'user');

    setTimeout(() => {
        const botResponse = getBotResponse(message);
        addMessage(botResponse, 'bot');
    }, 500);
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
    const messageInput = document.getElementById('messageInput');
    const sendBtn = document.getElementById('sendBtn');
    const closeBtn = document.getElementById('closeBtn');

    sendBtn.addEventListener('click', sendMessage);
    messageInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendMessage();
        }
    });

    // Close button
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            window.history.back();
        });
    }
});
