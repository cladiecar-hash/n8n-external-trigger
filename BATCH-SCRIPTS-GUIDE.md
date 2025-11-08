# 📝 Windows Batch Scripts Guide

This folder contains convenient `.bat` scripts for Windows to make launching and managing the Google Drive PDF Webhook app easier.

---

## 📂 Available Scripts

### 🚀 **start-server.bat**
**Launch the Flask server**

- Checks if Python is installed
- Installs dependencies if needed (Flask, flask-cors)
- Starts the server on http://localhost:8000
- Serves both the HTML app and callback endpoints

**Usage:**
```
Double-click start-server.bat
```

**Keep this window open while using the app!**

---

### 🌐 **start-ngrok.bat**
**Launch ngrok to expose localhost**

- Checks if ngrok is installed and authenticated
- Starts ngrok tunnel to port 8000
- Displays the public HTTPS URL
- Shows instructions for configuring the callback URL

**Usage:**
```
Double-click start-ngrok.bat
```

**Prerequisites:**
- ngrok must be installed
- ngrok must be authenticated (see NGROK-SETUP.md)

**Keep this window open for callbacks to work!**

---

### 🎯 **start-all.bat** ⭐ RECOMMENDED
**Launch both Flask server AND ngrok**

- Opens Flask server in one window
- Opens ngrok in another window
- Shows next steps for configuration

**Usage:**
```
Double-click start-all.bat
```

**This is the easiest way to get everything running!**

---

### 📦 **install-dependencies.bat**
**Install Python dependencies**

- Checks if Python and pip are installed
- Installs Flask and flask-cors from requirements.txt
- Shows installed package versions

**Usage:**
```
Double-click install-dependencies.bat
```

**Run this once before first use!**

---

### 🧪 **test-endpoints.bat**
**Test the server endpoints**

- Tests health check endpoint
- Sends a test callback
- Retrieves test results
- Lists all stored results

**Usage:**
```
Double-click test-endpoints.bat
```

**Prerequisites:**
- Flask server must be running (run start-server.bat first)

---

### 🌐 **open-app.bat**
**Open the app in your browser**

- Checks if server is running
- Starts server if not running
- Opens http://localhost:8000 in default browser

**Usage:**
```
Double-click open-app.bat
```

---

### 🌐 **open-ngrok-web.bat**
**Open ngrok web interface**

- Opens http://127.0.0.1:4040 in browser
- Shows all HTTP requests received via ngrok
- Useful for debugging callbacks

**Usage:**
```
Double-click open-ngrok-web.bat
```

**Prerequisites:**
- ngrok must be running (run start-ngrok.bat first)

---

### 🛑 **stop-all.bat**
**Stop all services**

- Stops Flask server
- Stops ngrok
- Cleans up processes

**Usage:**
```
Double-click stop-all.bat
```

---

## 🎬 Quick Start Guide

### First Time Setup

1. **Install Python** (if not already installed)
   - Download from https://www.python.org/downloads/
   - ✅ Check "Add Python to PATH" during installation
   - Restart your computer after installation

2. **Install Dependencies**
   ```
   Double-click: install-dependencies.bat
   ```
   Wait for installation to complete

3. **Install ngrok** (optional, for automatic callbacks)
   - Follow NGROK-SETUP.md for detailed instructions
   - Quick steps:
     - Download from https://ngrok.com/download
     - Extract ngrok.exe
     - Authenticate with your token

---

### Daily Usage

#### **Option A: With Automatic Callbacks (Recommended)**

1. **Start Everything**
   ```
   Double-click: start-all.bat
   ```

2. **Copy ngrok URL**
   - Look at the ngrok window
   - Copy the HTTPS URL (e.g., `https://abc123.ngrok-free.app`)

3. **Configure App**
   - App should open automatically
   - If not, double-click: `open-app.bat`
   - Go to Settings ⚙️
   - Paste ngrok URL in "Callback URL"
   - Add `/api/callback` at the end
   - Example: `https://abc123.ngrok-free.app/api/callback`
   - Click "Save Configuration"

4. **Use the App!**
   - Connect to Google Drive
   - Select PDF file
   - Enter PBS code
   - Send to n8n
   - Wait for automatic callback (app polls every 5 seconds)

5. **When Done**
   ```
   Double-click: stop-all.bat
   ```

---

#### **Option B: Without ngrok (Manual Mode)**

1. **Start Server Only**
   ```
   Double-click: start-server.bat
   ```

2. **Open App**
   ```
   Double-click: open-app.bat
   ```

