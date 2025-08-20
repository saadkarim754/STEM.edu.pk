// Theme Management
class ThemeManager {
    constructor() {
        this.currentPalette = localStorage.getItem('palette') || 'theme-ocean';
        this.isDark = localStorage.getItem('isDark') === 'true';
        this.palettes = ['theme-ocean', 'theme-sunset', 'theme-forest', 'theme-neon', 'theme-rose', 'theme-mono-dark'];
        this.init();
    }

    init() {
        this.applyTheme();
        this.setupButtons();
    }

    applyTheme() {
        // Remove all existing theme classes
        this.palettes.forEach(palette => {
            document.documentElement.classList.remove(palette);
        });
        
        // Apply current palette
        document.documentElement.classList.add(this.currentPalette);
        
        // Apply dark mode if enabled
        if (this.isDark) {
            document.documentElement.classList.add('dark-mode');
        } else {
            document.documentElement.classList.remove('dark-mode');
        }
        
        // Save to localStorage
        localStorage.setItem('palette', this.currentPalette);
        localStorage.setItem('isDark', this.isDark.toString());
    }

    setupButtons() {
        const themeBtn = document.getElementById('themeBtn');
        const paletteBtn = document.getElementById('paletteBtn');
        
        if (themeBtn) {
            themeBtn.addEventListener('click', () => {
                this.toggleDarkMode();
            });
        }
        
        if (paletteBtn) {
            paletteBtn.addEventListener('click', () => {
                this.cyclePalette();
            });
        }
    }

    toggleDarkMode() {
        this.isDark = !this.isDark;
        this.applyTheme();
        
        // Visual feedback
        const themeBtn = document.getElementById('themeBtn');
        if (themeBtn) {
            themeBtn.style.transform = 'rotate(180deg) scale(1.2)';
            themeBtn.textContent = this.isDark ? '🌙' : '🌞';
            setTimeout(() => {
                themeBtn.style.transform = 'rotate(0deg) scale(1)';
            }, 500);
        }
    }

    cyclePalette() {
        const currentIndex = this.palettes.indexOf(this.currentPalette);
        const nextIndex = (currentIndex + 1) % this.palettes.length;
        this.currentPalette = this.palettes[nextIndex];
        this.applyTheme();
        
        // Visual feedback
        const paletteBtn = document.getElementById('paletteBtn');
        if (paletteBtn) {
            paletteBtn.style.transform = 'rotate(360deg) scale(1.2)';
            setTimeout(() => {
                paletteBtn.style.transform = 'rotate(0deg) scale(1)';
            }, 400);
        }
        
        // Show palette name briefly
        this.showPaletteName();
    }

