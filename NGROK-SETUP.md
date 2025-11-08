# 🌐 ngrok Setup Guide - Expose Localhost to n8n

## ✅ What You Need

ngrok allows you to expose your **localhost** to the internet so n8n can send callbacks to your app.

**Account Required**: Yes, but **FREE tier is sufficient** ✅

---

## 📋 Step-by-Step Setup

### STEP 1: Create ngrok Account (Free)

1. Go to: **https://ngrok.com/**
2. Click **"Sign up"** (top right)
3. Sign up with:
   - Google account (fastest)
   - GitHub account
   - Email + password
4. Verify your email (if using email signup)
5. You're in! Free plan includes:
   - ✅ 1 online ngrok process
   - ✅ 40 connections/minute
   - ✅ HTTPS support
   - ✅ Perfect for this use case!

---

### STEP 2: Install ngrok

#### **Option A: Download Binary (Recommended)**

1. Go to: **https://ngrok.com/download**
2. Select your OS:
   - **Windows**: Download `.zip` file
   - **Mac**: Download `.zip` file
   - **Linux**: Download `.zip` or use package manager
3. Extract the file
4. Move `ngrok` executable to a convenient location

**Linux example:**
```bash
cd ~/Downloads
unzip ngrok-v3-stable-linux-amd64.zip
sudo mv ngrok /usr/local/bin/
chmod +x /usr/local/bin/ngrok
```

**Mac example:**
```bash
cd ~/Downloads
unzip ngrok-v3-stable-darwin-amd64.zip
sudo mv ngrok /usr/local/bin/
```

**Windows:**
- Extract to `C:\ngrok\`
- Add `C:\ngrok\` to your PATH environment variable

#### **Option B: Package Manager**

**Linux (apt):**
```bash
curl -s https://ngrok-agent.s3.amazonaws.com/ngrok.asc | sudo tee /etc/apt/trusted.gpg.d/ngrok.asc >/dev/null
echo "deb https://ngrok-agent.s3.amazonaws.com buster main" | sudo tee /etc/apt/sources.list.d/ngrok.list
sudo apt update
sudo apt install ngrok
```

**Mac (Homebrew):**
```bash
brew install ngrok/ngrok/ngrok
```

**Windows (Chocolatey):**
```bash
choco install ngrok
```

---

### STEP 3: Authenticate ngrok

1. Log in to ngrok dashboard: **https://dashboard.ngrok.com/**
2. Go to **"Your Authtoken"** (left sidebar)
3. Copy your authtoken (something like `2abc123def456ghi...`)
4. Run this command in terminal:

```bash
ngrok config add-authtoken YOUR_AUTH_TOKEN_HERE
```

**Example:**
```bash
ngrok config add-authtoken 2abc123def456ghijklmnopqrstuv
```

You should see:
```
Authtoken saved to configuration file: /home/user/.config/ngrok/ngrok.yml
```

✅ **Done!** You're authenticated.

---

### STEP 4: Start Your Flask Server

Before running ngrok, make sure your Flask server is running:

```bash
cd /home/user/n8n-external-trigger
python3 server.py
```

You should see:
```
╔══════════════════════════════════════════════════════════╗
║  🚀 Google Drive PDF Webhook Server                     ║
╠══════════════════════════════════════════════════════════╣
║  Server running on: http://localhost:8000               ║
║  Callback endpoint: http://localhost:8000/api/callback  ║
║  Results endpoint:  http://localhost:8000/api/result/   ║
║                                                          ║
║  📝 Ready to receive callbacks from n8n!                 ║
╚══════════════════════════════════════════════════════════╝
```

**Keep this terminal open!** ⚠️

---

### STEP 5: Run ngrok

Open a **NEW terminal** (keep the Flask server running!) and run:

```bash
ngrok http 8000
```

You should see something like this:

```
ngrok

Session Status                online
Account                       your-email@example.com (Plan: Free)
Version                       3.x.x
Region                        United States (us)
Latency                       45ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123def456.ngrok-free.app -> http://localhost:8000

Connections                   ttl     opn     rt1     rt5     p50     p90
                              0       0       0.00    0.00    0.00    0.00
```

🎯 **Important**: Copy the **HTTPS** forwarding URL!

Example: `https://abc123def456.ngrok-free.app`

**Keep this terminal open too!** ⚠️

---

### STEP 6: Configure Callback URL in App

