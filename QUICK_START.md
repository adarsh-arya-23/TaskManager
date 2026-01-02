# ⚡ Quick MongoDB Atlas Setup

## 🚀 5-Minute Setup

### Step 1: Create Account
Go to: https://www.mongodb.com/cloud/atlas/register

### Step 2: Create Free Cluster
1. Click "Build a Database"
2. Choose "Shared" (FREE)
3. Select AWS
4. Click "Create Cluster"

### Step 3: Create Database User
1. Click "Database Access" (left sidebar)
2. Click "Add New Database User"
3. Username: `habituser`
4. Click "Autogenerate Secure Password"
5. **COPY THE PASSWORD!** 📋
6. Select "Read and write to any database"
7. Click "Add User"

### Step 4: Whitelist IP
1. Click "Network Access" (left sidebar)
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Step 5: Get Connection String
1. Click "Database" (left sidebar)
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string

### Step 6: Update .env File
Open `server/.env` and update:

```env
MONGODB_URI=mongodb+srv://habituser:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/habittracker?retryWrites=true&w=majority
```

**Replace:**
- `YOUR_PASSWORD` with the password you copied
- `cluster0.xxxxx` with your actual cluster URL

### Step 7: Test Connection
```bash
cd server
npm run dev
```

Look for: `✅ MongoDB Connected Successfully`

---

## 🆘 Common Issues

**"Authentication failed"**
→ Double-check username and password in .env

**"IP not whitelisted"**
→ Go to Network Access, add 0.0.0.0/0

**"Connection timeout"**
→ Check internet connection, verify cluster is running

---

## ✅ Done!
Once you see `✅ MongoDB Connected Successfully`, you're ready to go!

Run the frontend: `npm run dev`

See **MONGODB_SETUP.md** for detailed instructions.