    showPaletteName() {
        const paletteNames = {
            'theme-ocean': 'Ocean',
            'theme-sunset': 'Sunset', 
            'theme-forest': 'Forest',
            'theme-neon': 'Neon',
            'theme-rose': 'Rose',
            'theme-mono-dark': 'Mono Dark'
        };
        
        const name = paletteNames[this.currentPalette];
        
        // Create notification
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--primary-color);
            color: var(--bg-color);
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 500;
            z-index: 10000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            box-shadow: 0 5px 15px rgba(var(--primary-color-rgb), 0.3);
        `;
        notification.textContent = `Theme: ${name}`;
        
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
        }, 2000);
    }

    setupColorToggle() {
        // Legacy method - not needed anymore
    }

    setupThemeButton() {
        // Legacy method - not needed anymore
    }

    cycleTheme() {
        // Legacy method - replaced by cyclePalette
        this.cyclePalette();
    }

    updateThemeButton() {
        // Legacy method - not needed anymore
    }
}

// Section Navigation Manager
class SectionNavigationManager {
    constructor() {
        this.sections = document.querySelectorAll('section[id]');
        this.navDots = [];
        this.currentSection = 0;
        this.isScrolling = false;
        this.init();
    }

    init() {
        if (this.sections.length === 0) {
            console.warn('No sections found for navigation');
            return;
        }
        this.createSectionNav();
        this.setupSectionScrolling();
        this.setupNavDots();
        this.markActiveSection();
    }

    createSectionNav() {
        const sectionNav = document.querySelector('.section-nav');
        if (!sectionNav) {
            console.warn('Section nav container not found');
            return;
        }

        // Clear any existing dots
        sectionNav.innerHTML = '';
        
        this.sections.forEach((section, index) => {
            const sectionId = section.getAttribute('id');
            const sectionNames = {
                'home': 'Home',
                'about': 'About', 
                'programs': 'Programs',
                'process': 'Process',
                'faq': 'FAQ',
                'partners': 'Partners',
                'contact': 'Contact'
            };
            
            const navDot = document.createElement('div');
            navDot.className = 'nav-dot';
            navDot.dataset.section = index;
            
            if (index === 0) navDot.classList.add('active');
            
            const navLabel = document.createElement('span');
            navLabel.className = 'nav-label';
            navLabel.textContent = sectionNames[sectionId] || `Section ${index + 1}`;
            
            navDot.appendChild(navLabel);
            sectionNav.appendChild(navDot);
            this.navDots.push(navDot);
        });
    }

    setupNavDots() {
        this.navDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                if (!this.isScrolling) {
                    this.scrollToSection(index);
                }
            });
        });
    }

    setupSectionScrolling() {
        const handleScroll = Utils.throttle(() => {
            if (this.isScrolling) return;
            
            let currentSectionIndex = 0;
            const scrollPosition = window.scrollY + window.innerHeight / 3;
            
            this.sections.forEach((section, index) => {
                const sectionTop = section.offsetTop;
                const sectionBottom = sectionTop + section.offsetHeight;
                
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    currentSectionIndex = index;
                }
            });
            
            if (currentSectionIndex !== this.currentSection) {
                this.updateActiveSection(currentSectionIndex);
            }
        }, 100);
        
        window.addEventListener('scroll', handleScroll);
        
        // Initial check after page loads
        setTimeout(() => handleScroll(), 500);
    }

    scrollToSection(index) {
        if (index < 0 || index >= this.sections.length) return;
        
        this.isScrolling = true;
        const section = this.sections[index];
        const offsetTop = section.offsetTop - 50; // Small offset for navbar
        
        // Add slide animation
        this.addSlideAnimation(index);
        
        // Smooth scroll with longer duration
        const startPosition = window.scrollY;
        const distance = offsetTop - startPosition;
        const duration = 1500; // 1.5 seconds for smooth scroll
        let start = null;
        
        const smoothScroll = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const ease = this.easeInOutCubic(progress / duration);
            
            window.scrollTo(0, startPosition + (distance * ease));
            
            if (progress < duration) {
                requestAnimationFrame(smoothScroll);
            } else {
                this.isScrolling = false;
                window.scrollTo(0, offsetTop);
            }
        };
        
        requestAnimationFrame(smoothScroll);
        this.updateActiveSection(index);
    }

    easeInOutCubic(t) {
        return t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1;
    }

    addSlideAnimation(index) {
        const section = this.sections[index];
        const animations = ['slide-in-up', 'slide-in-down', 'slide-in-left', 'slide-in-right'];
        const animationClass = animations[index % animations.length];
        
        section.classList.add(animationClass);
        setTimeout(() => {
            section.classList.remove(animationClass);
        }, 1500); // Match animation duration
    }

    updateActiveSection(index) {
        this.currentSection = index;
        this.markActiveSection();
    }

    markActiveSection() {
        // Update nav dots with smooth transition
        this.navDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSection);
            if (index === this.currentSection) {
                dot.style.transform = 'scale(1.3)';
                setTimeout(() => {
                    dot.style.transform = dot.classList.contains('active') ? 'scale(1.2)' : 'scale(1)';
                }, 200);
            }
        });
        
        // Update sections with smooth transition
        this.sections.forEach((section, index) => {
            const wasActive = section.classList.contains('active-section');
            section.classList.toggle('active-section', index === this.currentSection);
            
            if (index !== this.currentSection && wasActive) {
                section.classList.add('transitioning');
                setTimeout(() => section.classList.remove('transitioning'), 600);
            }
        });
    }
}

// Moving Animations Manager
class MovingAnimationsManager {
    constructor() {
        this.movingElements = [];
        this.animationPaused = false;
        this.init();
    }

    init() {
        this.createMovingElements();
        this.setupAnimationControls();
        this.setupPerformanceOptimization();
    }

    createMovingElements() {
        const container = document.querySelector('.moving-elements');
        if (!container) return;

        const elements = [
            { emoji: '🤖', class: 'robot-1' },
            { emoji: '🚗', class: 'car-1' },
            { emoji: '🚁', class: 'drone-1' },
            { emoji: '🛰️', class: 'satellite-1' },
            { emoji: '🚀', class: 'rocket-1' },
            { emoji: '💻', class: 'computer-1' }
        ];

        elements.forEach(element => {
            const movingEl = document.createElement('div');
            movingEl.className = `moving-element ${element.class}`;
            movingEl.textContent = element.emoji;
            movingEl.setAttribute('aria-hidden', 'true');
            container.appendChild(movingEl);
            this.movingElements.push(movingEl);
        });
    }

    setupAnimationControls() {
        // Pause animations when tab is not visible
        document.addEventListener('visibilitychange', () => {
            this.animationPaused = document.hidden;
            this.toggleAnimations();
        });

        // Pause animations on reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.pauseAllAnimations();
        }
    }

    toggleAnimations() {
        const playState = this.animationPaused ? 'paused' : 'running';
        this.movingElements.forEach(element => {
            element.style.animationPlayState = playState;
        });
    }

    pauseAllAnimations() {
        this.movingElements.forEach(element => {
            element.style.animationDuration = '0.01s';
        });
    }

    setupPerformanceOptimization() {
        // Optimize animations for better performance
        let isVisible = true;
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                isVisible = entry.isIntersecting;
                if (!isVisible) {
                    this.movingElements.forEach(el => {
                        el.style.animationPlayState = 'paused';
                    });
                } else if (!this.animationPaused) {
                    this.movingElements.forEach(el => {
                        el.style.animationPlayState = 'running';
                    });
                }
            });
        });

        const mainContent = document.querySelector('main');
        if (mainContent) {
            observer.observe(mainContent);
        }
    }
}

// Navigation Manager
class NavigationManager {
    constructor() {
        this.navbar = document.getElementById('navbar');
        this.mobileToggle = document.getElementById('mobileToggle');
        this.mobileMenu = document.getElementById('mobileMenu');
        this.isMenuOpen = false;
        this.init();
    }

    init() {
        this.setupScrollEffect();
        this.setupMobileMenu();
        this.setupSmoothScrolling();
        this.setupActiveNavLinks();
    }

    setupScrollEffect() {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 50) {
                this.navbar.classList.add('scrolled');
            } else {
                this.navbar.classList.remove('scrolled');
            }
            
            // Hide/show navbar on scroll
            if (currentScrollY > lastScrollY && currentScrollY > 100) {
                this.navbar.style.transform = 'translateY(-100%)';
            } else {
                this.navbar.style.transform = 'translateY(0)';
            }
            
            lastScrollY = currentScrollY;
        });
    }

    setupMobileMenu() {
        this.mobileToggle.addEventListener('click', () => {
            this.toggleMobileMenu();
        });

        // Close menu when clicking on mobile nav links
        const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', () => {
                this.closeMobileMenu();
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (this.isMenuOpen && !this.mobileMenu.contains(e.target) && !this.mobileToggle.contains(e.target)) {
                this.closeMobileMenu();
            }
        });
    }

    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        if (this.isMenuOpen) {
            this.mobileMenu.style.display = 'flex';
            this.mobileToggle.style.transform = 'rotate(90deg)';
            document.body.style.overflow = 'hidden';
        } else {
            this.closeMobileMenu();
        }
    }

    closeMobileMenu() {
        this.isMenuOpen = false;
        this.mobileMenu.style.display = 'none';
        this.mobileToggle.style.transform = 'rotate(0deg)';
        document.body.style.overflow = 'auto';
    }

    setupSmoothScrolling() {
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                if (link.getAttribute('href').startsWith('#')) {
                    e.preventDefault();
                    const targetId = link.getAttribute('href');
                    const targetSection = document.querySelector(targetId);
                    
                    if (targetSection) {
                        const offsetTop = targetSection.offsetTop - 70;
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }

    setupActiveNavLinks() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');

        window.addEventListener('scroll', () => {
            let currentSection = '';
            
            sections.forEach(section => {
                const sectionTop = section.offsetTop - 100;
                const sectionHeight = section.clientHeight;
                
                if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                    currentSection = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${currentSection}`) {
                    link.classList.add('active');
                }
            });
        });
    }
}