1. Open your app: **http://localhost:8000**
2. Click **Settings** ⚙️
3. Scroll to **"Callback URL"**
4. Enter: `https://YOUR-NGROK-URL.ngrok-free.app/api/callback`

**Example:**
```
https://abc123def456.ngrok-free.app/api/callback
```

5. (Optional) Set a **Callback Token**: `my-secret-token-123`
6. Click **"Save Configuration"**

---

### STEP 7: Test the Callback Endpoint

Before using it with n8n, test that ngrok is working:

Open a **third terminal** and run:

```bash
curl https://YOUR-NGROK-URL.ngrok-free.app/api/health
```

**Example:**
```bash
curl https://abc123def456.ngrok-free.app/api/health
```

You should see:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-08T12:34:56.789",
  "activeJobs": 0
}
```

✅ **Perfect!** Your callback endpoint is reachable from the internet.

---

## 🔧 Configure n8n Webhook

Now update your n8n workflow to use the callback:

### In n8n "HTTP Request" Node (for callback):

**Method**: `POST`

**URL**: `https://YOUR-NGROK-URL.ngrok-free.app/api/callback`

**Headers**:
- `Content-Type`: `application/json`

**Body** (example):
```json
{
  "jobId": "{{ $json.jobId }}",
  "url": "{{ $json.supabasePublicUrl }}",
  "fileName": "{{ $json.fileName }}",
  "items": "{{ $json.itemCount }}",
  "durationSec": "{{ $json.processingTime }}",
  "callbackToken": "my-secret-token-123"
}
```

**Options**:
- **Response Format**: JSON

---

## 🎯 Complete Workflow Example

Here's how everything works together:

```
┌──────────────────────────────────────────────────────────┐
│ 1. User selects PDF in app (localhost:8000)             │
│    Sends: { fileId, pbsCode, callbackUrl }               │
│    ↓                                                      │
│ 2. n8n receives webhook                                 │
│    Returns: 202 Accepted + { jobId }                     │
│    ↓                                                      │
│ 3. n8n processes PDF (4 minutes...)                      │
│    ↓                                                      │
│ 4. n8n uploads JSON to Supabase                         │
│    Gets public URL                                        │
│    ↓                                                      │
│ 5. n8n sends POST to callback URL (via ngrok)           │
│    https://abc123.ngrok-free.app/api/callback            │
│    ↓                                                      │
│ 6. ngrok forwards to localhost:8000/api/callback        │
│    ↓                                                      │
│ 7. Flask server stores result                            │
│    ↓                                                      │
│ 8. App polls /api/result/{jobId} every 5 seconds        │
│    ↓                                                      │
│ 9. App receives result and displays JSON                │
└──────────────────────────────────────────────────────────┘
```

---

## 🐛 Troubleshooting

### ngrok says "command not found"

**Solution**: ngrok is not in your PATH

**Linux/Mac**:
```bash
# Check where ngrok is
which ngrok

# If nothing, move it to /usr/local/bin
sudo mv /path/to/ngrok /usr/local/bin/
```

**Windows**: Add ngrok folder to PATH environment variable

---

### ngrok says "authentication failed"

**Solution**: You didn't set your authtoken

```bash
ngrok config add-authtoken YOUR_TOKEN_HERE
```

Get your token from: https://dashboard.ngrok.com/get-started/your-authtoken

---

### n8n callback fails with "connection refused"

**Possible causes**:

1. **Flask server not running**
   - Check terminal - is `python3 server.py` still running?
   - Restart if needed

2. **ngrok not running**
   - Check terminal - is `ngrok http 8000` still running?
   - Restart if needed

3. **Wrong port**
   - Make sure ngrok is pointing to port 8000: `ngrok http 8000`

4. **Wrong URL in n8n**
   - Use HTTPS URL from ngrok (not HTTP)
   - Include `/api/callback` at the end
   - Example: `https://abc123.ngrok-free.app/api/callback`

---

### App not receiving results

**Check:**

1. **Is polling working?**
   - Open browser DevTools (F12)
   - Go to Console tab
   - Look for: `Starting to poll for job: ...`

2. **Is callback URL configured?**
   - Settings → Callback URL should be filled
   - Must include your ngrok URL

3. **Did n8n send the callback?**
   - Check ngrok web interface: http://127.0.0.1:4040
   - Shows all HTTP requests received
   - Look for POST to `/api/callback`

4. **Check Flask server logs**
   - Look at terminal running `server.py`
   - Should show: `✅ Callback received for job ...`

