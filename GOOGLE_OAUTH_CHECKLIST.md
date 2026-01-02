# ✅ Google OAuth Configuration Checklist

## 📋 Your Google Credentials

**Client ID:** `your_google_client_id_here.apps.googleusercontent.com`
**Client Secret:** `your_google_client_secret_here`

---

## 🔧 Required Configuration Files

### 1. **Backend Environment Variables** (`server/.env`)

**File Location:** `d:\Documents\TaskManager\server\.env`

**Required Content:**
```env
# MongoDB
MONGODB_URI=your_mongodb_uri_here
JWT_SECRET=your_jwt_secret_here
PORT=5000
NODE_ENV=development

# Google OAuth - ADD THESE
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

**Status:** ⚠️ **ACTION REQUIRED**
- Please manually add the Google credentials to `server/.env`
- The file is gitignored (secure), so I cannot edit it directly

---

### 2. **Frontend Environment Variables** (`.env` in root)

**File Location:** `d:\Documents\TaskManager\.env`

**Required Content:**
```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
```

**Status:** ⚠️ **ACTION REQUIRED**
- Create a new file named `.env` in the root directory
- Add the line above
- The file is gitignored (secure)

**Note:** I've already updated `.env.example` with your Client ID as a reference.

---

## 🌐 Google Cloud Console Settings

### **Authorized JavaScript Origins**
Make sure these are added in Google Cloud Console:
- ✅ `http://localhost:3000`
- ✅ `http://localhost:5000`

### **Authorized Redirect URIs**
Make sure this is added:
- ✅ `http://localhost:5000/api/auth/google/callback`

**Where to check:**
1. Go to: https://console.cloud.google.com/apis/credentials
2. Click on your OAuth 2.0 Client ID
3. Verify the URIs match exactly

---

## 📝 Manual Steps Required

### Step 1: Update Backend `.env`
```bash
# Open the file
cd server
notepad .env

# Add these lines (if not already there):
GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
```

### Step 2: Create Frontend `.env`
```bash
# From project root
notepad .env

# Add this line:
VITE_GOOGLE_CLIENT_ID=your_google_client_id_here.apps.googleusercontent.com
```

### Step 3: Restart Both Servers
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend  
npm run dev
```

---

## ✅ Verification Checklist

After completing the steps above, verify:

- [ ] `server/.env` contains `GOOGLE_CLIENT_ID`
- [ ] `server/.env` contains `GOOGLE_CLIENT_SECRET`
- [ ] Root `.env` contains `VITE_GOOGLE_CLIENT_ID`
- [ ] Backend server restarted
- [ ] Frontend dev server restarted
- [ ] Google Cloud Console has correct redirect URIs
- [ ] Can see "Continue with Google" button on login page
- [ ] Clicking button redirects to Google
- [ ] After Google login, redirected back to app

---

## 🧪 Testing

1. **Open Login Page:** http://localhost:3000/login
2. **Look for:** "Continue with Google" button at the top
3. **Click it:** Should redirect to Google sign-in
4. **Sign in:** Use your Google account
5. **Result:** Should be redirected back and logged in

---

## 🐛 Troubleshooting

### Error: "Invalid Client"
- **Solution:** Double-check Client ID and Secret in `.env` files
- Make sure there are no extra spaces or quotes

### Error: "redirect_uri_mismatch"
- **Solution:** Verify redirect URI in Google Console matches exactly:
  ```
  http://localhost:5000/api/auth/google/callback
  ```

### Button doesn't appear
- **Solution:** Make sure frontend `.env` has the Client ID
- Restart frontend dev server

### "VITE_GOOGLE_CLIENT_ID is undefined"
- **Solution:** 
  1. Create `.env` file in project root (not in `src/`)
  2. Add: `VITE_GOOGLE_CLIENT_ID=your_client_id`
  3. Restart dev server

---

## 📊 Current Status

**Backend Configuration:**
- ✅ Google Auth route added to `server.js`
- ✅ OAuth2Client initialized
- ✅ User model has Google fields
- ⚠️ Need to add credentials to `server/.env`

**Frontend Configuration:**
- ✅ GoogleOAuthProvider in `main.tsx`
- ✅ GoogleSignInButton component created
- ✅ Login page updated with Google button
- ✅ `.env.example` has your Client ID
- ⚠️ Need to create `.env` with Client ID

**Next Action:**
1. Add credentials to `server/.env`
2. Create `.env` in root with `VITE_GOOGLE_CLIENT_ID`
3. Restart both servers
4. Test the Google login!

---

**Once you complete the manual steps above, Google OAuth will be fully functional!** 🚀