// Animation Manager
class AnimationManager {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }

    init() {
        this.setupScrollAnimations();
        this.setupCounterAnimations();
        this.setupParallaxEffect();
    }

    setupScrollAnimations() {
        const animateElements = document.querySelectorAll('.program-card, .timeline-item, .contact-card, .achievement-card');
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        animateElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = `all 0.6s cubic-bezier(0.4, 0, 0.2, 1) ${index * 0.1}s`;
            observer.observe(element);
        });
    }

    setupCounterAnimations() {
        const counters = document.querySelectorAll('.stat-number');
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, this.observerOptions);

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    animateCounter(element) {
        const target = parseInt(element.textContent);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;

        const updateCounter = () => {
            current += step;
            if (current < target) {
                element.textContent = Math.floor(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                element.textContent = target + '+';
            }
        };

        updateCounter();
    }

    setupParallaxEffect() {
        const floatingElements = document.querySelectorAll('.float-element');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            floatingElements.forEach((element, index) => {
                const rate = scrolled * -0.5;
                element.style.transform = `translate3d(0, ${rate}px, 0) rotate(${scrolled * 0.1}deg)`;
            });
        });
    }
}

// FAQ Manager
class FAQManager {
    constructor() {
        this.faqItems = document.querySelectorAll('.faq-item');
        this.init();
    }