3. **Configure App**
   - Go to Settings ⚙️
   - Leave "Callback URL" EMPTY
   - Save configuration

4. **Use the App**
   - Select PDF and send to n8n
   - When n8n finishes, manually paste the JSON result
   - Click "Load Result"

5. **When Done**
   - Just close the server window
   - Or run: `stop-all.bat`

---

## 🔧 Troubleshooting

### "Python is not installed or not in PATH"

**Solution:**
1. Download Python from https://www.python.org/downloads/
2. During installation, CHECK ✅ "Add Python to PATH"
3. Restart computer
4. Try again

---

### "ngrok is not installed or not in PATH"

**Solution:**
1. Download ngrok from https://ngrok.com/download
2. Extract `ngrok.exe` to a folder (e.g., `C:\ngrok\`)
3. Add that folder to PATH:
   - Right-click "This PC" → Properties
   - Advanced system settings → Environment Variables
   - Under "System variables", find "Path"
   - Edit → New → Add `C:\ngrok\`
   - OK → OK → OK
4. Restart command prompt
5. Try again

**Or:** Just extract `ngrok.exe` to the same folder as these .bat files

---

### "ngrok is not authenticated"

**Solution:**
1. Go to https://dashboard.ngrok.com/get-started/your-authtoken
2. Copy your authtoken
3. Open command prompt
4. Run: `ngrok config add-authtoken YOUR_TOKEN_HERE`
5. Try again

---

### "Server is not running"

**Solution:**
1. Make sure you ran `start-server.bat` first
2. Check if another program is using port 8000
3. Look at the server window for errors
4. Try stopping everything with `stop-all.bat` and starting again

---

### "Failed to install dependencies"

**Solutions:**
- Make sure you have internet connection
- Try running `install-dependencies.bat` as Administrator:
  - Right-click → Run as administrator
- Check if Python and pip are properly installed:
  - Open command prompt
  - Run: `python --version`
  - Run: `pip --version`

---

## 💡 Tips

### Tip 1: Keep Windows Open
Don't close the Flask server and ngrok windows while using the app. They need to stay open for everything to work.

### Tip 2: Use start-all.bat
For the best experience, just use `start-all.bat` - it starts everything you need in separate windows.

### Tip 3: Monitor ngrok Traffic
Open the ngrok web interface to see all HTTP requests:
```
Double-click: open-ngrok-web.bat
```

### Tip 4: Test Before Using
After starting the server, test that everything works:
```
Double-click: test-endpoints.bat
```

### Tip 5: ngrok URL Changes
The free ngrok URL changes every time you restart ngrok. Either:
- Keep ngrok running all day
- Update the callback URL when you restart ngrok
- Upgrade to ngrok paid plan for a static URL

---

## 📊 Script Dependencies

```
install-dependencies.bat
    └── (run this first!)

start-server.bat
    └── Requires: Python, Flask, flask-cors

start-ngrok.bat
    └── Requires: ngrok installed and authenticated

start-all.bat
    └── Runs: start-server.bat + start-ngrok.bat

test-endpoints.bat
    └── Requires: Flask server running

open-app.bat
    └── Opens browser, auto-starts server if needed

open-ngrok-web.bat
    └── Requires: ngrok running

stop-all.bat
    └── Stops everything
```

---

## 🆘 Getting Help

If you're stuck:

1. **Read the error message** - scripts show helpful error messages
2. **Check prerequisites** - make sure Python and ngrok are installed
3. **Read the guides**:
   - `NGROK-SETUP.md` - ngrok setup
   - `TESTING-GUIDE.md` - testing procedures
   - `README.md` - general documentation
4. **Try the test script**: `test-endpoints.bat`

---

## ✅ Checklist Before First Use

- [ ] Python installed (with "Add to PATH" checked)
- [ ] Dependencies installed (`install-dependencies.bat`)
- [ ] ngrok installed (if using automatic callbacks)
- [ ] ngrok authenticated (if using automatic callbacks)
- [ ] Google Drive API credentials configured
- [ ] n8n webhook URL configured

---

## 🎉 You're Ready!

Just double-click `start-all.bat` and you're good to go!

For detailed setup and usage instructions, see:
- **README.md** - Main documentation
- **QUICK-START.md** - Quick start guide
- **NGROK-SETUP.md** - ngrok setup guide
- **TESTING-GUIDE.md** - Testing procedures
- **N8N-SETUP.md** - n8n configuration

Happy automating! 🚀
