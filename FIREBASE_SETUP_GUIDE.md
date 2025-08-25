# Firebase & Google Analytics Setup Guide
## STEM Careers Programme - Production Analytics Configuration

### 🚀 Prerequisites
- Google account
- Access to GitHub Pages deployment
- Administrative access to your website

---

## 📊 Step 1: Google Analytics 4 Setup

### 1.1 Create GA4 Property
1. Go to [Google Analytics](https://analytics.google.com/)
2. Click "Start measuring" or "Admin" > "Create Property"
3. Fill in property details:
   - **Property name**: `STEM Careers Programme`
   - **Reporting time zone**: `(GMT+05:00) Pakistan Standard Time`
   - **Currency**: `Pakistani Rupee (PKR)`
4. Choose your business details and click "Create"

### 1.2 Set up Data Stream
1. Click "Web" under "Choose a platform"
2. Enter your website details:
   - **Website URL**: `https://yourusername.github.io/STEM.edu.pk`
   - **Stream name**: `STEM Careers Website`
3. Click "Create stream"
4. **SAVE YOUR MEASUREMENT ID** (looks like `G-XXXXXXXXXX`)

### 1.3 Configure Enhanced Measurement
1. In your Web stream settings, toggle ON:
   - ✅ Page views
   - ✅ Scrolls
   - ✅ Outbound clicks  
   - ✅ Site search
   - ✅ Video engagement
   - ✅ File downloads

---

## 🔥 Step 2: Firebase Project Setup

### 2.1 Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `stem-careers-programme`
4. **IMPORTANT**: Select "Enable Google Analytics for this project"
5. Choose your existing GA4 property created above
6. Click "Create project"

### 2.2 Enable Firestore Database
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode"
4. Select location: `asia-south1 (Mumbai)`
5. Click "Done"

### 2.3 Configure Firestore Security Rules
Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read/write to analytics events
    match /analytics_events/{document} {
      allow create: if true;
      allow read: if false; // Only admin can read
    }
    
    // Allow read/write to contact submissions
    match /contact_submissions/{document} {
      allow create: if true;
      allow read: if false; // Only admin can read
    }
    
    // Block all other access
    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

### 2.4 Add Web App to Firebase
1. In Firebase Console overview, click the web icon (`</>`)
2. Register your app:
   - **App nickname**: `STEM Careers Website`
   - ✅ Check "Also set up Firebase Hosting" (optional)
3. Click "Register app"
4. **COPY THE CONFIG OBJECT** - you'll need this!

---

## ⚙️ Step 3: Update Your Website Configuration

### 3.1 Replace Firebase Configuration
In your `index.html` and `stem-initiatives.html`, find this section and replace with your actual values:

```javascript
// Replace these placeholder values with your actual Firebase config
const firebaseConfig = {
    apiKey: "YOUR_ACTUAL_API_KEY_HERE",
    authDomain: "stem-careers-programme.firebaseapp.com",  // Replace project-id
    projectId: "stem-careers-programme",  // Replace with your project ID
    storageBucket: "stem-careers-programme.appspot.com",  // Replace project-id
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID_HERE",
    measurementId: "G-XXXXXXXXXX"  // Your GA4 Measurement ID
};
```

### 3.2 Update Google Analytics Measurement ID
Find this line and replace with your GA4 Measurement ID:

```javascript
gtag('config', 'G-XXXXXXXXXX'); // Replace with your actual Measurement ID
```

---

## 🔧 Step 4: Deploy and Test

### 4.1 Deploy to GitHub Pages
1. Commit all your changes to GitHub
2. Ensure GitHub Pages is enabled for your repository
3. Wait for deployment (usually 2-5 minutes)

### 4.2 Test Analytics Setup
1. Visit your live website
2. Open browser developer tools (F12)
3. Check Console tab for:
   - ✅ "📊 STEM Analytics initialized successfully"
   - ✅ "🔥 Firebase initialized successfully" 
   - ✅ "📄 Page view tracked: home"

### 4.3 Verify Data Collection
**Google Analytics (Real-time reports):**
1. Go to GA4 > Reports > Realtime
2. Visit your website in another tab
3. You should see active users increase

**Firebase Console:**
1. Go to Firestore Database
2. Check for `analytics_events` collection
3. Should see new documents appearing

---

## 📈 Step 5: Set up Conversion Goals

### 5.1 Google Analytics Conversions
1. In GA4, go to Admin > Conversions
2. Click "Create conversion event"
3. Add these event names:
   - `contact_form_submit`
   - `program_interest` 
   - `file_download`

### 5.2 Set up Audiences
1. Go to Admin > Audiences
2. Create audiences for:
   - **High Engagement**: Users who view 3+ programs
   - **Contact Leads**: Users who submit contact form
   - **Program Interest**: Users who click apply buttons

---

## 🛡️ Step 6: Privacy & Compliance

### 6.1 Update Privacy Policy
Add this section to your privacy policy:

```
Analytics & Cookies:
- We use Google Analytics to understand website usage
- We collect anonymous interaction data to improve our services  
- No personal information is stored without explicit consent
- Contact form data is securely stored and only used for communication
```

### 6.2 Cookie Consent (Optional)
Consider adding a cookie consent banner for GDPR compliance.

---

## 🎯 Step 7: Monitoring & Maintenance

### 7.1 Regular Checks
- **Weekly**: Review GA4 reports for user engagement
- **Monthly**: Check Firebase usage and costs
- **Quarterly**: Review and update tracking goals

### 7.2 Key Metrics to Monitor
- **Page views and sessions**
- **Program interest by category** 
- **Contact form conversion rate**
- **User journey and drop-off points**

### 7.3 Firebase Costs
Your current setup should stay within Firebase's free tier:
- **Firestore**: 50K reads/writes per day (free)
- **Analytics**: Unlimited (free)
- **Hosting**: 10GB storage (if used)

---

## 📱 Step 8: Advanced Features (Optional)

### 8.1 Custom Dashboards
Create custom GA4 reports for:
- Program performance comparison
- Geographic user distribution  
- Device and browser analytics

### 8.2 Email Notifications
Set up Firebase Cloud Functions to:
- Send email notifications for new contact submissions
- Weekly analytics summary reports

### 8.3 A/B Testing
Use Firebase Remote Config for:
- Testing different call-to-action buttons
- Program description variations
- Layout optimizations

---

## 🆘 Troubleshooting

### Common Issues:

**Analytics not working:**
- Check browser console for errors
- Verify measurement ID is correct
- Ensure ad blockers aren't interfering

**Firebase connection failed:**
- Double-check all config values
- Ensure Firestore rules allow writes
- Check project ID matches exactly

**No data in reports:**
- Allow 24-48 hours for data processing
- Check real-time reports first
- Verify events are firing in browser console

### Support Resources:
- [Firebase Documentation](https://firebase.google.com/docs)
- [Google Analytics Help](https://support.google.com/analytics/)
- [Firebase Console](https://console.firebase.google.com/)

---

## ✅ Final Checklist

- [ ] GA4 property created with correct measurement ID
- [ ] Firebase project created with Firestore enabled  
- [ ] Security rules configured for data protection
- [ ] Firebase config updated in both HTML files
- [ ] Website deployed and analytics working
- [ ] Real-time data visible in GA4
- [ ] Firestore receiving events successfully
- [ ] Conversion goals configured
- [ ] Privacy policy updated

**🎉 Congratulations!** Your STEM Careers Programme website now has enterprise-grade analytics and user tracking capabilities!