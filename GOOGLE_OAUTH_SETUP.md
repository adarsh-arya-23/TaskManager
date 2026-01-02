# 🔐 Google OAuth 2.0 Setup Guide

## ✅ **100% FREE - No Credit Card Required**

This guide will help you set up Google OAuth 2.0 for your HabitFlow application using completely free Google Cloud services.

---

## 📋 **Step-by-Step Setup**

### **Step 1: Create a Google Cloud Project**

1. **Go to Google Cloud Console**
   - Visit: https://console.cloud.google.com/
   - Sign in with your Google account (free)

2. **Create New Project**
   - Click the project dropdown at the top
   - Click "New Project"
   - Project name: `HabitFlow` (or your choice)
   - Click "Create"
   - Wait for project creation (takes ~10 seconds)

### **Step 2: Enable Google+ API**

1. **Navigate to APIs & Services**
   - In the left sidebar, click "APIs & Services" → "Library"
   
2. **Enable Required API**
   - Search for "Google+ API"
   - Click on it
   - Click "Enable"
   - Wait for it to enable (~5 seconds)

### **Step 3: Configure OAuth Consent Screen**

1. **Go to OAuth Consent Screen**
   - Left sidebar → "APIs & Services" → "OAuth consent screen"

2. **Choose User Type**
   - Select "External" (free tier)
   - Click "Create"

3. **Fill App Information**
   - **App name**: `HabitFlow`
   - **User support email**: Your email
   - **App logo**: (Optional - skip for now)
   - **Application home page**: `http://localhost:3000`
   - **Authorized domains**: Leave empty for development
   - **Developer contact email**: Your email
   - Click "Save and Continue"

4. **Scopes**
   - Click "Add or Remove Scopes"
   - Select these scopes:
     - `userinfo.email`
     - `userinfo.profile`
   - Click "Update"
   - Click "Save and Continue"

5. **Test Users** (Optional for development)
   - Add your email as a test user
   - Click "Save and Continue"

6. **Summary**
   - Review and click "Back to Dashboard"

### **Step 4: Create OAuth 2.0 Credentials**

1. **Go to Credentials**
   - Left sidebar → "APIs & Services" → "Credentials"

2. **Create Credentials**
   - Click "Create Credentials" → "OAuth client ID"

3. **Configure OAuth Client**
   - **Application type**: Web application
   - **Name**: `HabitFlow Web Client`
   
4. **Authorized JavaScript origins**
   - Click "Add URI"
   - Add: `http://localhost:3000`
   - Add: `http://localhost:5000`

5. **Authorized redirect URIs**
   - Click "Add URI"
   - Add: `http://localhost:5000/api/auth/google/callback`

6. **Create**
   - Click "Create"
   - A popup will show your credentials

7. **Copy Credentials** ⚠️ IMPORTANT
   - **Client ID**: Copy this (looks like: `123456789-abc...apps.googleusercontent.com`)
   - **Client Secret**: Copy this (looks like: `GOCSPX-abc...xyz`)
   - Click "OK"

---

## 🔧 **Configure Your Application**

### **Update `server/.env` File**

Add these lines to your `server/.env` file:

```env
# Existing variables
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
PORT=5000
NODE_ENV=development

# Google OAuth (ADD THESE)
GOOGLE_CLIENT_ID=YOUR_CLIENT_ID_HERE
GOOGLE_CLIENT_SECRET=YOUR_CLIENT_SECRET_HERE
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
FRONTEND_URL=http://localhost:3000
```

**Replace:**
- `YOUR_CLIENT_ID_HERE` with your actual Client ID
- `YOUR_CLIENT_SECRET_HERE` with your actual Client Secret

---

## ✅ **Verification Checklist**

Before testing, make sure:

- [ ] Google Cloud Project created
- [ ] Google+ API enabled
- [ ] OAuth consent screen configured
- [ ] OAuth 2.0 credentials created
- [ ] Client ID and Secret copied
- [ ] `server/.env` updated with credentials
- [ ] Redirect URI matches exactly: `http://localhost:5000/api/auth/google/callback`
- [ ] Frontend URL is: `http://localhost:3000`

---

## 🚀 **Testing Google OAuth**

1. **Restart Backend Server**
   ```bash
   # Stop the server (Ctrl+C)
   npm start
   ```

2. **Open Frontend**
   - Go to: http://localhost:3000/login

3. **Click "Continue with Google"**
   - You'll be redirected to Google
   - Sign in with your Google account
   - Grant permissions
   - You'll be redirected back to your app
   - You should be logged in!

---

## 🐛 **Troubleshooting**

### **Error: "redirect_uri_mismatch"**
- **Solution**: Make sure the redirect URI in Google Console exactly matches:
  ```
  http://localhost:5000/api/auth/google/callback
  ```
- No trailing slash, exact match required

### **Error: "Access blocked: This app's request is invalid"**
- **Solution**: Make sure you've configured the OAuth consent screen
- Add your email as a test user

### **Error: "Invalid client"**
- **Solution**: Double-check your Client ID and Secret in `.env`
- Make sure there are no extra spaces

### **Error: "Cannot GET /api/auth/google/callback"**
- **Solution**: Make sure backend server is running on port 5000
- Check that the route is properly configured

---

## 🔒 **Security Notes**

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Client Secret is sensitive** - Don't share it publicly
3. **Use HTTPS in production** - Update redirect URIs for production
4. **Rotate secrets regularly** - Good security practice

---

## 📊 **What Happens Behind the Scenes**

1. User clicks "Continue with Google"
2. User is redirected to Google's login page
3. User signs in and grants permissions
4. Google redirects back to your callback URL with a code
5. Your backend exchanges the code for user info
6. Backend creates/finds user in database
7. Backend generates JWT token
8. User is logged in!

---

## 🎉 **Benefits**

✅ **One-click signup** - No password needed
✅ **Verified emails** - Google verifies emails
✅ **Secure** - OAuth 2.0 industry standard
✅ **Free** - No costs for development
✅ **User-friendly** - Familiar Google login

---

## 📝 **Production Deployment**

When deploying to production:

1. Update authorized origins to your production domain
2. Update redirect URI to your production callback URL
3. Use HTTPS (required for production)
4. Update `FRONTEND_URL` in `.env`
5. Consider moving OAuth consent screen to "Published" status

---

**Ready to test? Follow the steps above and enjoy seamless Google authentication!** 🚀
