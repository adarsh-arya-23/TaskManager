l̥# 🗄️ MongoDB Atlas Setup Guide

This guide will walk you through setting up MongoDB Atlas for the HabitFlow application.

## Step 1: Create MongoDB Atlas Account

1. Go to [https://www.mongodb.com/cloud/atlas/register](https://www.mongodb.com/cloud/atlas/register)
2. Sign up with your email or Google account
3. Complete the registration form

## Step 2: Create a New Cluster

1. After logging in, click **"Build a Database"**
2. Choose **"Shared"** (Free tier - M0)
3. Select your preferred cloud provider:
   - AWS (recommended)
   - Google Cloud
   - Azure
4. Choose a region close to your location for better performance
5. Click **"Create Cluster"**
6. Wait 3-5 minutes for cluster creation

## Step 3: Create Database User

1. Click **"Database Access"** in the left sidebar
2. Click **"Add New Database User"**l̥
3. Choose **"Password"** authentication
4. Enter a username (e.g., `habituser`)
5. Click **"Autogenerate Secure Password"** or create your own
6. **IMPORTANT:** Copy and save this password securely!
7. Under "Database User Privileges", select **"Read and write to any database"**
8. Click **"Add User"**

## Step 4: Whitelist Your IP Address

1. Click **"Network Access"** in the left sidebar
2. Click **"Add IP Address"**
3. Choose one of these options:
   - **"Add Current IP Address"** (for development)
   - **"Allow Access from Anywhere"** (0.0.0.0/0) - easier for development but less secure
4. Click **"Confirm"**

## Step 5: Get Your Connection String

1. Click **"Database"** in the left sidebar
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Select:
   - Driver: **Node.js**
   - Version: **4.1 or later**
5. Copy the connection string (it looks like this):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

## Step 6: Configure Your Application

1. Open `server/.env` file in your project
2. Replace the `MONGODB_URI` with your connection string
3. **Important modifications:**
   - Replace `<username>` with your database username
   - Replace `<password>` with your database password
   - Add database name after `.net/`: `habittracker`

**Example:**
```env
# Before
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority

# After
mongodb+srv://habituser:MySecurePass123@cluster0.abc123.mongodb.net/habittracker?retryWrites=true&w=majority
```

## Step 7: Test Your Connection

1. Save your `.env` file
2. Run the backend server:
   ```bash
   cd server
   npm run dev
   ```
3. Look for this message:
   ```
   ✅ MongoDB Connected Successfully
   ```

## Common Issues & Solutions

### Issue: "Authentication failed"
**Solution:** 
- Double-check your username and password
- Make sure there are no special characters that need URL encoding
- If password has special characters, encode them:
  - `@` → `%40`
  - `#` → `%23`
  - `$` → `%24`

### Issue: "IP not whitelisted"
**Solution:**
- Go to Network Access
- Add your current IP or use 0.0.0.0/0 for development

### Issue: "Connection timeout"
**Solution:**
- Check your internet connection
- Verify the cluster is running (green status)
- Try a different region when creating cluster

### Issue: "Database not found"
**Solution:**
- MongoDB will automatically create the database on first write
- Make sure you added `/habittracker` after `.net/` in connection string

## Security Best Practices

### For Development:
✅ Use IP whitelist (0.0.0.0/0 is okay)
✅ Use strong passwords
✅ Keep `.env` in `.gitignore`

### For Production:
✅ Whitelist only specific IPs
✅ Use environment variables (never commit `.env`)
✅ Enable MongoDB Atlas encryption
✅ Set up database backups
✅ Use MongoDB Atlas monitoring

## MongoDB Atlas Features You Can Explore

1. **Metrics** - Monitor database performance
2. **Alerts** - Set up alerts for issues
3. **Backups** - Automatic backups (paid feature)
4. **Charts** - Visualize your data
5. **Realm** - Mobile sync and serverless functions

## Need Help?

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB University](https://university.mongodb.com/) - Free courses
- [MongoDB Community Forums](https://www.mongodb.com/community/forums/)

---

**Once your MongoDB Atlas is set up, you're ready to run the application! 🚀**

Return to the main README.md for application setup instructions.
