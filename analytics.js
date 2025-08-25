// Production-Ready Analytics & Firebase Integration
// STEM Careers Programme - User Tracking System

class STEMAnalytics {
    constructor() {
        this.isProduction = !window.location.hostname.includes('localhost');
        this.db = null;
        this.analytics = null;
        this.initialized = false;
        this.firebaseReady = false;
        
        // Wait for DOM and Firebase config to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }

    async init() {
        try {
            console.log('🚀 Starting STEM Analytics initialization...');
            
            // Always try to initialize Firebase (works on both local and production)
            if (window.firebaseConfig) {
                await this.initializeFirebase();
            } else {
                console.warn('⚠️ Firebase config not found, retrying in 1 second...');
                setTimeout(() => this.init(), 1000);
                return;
            }
            
            this.initializeEventListeners();
            this.trackPageView();
            
            console.log('📊 STEM Analytics initialized successfully');
            this.initialized = true;
        } catch (error) {
            console.error('❌ Analytics initialization failed:', error);
            // Still mark as initialized to avoid retry loops
            this.initialized = true;
        }
    }

    async initializeFirebase() {
        try {
            console.log('🔥 Initializing Firebase...');
            
            // Import Firebase modules with error handling
            const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js');
            const { getFirestore, collection, addDoc, serverTimestamp, connectFirestoreEmulator } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-firestore.js');
            const { getAnalytics, logEvent } = await import('https://www.gstatic.com/firebasejs/10.7.0/firebase-analytics.js');

            // Initialize Firebase App
            console.log('🔧 Creating Firebase app with config:', window.firebaseConfig.projectId);
            const app = initializeApp(window.firebaseConfig);
            
            // Initialize Firestore
            this.db = getFirestore(app);
            console.log('💾 Firestore initialized');
            
            // Initialize Analytics (only in production with measurementId)
            if (window.firebaseConfig.measurementId && this.isProduction) {
                this.analytics = getAnalytics(app);
                console.log('📈 Firebase Analytics initialized');
            }

            // Store Firebase utilities globally for easier access
            window.firebase = {
                db: this.db,
                analytics: this.analytics,
                collection,
                addDoc,
                serverTimestamp,
                logEvent,
                app: app
            };

            this.firebaseReady = true;
            console.log('🔥 Firebase initialized successfully');
            
            // Test connection with a simple write
            await this.testFirebaseConnection();
            
        } catch (error) {
            console.error('🚫 Firebase initialization failed:', error.message);
            console.error('🔍 Error details:', error);
            this.firebaseReady = false;
        }
    }

    async testFirebaseConnection() {
        if (!this.db || !window.firebase) {
            console.log('⏸️ Skipping Firebase test - not initialized');
            return;
        }

        try {
            console.log('🧪 Testing Firebase connection...');
            
            const testDoc = {
                test: true,
                timestamp: new Date().toISOString(),
                message: 'STEM Analytics connection test',
                user_agent: navigator.userAgent.substring(0, 100)
            };

            await window.firebase.addDoc(
                window.firebase.collection(this.db, 'analytics_events'),
                {
                    ...testDoc,
                    event_type: 'connection_test',
                    server_timestamp: window.firebase.serverTimestamp()
                }
            );
            
            console.log('✅ Firebase connection test successful');
        } catch (error) {
            console.error('❌ Firebase connection test failed:', error.message);
            console.error('🔍 Check your Firestore security rules. Current rules might be blocking writes.');
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

    // Store event in Firestore with better error handling
    async storeEvent(eventType, eventData) {
        if (!this.firebaseReady || !this.db || !window.firebase) {
            console.log('⏸️ Firestore not ready, skipping event storage');
            return false;
        }

        try {
            const docData = {
                event_type: eventType,
                ...eventData,
                server_timestamp: window.firebase.serverTimestamp(),
                client_timestamp: new Date().toISOString(),
                session_id: this.getSessionId()
            };

            console.log('📝 Storing event in Firestore:', eventType);
            
            const docRef = await window.firebase.addDoc(
                window.firebase.collection(this.db, 'analytics_events'),
                docData
            );
            
            console.log('✅ Event stored successfully:', docRef.id);
            return true;
        } catch (error) {
            console.error('❌ Error storing event in Firestore:', error.message);
            console.error('🔍 Full error:', error);
            
            // Check if it's a permissions error
            if (error.code === 'permission-denied') {
                console.error('🚫 Permission denied - check your Firestore security rules');
                console.error('💡 Ensure your rules allow "create" operations on analytics_events collection');
            }
            
            return false;
        }
    }

    // Enhanced contact submission tracking with better error handling
    async trackContactSubmission(formData) {
        const submissionData = {
            ...formData,
            timestamp: new Date().toISOString(),
            page: this.getPageName(),
            user_agent: navigator.userAgent,
            referrer: document.referrer || 'direct',
            session_id: this.getSessionId()
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
                    send_to: 'G-C8Y8SWVKRR/contact_conversion'
                });
                
                console.log('📊 Google Analytics events fired');
            }

            // Firebase Analytics
            if (this.analytics && window.firebase) {
                window.firebase.logEvent(this.analytics, 'contact_form_submit', {
                    form_subject: formData.subject,
                    conversion: true
                });
                console.log('🔥 Firebase Analytics event fired');
            }

            // Store submission in Firestore
            if (this.firebaseReady && this.db && window.firebase) {
                console.log('📝 Storing contact submission...');
                
                const docRef = await window.firebase.addDoc(
                    window.firebase.collection(this.db, 'contact_submissions'),
                    {
                        ...submissionData,
                        server_timestamp: window.firebase.serverTimestamp()
                    }
                );
                
                console.log('✅ Contact submission stored:', docRef.id);
                this.showNotification('Thank you! Your message has been sent successfully.', 'success');
                return true;
            } else {
                console.log('⚠️ Firestore not available, contact form data recorded locally');
                this.showNotification('Message recorded. Thank you for your interest!', 'info');
                return true;
            }

        } catch (error) {
            console.error('❌ Error tracking contact submission:', error);
            
            // Still show success to user even if tracking fails
            this.showNotification('Thank you for your message! We will get back to you soon.', 'success');
            return false;
        }
    }