    init() {
        this.setupFAQToggle();
    }

    setupFAQToggle() {
        this.faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            const answer = item.querySelector('.faq-answer');
            
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other FAQs
                this.faqItems.forEach(otherItem => {
                    if (otherItem !== item) {
                        otherItem.classList.remove('active');
                    }
                });
                
                // Toggle current FAQ
                item.classList.toggle('active');
                
                // Animate the answer
                if (!isActive) {
                    answer.style.maxHeight = answer.scrollHeight + 'px';
                } else {
                    answer.style.maxHeight = '0';
                }
            });
        });
    }
}

// Contact Form Manager
class ContactFormManager {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.init();
    }

    init() {
        if (this.form) {
            this.setupFormSubmission();
            this.setupFormValidation();
        }
    }

    setupFormSubmission() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            if (this.validateForm()) {
                this.submitForm();
            }
        });
    }

    setupFormValidation() {
        const inputs = this.form.querySelectorAll('input, select, textarea');
        
        inputs.forEach(input => {
            input.addEventListener('blur', () => {
                this.validateField(input);
            });
            
            input.addEventListener('input', () => {
                this.clearFieldError(input);
            });
        });
    }

    validateField(field) {
        const value = field.value.trim();
        let isValid = true;
        
        // Remove existing error styling
        field.classList.remove('error');
        
        // Check if field is required and empty
        if (field.hasAttribute('required') && !value) {
            isValid = false;
        }
        
        // Email validation
        if (field.type === 'email' && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                isValid = false;
            }
        }
        
        if (!isValid) {
            field.classList.add('error');
        }
        
        return isValid;
    }

    clearFieldError(field) {
        field.classList.remove('error');
    }

    validateForm() {
        const inputs = this.form.querySelectorAll('input[required], select[required], textarea[required]');
        let isFormValid = true;
        
        inputs.forEach(input => {
            if (!this.validateField(input)) {
                isFormValid = false;
            }
        });
        
        return isFormValid;
    }

    async submitForm() {
        const formData = new FormData(this.form);
        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        
        // Show loading state
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        try {
            // Simulate form submission (replace with actual endpoint)
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            // Show success message
            this.showNotification('Message sent successfully!', 'success');
            this.form.reset();
            
        } catch (error) {
            this.showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    showNotification(message, type) {
        // Create notification element
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
            backgroundColor: type === 'success' ? '#10B981' : '#EF4444'
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
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
}

// Utility Functions
class Utils {
    static debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }

    static throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    static isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

// Performance Manager
class PerformanceManager {
    constructor() {
        this.init();
    }

    init() {
        this.setupLazyLoading();
        this.optimizeAnimations();
    }

    setupLazyLoading() {
        const images = document.querySelectorAll('img[data-src]');
        
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            images.forEach(img => {
                img.src = img.dataset.src;
            });
        }
    }

    optimizeAnimations() {
        // Pause animations when tab is not visible
        document.addEventListener('visibilitychange', () => {
            const animatedElements = document.querySelectorAll('.float-element');
            
            if (document.hidden) {
                animatedElements.forEach(el => {
                    el.style.animationPlayState = 'paused';
                });
            } else {
                animatedElements.forEach(el => {
                    el.style.animationPlayState = 'running';
                });
            }
        });

        // Reduce motion for users who prefer it
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const style = document.createElement('style');
            style.textContent = `
                *, *::before, *::after {
                    animation-duration: 0.01ms !important;
                    animation-iteration-count: 1 !important;
                    transition-duration: 0.01ms !important;
                    scroll-behavior: auto !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Main App Class
class STEMWebsite {
    constructor() {
        this.init();
    }

    init() {
        // Wait for DOM to be fully loaded
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.initializeComponents();
            });
        } else {
            this.initializeComponents();
        }
    }

    initializeComponents() {
        // Initialize all components
        this.themeManager = new ThemeManager();
        this.navigationManager = new NavigationManager();
        this.animationManager = new AnimationManager();
        this.sectionNavigationManager = new SectionNavigationManager();
        this.movingAnimationsManager = new MovingAnimationsManager();
        this.faqManager = new FAQManager();
        this.contactFormManager = new ContactFormManager();
        this.performanceManager = new PerformanceManager();

        // Add loading class removal
        document.body.classList.add('loading');
        
        // Setup keyboard navigation
        this.setupKeyboardNavigation();
        
        // Setup accessibility features
        this.setupAccessibility();
        
        console.log('🚀 STEM Website with dynamic animations initialized successfully!');
    }

    setupKeyboardNavigation() {
        // Add keyboard navigation for better accessibility
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                // Close mobile menu if open
                if (this.navigationManager.isMenuOpen) {
                    this.navigationManager.closeMobileMenu();
                }
                
                // Close any open FAQs
                document.querySelectorAll('.faq-item.active').forEach(item => {
                    item.classList.remove('active');
                    item.querySelector('.faq-answer').style.maxHeight = '0';
                });
            }
        });
    }

    setupAccessibility() {
        // Add focus indicators for keyboard navigation
        const focusableElements = document.querySelectorAll(
            'a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        focusableElements.forEach(element => {
            element.addEventListener('focus', () => {
                element.style.outline = '2px solid var(--primary-color)';
                element.style.outlineOffset = '2px';
            });

            element.addEventListener('blur', () => {
                element.style.outline = 'none';
            });
        });

        // Add skip to content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Skip to main content';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            left: -9999px;
            z-index: 999;
            padding: 8px 16px;
            background: var(--primary-color);
            color: white;
            text-decoration: none;
            border-radius: 4px;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.left = '20px';
            skipLink.style.top = '20px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.left = '-9999px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
}

// Error handling
window.addEventListener('error', (event) => {
    console.error('Website Error:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled Promise Rejection:', event.reason);
    event.preventDefault();
});

// Initialize the website
const stemWebsite = new STEMWebsite();

// Add CSS for error states and notifications
const additionalStyles = document.createElement('style');
additionalStyles.textContent = `
    .error {
        border-color: #EF4444 !important;
        background-color: #FEF2F2 !important;
    }
    
    .skip-link:focus {
        position: absolute !important;
        left: 20px !important;
        top: 20px !important;
    }
    
    .notification {
        box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
    }
    
    @media (prefers-reduced-motion: reduce) {
        .float-element {
            animation: none !important;
        }
    }
`;
document.head.appendChild(additionalStyles);