---

### ngrok URL changes every time

**Problem**: Free ngrok URLs are randomized on each restart

**Solutions**:

**Option A: Keep ngrok running**
- Don't close ngrok terminal
- URL stays the same

**Option B: Upgrade to paid plan** ($8/month)
- Get a static domain
- URL never changes

**Option C: Update URL each time**
- When you restart ngrok, update Settings → Callback URL
- Not ideal, but works for testing

---

## 💡 Tips & Best Practices

### 1. Keep Everything Running

You need **3 terminals open**:
1. Flask server: `python3 server.py`
2. ngrok: `ngrok http 8000`
3. Your normal terminal (for other commands)

### 2. Monitor ngrok Traffic

Open in browser: **http://127.0.0.1:4040**

You'll see:
- All HTTP requests received via ngrok
- Request headers, body, response
- Super useful for debugging!

### 3. Use HTTPS Only

Always use the **HTTPS** URL from ngrok, not HTTP.

❌ Wrong: `http://abc123.ngrok-free.app/api/callback`
✅ Correct: `https://abc123.ngrok-free.app/api/callback`

### 4. Test Manually First

Before using with n8n, test manually:

```bash
curl -X POST https://YOUR-NGROK-URL.ngrok-free.app/api/callback \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "test-123",
    "url": "https://example.com/test.json",
    "fileName": "test.pdf"
  }'
```

Should return:
```json
{
  "success": true,
  "message": "Callback received",
  "jobId": "test-123"
}
```

### 5. Security Considerations

**For testing** (current setup):
- ✅ Free ngrok is fine
- ✅ Callback token is optional but recommended

**For production**:
- Use a real server (not localhost + ngrok)
- Implement callback token validation
- Use HTTPS with valid SSL certificate
- Add rate limiting

---

## 🚀 Quick Start (TL;DR)

```bash
# 1. Install ngrok (one time)
# Download from https://ngrok.com/download

# 2. Authenticate (one time)
ngrok config add-authtoken YOUR_TOKEN_HERE

# 3. Start Flask server (terminal 1)
cd /home/user/n8n-external-trigger
python3 server.py

# 4. Start ngrok (terminal 2)
ngrok http 8000

# 5. Copy the HTTPS URL from ngrok output
# Example: https://abc123def456.ngrok-free.app

# 6. Configure in app
# Settings → Callback URL: https://abc123.ngrok-free.app/api/callback

# 7. Done! Send a test PDF and watch it work!
```

---

## 📊 Monitoring & Debugging

### Check Flask Server Logs

Terminal running `server.py` will show:
```
✅ Callback received for job 20251108_042444_817453
   URL: https://supabase.co/storage/v1/object/public/...
   Items: 42
```

### Check ngrok Web Interface

Open: **http://127.0.0.1:4040**

Shows:
- All requests received
- Request/response details
- Timing information

### Check Browser Console

Press F12 in browser, go to Console tab:
```
Starting to poll for job: 20251108_042444_817453
Job still processing...
Job still processing...
Result received: {jobId: "...", url: "...", ...}
Stopped polling
```

### Check App Results Card

The app will show:
1. **Processing** badge (yellow) → n8n is working
2. **Ready** badge (green) → Result received!
3. JSON data displayed below

---

## ✅ Success Checklist

Before testing end-to-end:

- [ ] ngrok account created (free)
- [ ] ngrok installed and authenticated
- [ ] Flask server running (`python3 server.py`)
- [ ] ngrok running (`ngrok http 8000`)
- [ ] HTTPS URL copied from ngrok
- [ ] Callback URL configured in app settings
- [ ] n8n workflow updated with callback endpoint
- [ ] Manual test of callback endpoint successful
- [ ] Ready to test with real PDF!

---

## 🆘 Need Help?

If you're stuck:

1. **Check ngrok status**: http://127.0.0.1:4040
2. **Check Flask logs**: Look at terminal running `server.py`
3. **Check browser console**: F12 → Console tab
4. **Test manually**: `curl https://YOUR-NGROK-URL/api/health`

---

## 🎬 Next Steps

Once ngrok is set up and working:

1. ✅ Test with a real PDF file
2. ✅ Verify n8n sends the callback
3. ✅ Verify app receives and displays the JSON
4. ✅ Validate and edit the JSON data
5. ✅ Download or save the validated JSON

Enjoy your automated callback system! 🎉
