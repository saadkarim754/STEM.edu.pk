/**
 * Firebase Configuration Template
 * STEM Careers Programme - Production Setup
 * 
 * INSTRUCTIONS:
 * 1. Create Firebase project at https://console.firebase.google.com/
 * 2. Create GA4 property at https://analytics.google.com/  
 * 3. Replace the placeholder values below with your actual credentials
 * 4. Copy this configuration to both index.html and stem-initiatives.html
 */

// 🔥 FIREBASE CONFIGURATION (Replace with your values)
const firebaseConfig = {
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",           // From Firebase Console > Project Settings
    authDomain: "your-project-id.firebaseapp.com",             // Replace 'your-project-id'
    projectId: "your-project-id",                               // Your Firebase Project ID
    storageBucket: "your-project-id.appspot.com",              // Replace 'your-project-id'
    messagingSenderId: "123456789012",                          // From Firebase Console
    appId: "1:123456789012:web:abcdef1234567890",              // From Firebase Console
    measurementId: "G-XXXXXXXXXX"                              // From Google Analytics 4
};

// 📊 GOOGLE ANALYTICS CONFIGURATION
const GA4_MEASUREMENT_ID = "G-XXXXXXXXXX";  // Replace with your GA4 Measurement ID

// 🎯 TRACKING EVENTS REFERENCE
const TRACKED_EVENTS = {
    // Automatic Events:
    page_view: "Tracks when users visit pages",
    scroll_depth: "Tracks 25%, 50%, 75%, 90%, 100% scroll milestones", 
    time_on_page: "Tracks meaningful engagement time (30+ seconds)",
    external_link_click: "Tracks clicks on external links",
    
    // Program Interest Events:
    program_interest: "Tracks interaction with program cards",
    // - Actions: 'view', 'card_click', 'card_expand', 'apply_click'
    
    // Conversion Events:
    contact_form_submit: "High-value conversion - contact form submissions",
    file_download: "Tracks document/resource downloads",
    
    // Custom Events:
    cta_click: "Call-to-action button clicks",
    navigation: "Menu and navigation interactions"
};

// 🔒 FIRESTORE COLLECTIONS
const FIRESTORE_COLLECTIONS = {
    analytics_events: "Stores all user interaction events with timestamps",
    contact_submissions: "Stores contact form submissions securely"
};

// 📱 SETUP CHECKLIST
const SETUP_STEPS = [
    "✅ Create Firebase project with Analytics enabled",
    "✅ Set up Firestore Database with security rules", 
    "✅ Create GA4 property and get measurement ID",
    "✅ Add web app to Firebase and get config",
    "✅ Replace placeholder values in this file",
    "✅ Update configuration in HTML files",
    "✅ Deploy to GitHub Pages",
    "✅ Test analytics in browser console",
    "✅ Verify data in GA4 Real-time reports",
    "✅ Check Firestore for incoming events"
];

// 🎯 CONVERSION GOALS TO SET UP IN GA4
const CONVERSION_EVENTS = [
    "contact_form_submit",
    "program_interest", 
    "file_download"
];

/**
 * 🚀 QUICK START:
 * 
 * 1. Follow FIREBASE_SETUP_GUIDE.md for detailed instructions
 * 2. Replace placeholder values above with your actual credentials
 * 3. Copy the firebaseConfig object to your HTML files
 * 4. Update GA4_MEASUREMENT_ID in gtag configuration
 * 5. Deploy and test!
 * 
 * 📊 MONITORING:
 * - Real-time data: GA4 > Reports > Realtime  
 * - Event logs: Firebase Console > Firestore Database
 * - Browser console: Look for "📊 STEM Analytics initialized successfully"
 */