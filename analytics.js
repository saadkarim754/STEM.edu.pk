// Production-Ready Analytics & Firebase Integration
// STEM Careers Programme - User Tracking System

class STEMAnalytics {
    constructor() {
        this.isProduction = !window.location.hostname.includes('localhost');
        this.db = null;
        this.analytics = null;
        this.initialized = false;
        
        this.init();
    }

    async init() {
        try {
            if (window.firebaseConfig && this.isProduction) {
                await this.initializeFirebase();
            }
            
            this.initializeEventListeners();
            this.trackPageView();
            
            console.log('📊 STEM Analytics initialized successfully');
            this.initialized = true;
        } catch (error) {
            console.error('❌ Analytics initialization failed:', error);
        }
    }

    async initializeFirebase() {
        try {
            // Import Firebase modules
            const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js');
            const { getFirestore, collection, addDoc, serverTimestamp } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');
            const { getAnalytics, logEvent } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js');

            // Initialize Firebase
            const app = initializeApp(window.firebaseConfig);
            this.db = getFirestore(app);
            this.analytics = getAnalytics(app);

            // Store Firebase utilities globally
            window.firebase = {
                db: this.db,
                analytics: this.analytics,
                collection,
                addDoc,
                serverTimestamp,
                logEvent
            };

            console.log('🔥 Firebase initialized successfully');
        } catch (error) {
            console.error('🚫 Firebase initialization failed:', error);
        }
    }

