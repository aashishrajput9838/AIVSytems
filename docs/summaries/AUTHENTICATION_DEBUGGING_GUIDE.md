# Authentication Debugging Guide

## Current Issue
After logging in, users are being redirected back to the login page instead of staying logged in and accessing the dashboard.

## Debugging Steps

### 1. **Check Browser Console**
Open your browser's developer tools and look for these logs:

#### **Firebase Initialization Logs:**
```
Firebase Config: { apiKey: 'Set', authDomain: 'Set', ... }
Firebase App initialized: [DEFAULT]
Firestore initialized
Firebase Auth initialized: [DEFAULT]
Google Auth Provider configured
```

#### **Authentication Flow Logs:**
```
Initializing Firebase Auth...
Firebase persistence configured
Checking for redirect result...
No redirect result found
Setting up auth state listener...
Auth state changed: No user
```

#### **Login Attempt Logs:**
```
Login: Attempting email sign-in...
Attempting email sign-in for: user@example.com
Email sign-in successful: user@example.com
Login: Email sign-in successful, setting success state
Login: Redirecting to dashboard...
```

#### **ProtectedRoute Logs:**
```
ProtectedRoute: { requireAuth: true, loading: false, isInitialized: true, user: 'user@example.com', currentPath: '/dashboard' }
ProtectedRoute: Allowing access
```

### 2. **Check Environment Variables**
Verify your `.env` file has all required Firebase configuration:

```bash
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### 3. **Test Authentication Flow**

#### **Step 1: Clear Browser Data**
- Clear cookies and local storage
- Clear browser cache
- Restart browser

#### **Step 2: Test Login**
1. Navigate to `/login`
2. Open browser console
3. Enter valid credentials
4. Watch console logs
5. Check if redirect happens

#### **Step 3: Check Network Tab**
- Look for Firebase authentication requests
- Check for any failed requests
- Verify redirect responses

### 4. **Common Issues and Solutions**

#### **Issue: "Firebase Config: Missing" logs**
**Solution:** Check your `.env` file and ensure all variables are set correctly.

#### **Issue: No authentication logs appear**
**Solution:** Firebase might not be initializing. Check for JavaScript errors.

#### **Issue: "Auth state changed: No user" after login**
**Solution:** The authentication state isn't persisting. Check Firebase persistence settings.

#### **Issue: ProtectedRoute always redirects to login**
**Solution:** The `isInitialized` state might be false. Check the initialization flow.

### 5. **Manual Testing Commands**

#### **Test Firebase Auth in Console:**
```javascript
// Check if Firebase is available
console.log('Firebase:', typeof firebase !== 'undefined' ? 'Available' : 'Not Available')

// Check auth state
console.log('Current User:', firebase.auth().currentUser)

// Check auth state listener
firebase.auth().onAuthStateChanged((user) => {
  console.log('Manual Auth State:', user ? user.email : 'No user')
})
```

#### **Test ProtectedRoute Logic:**
```javascript
// Check auth context values
const authContext = document.querySelector('[data-testid="auth-context"]')
console.log('Auth Context:', authContext)
```

### 6. **Debugging Checklist**

- [ ] Firebase configuration logs appear in console
- [ ] Authentication initialization logs appear
- [ ] Login attempt logs appear
- [ ] Auth state change logs appear
- [ ] ProtectedRoute logs appear
- [ ] No JavaScript errors in console
- [ ] Network requests complete successfully
- [ ] Environment variables are set correctly

### 7. **Temporary Debug Component**

Add this component to your dashboard to see real-time auth state:

```jsx
const AuthDebugger = () => {
  const { user, loading, isInitialized } = useAuth()
  
  return (
    <div style={{ position: 'fixed', top: 10, right: 10, background: 'white', padding: 10, border: '1px solid black' }}>
      <h4>Auth Debug Info</h4>
      <p>User: {user ? user.email : 'None'}</p>
      <p>Loading: {loading ? 'Yes' : 'No'}</p>
      <p>Initialized: {isInitialized ? 'Yes' : 'No'}</p>
      <p>UID: {user ? user.uid : 'None'}</p>
    </div>
  )
}
```

### 8. **Expected Console Output**

#### **Successful Login Flow:**
```
Firebase Config: { apiKey: 'Set', authDomain: 'Set', ... }
Firebase App initialized: [DEFAULT]
Firestore initialized
Firebase Auth initialized: [DEFAULT]
Google Auth Provider configured
Initializing Firebase Auth...
Firebase persistence configured
Checking for redirect result...
No redirect result found
Setting up auth state listener...
Auth state changed: No user
Login: Attempting email sign-in...
Attempting email sign-in for: user@example.com
Email sign-in successful: user@example.com
Auth state changed: user@example.com
Login: Email sign-in successful, setting success state
Login: Redirecting to dashboard...
ProtectedRoute: { requireAuth: true, loading: false, isInitialized: true, user: 'user@example.com', currentPath: '/dashboard' }
ProtectedRoute: Allowing access
```

### 9. **Next Steps**

1. **Run through debugging checklist**
2. **Check console for all expected logs**
3. **Identify where the flow breaks**
4. **Test with different browsers**
5. **Check Firebase console for authentication logs**

### 10. **Contact Information**

If issues persist after following this guide:
- Check Firebase console for authentication errors
- Verify Firebase project settings
- Check browser compatibility
- Test with incognito/private browsing mode
