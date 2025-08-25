// STEM Initiatives Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all components
    initializeInitiativeCards();
    
    console.log('🎯 STEM Initiatives page loaded successfully!');
});

// Initiative Cards Manager
function initializeInitiativeCards() {
    const cards = document.querySelectorAll('.initiative-card');
    const isMobile = window.innerWidth <= 768;
    
    cards.forEach(card => {
        // Add click event listener
        card.addEventListener('click', function(e) {
            e.preventDefault();
            handleCardInteraction(card);
        });
        
        // Add keyboard support
        card.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleCardInteraction(card);
            }
        });
        
        // Add tabindex for keyboard navigation
        card.setAttribute('tabindex', '0');
        
        // Add close button to expanded content
        addCloseButton(card);
    });
    
    // Handle window resize
    window.addEventListener('resize', function() {
        const newIsMobile = window.innerWidth <= 768;
        if (newIsMobile !== isMobile) {
            // Reset all cards when switching between mobile/desktop
            cards.forEach(card => {
                closeCard(card);
            });
        }
    });
}

function handleCardInteraction(card) {
    const isExpanded = card.classList.contains('expanded');
    const isMobile = window.innerWidth <= 768;
    
    if (isExpanded) {
        closeCard(card);
    } else {
        // Close any other expanded cards first
        document.querySelectorAll('.initiative-card.expanded').forEach(otherCard => {
            if (otherCard !== card) {
                closeCard(otherCard);
            }
        });
        
        expandCard(card, isMobile);
    }
}

function expandCard(card, isMobile = false) {
    const cardExpanded = card.querySelector('.card-expanded');
    
    // Add expanded class
    card.classList.add('expanded');
    cardExpanded.classList.add('active');
    
    // Add mobile overlay if needed
    if (isMobile) {
        createMobileOverlay();
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
        
        // Add smooth animation
        setTimeout(() => {
            card.style.transform = 'translate(-50%, -50%) scale(1)';
        }, 50);
    } else {
        // Desktop: smooth height animation
        card.style.transition = 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Scroll to card if needed
        setTimeout(() => {
            card.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'center' 
            });
        }, 200);
    }
    
    // Add animation class for content
    setTimeout(() => {
        cardExpanded.style.opacity = '1';
        cardExpanded.style.transform = 'translateY(0)';
    }, 100);
    
    console.log('Card expanded:', card.dataset.initiative);
}

function closeCard(card) {
    const cardExpanded = card.querySelector('.card-expanded');
    const isMobile = window.innerWidth <= 768;
    
    // Remove expanded classes
    card.classList.remove('expanded');
    cardExpanded.classList.remove('active');
    
    // Remove mobile overlay
    if (isMobile) {
        removeMobileOverlay();
        // Restore body scroll
        document.body.style.overflow = 'auto';
        
        // Reset card position
        card.style.transform = '';
    }
    
    // Reset animations
    cardExpanded.style.opacity = '';
    cardExpanded.style.transform = '';
    
    console.log('Card closed:', card.dataset.initiative);
}

function addCloseButton(card) {
    const cardExpanded = card.querySelector('.card-expanded');
    
    // Create close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.innerHTML = '×';
    closeBtn.setAttribute('aria-label', 'Close expanded view');
    
    // Add click event
    closeBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        closeCard(card);
    });
    
    // Add keyboard event
    closeBtn.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            e.stopPropagation();
            e.preventDefault();
            closeCard(card);
        }
    });
    
    // Insert close button
    cardExpanded.insertBefore(closeBtn, cardExpanded.firstChild);
}

function createMobileOverlay() {
    // Remove existing overlay
    removeMobileOverlay();
    
    const overlay = document.createElement('div');
    overlay.className = 'mobile-overlay active';
    
    // Add click event to close
    overlay.addEventListener('click', function() {
        document.querySelectorAll('.initiative-card.expanded').forEach(card => {
            closeCard(card);
        });
    });
    
    document.body.appendChild(overlay);
}

function removeMobileOverlay() {
    const overlay = document.querySelector('.mobile-overlay');
    if (overlay) {
        overlay.remove();
    }
}

// Handle Apply button clicks
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('apply-btn')) {
        e.preventDefault();
        e.stopPropagation();
        
        const card = e.target.closest('.initiative-card');
        const initiative = card ? card.dataset.initiative : 'unknown';
        
        handleApplyClick(initiative);
    }
});

function handleApplyClick(initiative) {
    // Create a more detailed notification
    const initiativeNames = {
        'nptc': 'National Physics Talent Contest',
        'nbtc': 'National Biology Talent Contest',
        'nctc': 'National Chemistry Talent Contest',
        'nmtc': 'National Mathematics Talent Contest',
        'nerc': 'National Engineering Robotics Contest',
        'dbfc': 'Design, Build & Fly Competition',
        'nec': 'National Engineering Competition'
    };
    
    const name = initiativeNames[initiative] || initiative.toUpperCase();
    
    // Show notification
    showNotification(`Application process initiated for ${name}!`, 'success');
    
    // In a real application, this would redirect to an application form
    console.log('Apply clicked for:', initiative);
    
    // Simulate application process
    setTimeout(() => {
        showNotification('You will be redirected to the application portal shortly...', 'info');
    }, 2000);
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    // Style the notification
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '16px 24px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: '500',
        zIndex: '10000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        fontSize: '0.9rem',
        lineHeight: '1.4',
        backgroundColor: getNotificationColor(type),
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
    });
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after delay
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 4000);
}

function getNotificationColor(type) {
    const colors = {
        'success': '#10B981',
        'error': '#EF4444',
        'info': '#3B82F6',
        'warning': '#F59E0B'
    };
    return colors[type] || colors.info;
}

// Keyboard navigation for cards
document.addEventListener('keydown', function(e) {
    // Close expanded card with Escape key
    if (e.key === 'Escape') {
        const expandedCard = document.querySelector('.initiative-card.expanded');
        if (expandedCard) {
            closeCard(expandedCard);
        }
    }
});

// Intersection Observer for card animations
function initializeScrollAnimations() {
    const cards = document.querySelectorAll('.initiative-card');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
        observer.observe(card);
    });
}

// Initialize scroll animations when page loads
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initializeScrollAnimations, 500);
});

// Handle smooth scrolling for internal links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Performance optimization: debounce resize events
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

// Optimize resize handler
const optimizedResizeHandler = debounce(() => {
    // Handle any resize-specific logic here
    console.log('Window resized');
}, 250);

window.addEventListener('resize', optimizedResizeHandler);