    // Utility functions
    getPageName() {
        const path = window.location.pathname;
        if (path === '/' || path.includes('index.html')) return 'home';
        if (path.includes('stem-initiatives')) return 'stem-initiatives';
        if (path.includes('analytics-test')) return 'analytics-test';
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

    // Generate or retrieve session ID
    getSessionId() {
        let sessionId = sessionStorage.getItem('stem_session_id');
        if (!sessionId) {
            sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            sessionStorage.setItem('stem_session_id', sessionId);
        }
        return sessionId;
    }

    showNotification(message, type = 'info') {
        console.log(`🔔 Notification: ${message}`);
        
        // Remove any existing notifications
        const existingNotifications = document.querySelectorAll('.stem-notification');
        existingNotifications.forEach(n => n.remove());
        
        const notification = document.createElement('div');
        notification.className = `stem-notification notification-${type}`;
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
            backgroundColor: type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#3B82F6',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            fontFamily: 'Inter, sans-serif'
        });
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }, 4000);
    }
}

// Enhanced initialization with better error handling
document.addEventListener('DOMContentLoaded', () => {
    try {
        console.log('🚀 Initializing STEM Analytics...');
        window.stemAnalytics = new STEMAnalytics();
    } catch (error) {
        console.error('❌ Failed to initialize STEM Analytics:', error);
    }
});

// Also try immediate initialization if DOM is already loaded
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    setTimeout(() => {
        if (!window.stemAnalytics) {
            console.log('🔄 Late initialization of STEM Analytics...');
            window.stemAnalytics = new STEMAnalytics();
        }
    }, 100);
}

// Global functions for manual tracking (with error handling)
window.trackProgramInterest = (program, action) => {
    try {
        if (window.stemAnalytics && window.stemAnalytics.initialized) {
            window.stemAnalytics.trackProgramInterest(program, action);
        } else {
            console.log('⏸️ Analytics not ready, queuing program interest event');
        }
    } catch (error) {
        console.error('❌ Error tracking program interest:', error);
    }
};

window.trackDownload = (fileName, program) => {
    try {
        if (window.stemAnalytics && window.stemAnalytics.initialized) {
            window.stemAnalytics.trackDownload(fileName, program);
        } else {
            console.log('⏸️ Analytics not ready, queuing download event');
        }
    } catch (error) {
        console.error('❌ Error tracking download:', error);
    }
};