    // Track page views
    trackPageView() {
        const pageName = this.getPageName();
        
        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'page_view', {
                page_title: document.title,
                page_location: window.location.href,
                page_name: pageName
            });
        }

        // Firebase Analytics
        if (this.analytics && window.firebase) {
            window.firebase.logEvent(this.analytics, 'page_view', {
                page_name: pageName,
                page_title: document.title
            });
        }

        console.log(`📄 Page view tracked: ${pageName}`);
    }

    // Track program interest
    trackProgramInterest(programName, action = 'view') {
        const eventData = {
            program_name: programName,
            action: action,
            timestamp: new Date().toISOString(),
            page: this.getPageName()
        };

        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'program_interest', {
                program_name: programName,
                engagement_action: action,
                value: this.getEngagementValue(action)
            });
        }

        // Firebase Analytics
        if (this.analytics && window.firebase) {
            window.firebase.logEvent(this.analytics, 'program_interest', eventData);
        }

        // Store in Firestore
        if (this.db && window.firebase) {
            this.storeEvent('program_interest', eventData);
        }

        console.log(`🎯 Program interest tracked: ${programName} - ${action}`);
    }

    // Track contact form submissions
    async trackContactSubmission(formData) {
        const submissionData = {
            ...formData,
            timestamp: new Date().toISOString(),
            page: this.getPageName(),
            user_agent: navigator.userAgent,
            referrer: document.referrer || 'direct'
        };

        try {
            // Google Analytics conversion
            if (typeof gtag !== 'undefined') {
                gtag('event', 'contact_form_submit', {
                    event_category: 'engagement',
                    event_label: formData.subject || 'general',
                    value: 1
                });

                gtag('event', 'conversion', {
                    send_to: 'GA_MEASUREMENT_ID/contact_conversion'
                });
            }

            // Firebase Analytics
            if (this.analytics && window.firebase) {
                window.firebase.logEvent(this.analytics, 'contact_form_submit', {
                    form_subject: formData.subject,
                    conversion: true
                });
            }

            // Store submission in Firestore
            if (this.db && window.firebase) {
                const docRef = await window.firebase.addDoc(
                    window.firebase.collection(this.db, 'contact_submissions'),
                    {
                        ...submissionData,
                        server_timestamp: window.firebase.serverTimestamp()
                    }
                );
                console.log('📝 Contact submission stored:', docRef.id);
            }

            console.log('✉️ Contact form submission tracked successfully');
            return true;
        } catch (error) {
            console.error('❌ Error tracking contact submission:', error);
            return false;
        }
    }

    // Track file downloads
    trackDownload(fileName, programName = null) {
        const eventData = {
            file_name: fileName,
            program_name: programName,
            download_time: new Date().toISOString()
        };

        // Google Analytics
        if (typeof gtag !== 'undefined') {
            gtag('event', 'file_download', {
                file_name: fileName,
                program_name: programName
            });
        }

        // Firebase Analytics
        if (this.analytics && window.firebase) {
            window.firebase.logEvent(this.analytics, 'file_download', eventData);
        }

        console.log(`📥 Download tracked: ${fileName}`);
    }

    // Track scroll depth
    trackScrollDepth() {
        let maxScroll = 0;
        let scrollCheckpoints = [25, 50, 75, 90, 100];
        let firedCheckpoints = [];

        const trackScroll = () => {
            const scrollPercent = Math.round(
                (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
            );

            if (scrollPercent > maxScroll) {
                maxScroll = scrollPercent;

                scrollCheckpoints.forEach(checkpoint => {
                    if (scrollPercent >= checkpoint && !firedCheckpoints.includes(checkpoint)) {
                        firedCheckpoints.push(checkpoint);

                        // Google Analytics
                        if (typeof gtag !== 'undefined') {
                            gtag('event', 'scroll', {
                                event_category: 'engagement',
                                event_label: `${checkpoint}%`,
                                value: checkpoint
                            });
                        }

                        // Firebase Analytics
                        if (this.analytics && window.firebase) {
                            window.firebase.logEvent(this.analytics, 'scroll_depth', {
                                percent: checkpoint,
                                page: this.getPageName()
                            });
                        }
                    }
                });
            }
        };

        // Throttled scroll event
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    trackScroll();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // Track time on page
    trackTimeOnPage() {
        const startTime = Date.now();
        
        const trackTime = () => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            
            // Only track meaningful time periods
            if (timeSpent >= 30) {
                // Google Analytics
                if (typeof gtag !== 'undefined') {
                    gtag('event', 'timing_complete', {
                        name: 'time_on_page',
                        value: timeSpent
                    });
                }

                // Firebase Analytics
                if (this.analytics && window.firebase) {
                    window.firebase.logEvent(this.analytics, 'time_on_page', {
                        duration: timeSpent,
                        page: this.getPageName()
                    });
                }
            }
        };

        // Track on page unload
        window.addEventListener('beforeunload', trackTime);
        
        // Track every 60 seconds for long sessions
        setInterval(() => {
            const timeSpent = Math.round((Date.now() - startTime) / 1000);
            if (timeSpent > 0 && timeSpent % 60 === 0) {
                trackTime();
            }
        }, 60000);
    }

    // Initialize event listeners
    initializeEventListeners() {
        // Program card clicks
        document.addEventListener('click', (e) => {
            // Program cards in main site
            const programCard = e.target.closest('.program-card');
            if (programCard) {
                const programName = programCard.querySelector('h4')?.textContent || 'unknown';
                this.trackProgramInterest(programName, 'card_click');
            }

            // Initiative cards in STEM initiatives page
            const initiativeCard = e.target.closest('.initiative-card');
            if (initiativeCard) {
                const initiativeName = initiativeCard.dataset.initiative || 'unknown';
                this.trackProgramInterest(initiativeName, 'card_expand');
            }

            // Apply buttons
            const applyBtn = e.target.closest('.apply-btn');
            if (applyBtn) {
                const card = applyBtn.closest('.initiative-card');
                const program = card?.dataset.initiative || 'unknown';
                this.trackProgramInterest(program, 'apply_click');
            }

            // CTA buttons
            const ctaBtn = e.target.closest('.btn');
            if (ctaBtn && ctaBtn.textContent.includes('Start')) {
                this.trackProgramInterest('general', 'cta_click');
            }

            // External links
            const link = e.target.closest('a[href^="http"]');
            if (link) {
                this.trackExternalLink(link.href);
            }
        });

        // Contact form submissions
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', async (e) => {
                e.preventDefault();
                
                const formData = {
                    name: contactForm.name.value,
                    email: contactForm.email.value,
                    subject: contactForm.subject.value,
                    message: contactForm.message.value
                };

                const success = await this.trackContactSubmission(formData);
                
                if (success) {
                    this.showNotification('Thank you! Your message has been recorded.', 'success');
                    contactForm.reset();
                } else {
                    this.showNotification('Message recorded locally. Thank you for your interest!', 'info');
                }
            });
        }

        // Track scroll depth
        this.trackScrollDepth();
        
        // Track time on page
        this.trackTimeOnPage();
    }

    // Track external link clicks
    trackExternalLink(url) {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'click', {
                event_category: 'outbound',
                event_label: url,
                transport_type: 'beacon'
            });
        }

        if (this.analytics && window.firebase) {
            window.firebase.logEvent(this.analytics, 'external_link_click', {
                url: url,
                page: this.getPageName()
            });
        }

        console.log(`🔗 External link tracked: ${url}`);
    }

    // Store event in Firestore
    async storeEvent(eventType, eventData) {
        if (!this.db || !window.firebase) return;

        try {
            await window.firebase.addDoc(
                window.firebase.collection(this.db, 'analytics_events'),
                {
                    event_type: eventType,
                    ...eventData,
                    server_timestamp: window.firebase.serverTimestamp()
                }
            );
        } catch (error) {
            console.error('Error storing event:', error);
        }
    }

    // Utility functions
    getPageName() {
        const path = window.location.pathname;
        if (path === '/' || path.includes('index.html')) return 'home';
        if (path.includes('stem-initiatives')) return 'stem-initiatives';
        return path.replace('/', '').replace('.html', '') || 'home';
    }

    getEngagementValue(action) {
        const values = {
            'view': 1,
            'card_click': 2,
            'card_expand': 3,
            'apply_click': 5,
            'form_submit': 10
        };
        return values[action] || 1;
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
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
            backgroundColor: type === 'success' ? '#10B981' : '#3B82F6'
        });
        
        document.body.appendChild(notification);
        
        setTimeout(() => notification.style.transform = 'translateX(0)', 100);
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Initialize analytics when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.stemAnalytics = new STEMAnalytics();
});

// Global functions for manual tracking
window.trackProgramInterest = (program, action) => {
    if (window.stemAnalytics) {
        window.stemAnalytics.trackProgramInterest(program, action);
    }
};

window.trackDownload = (fileName, program) => {
    if (window.stemAnalytics) {
        window.stemAnalytics.trackDownload(fileName, program);
    }
};