# 🧪 Testing Guide - Callback System

## Quick Test Procedure

### 1. Start the Flask Server

```bash
cd /home/user/n8n-external-trigger
python3 server.py
```

Expected output:
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

---

### 2. Test Health Endpoint

In a new terminal:

```bash
curl http://localhost:8000/api/health
```

Expected:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-08T12:34:56.789",
  "activeJobs": 0
}
```

---

### 3. Test Callback Endpoint (Manual)

Simulate n8n sending a callback:

```bash
curl -X POST http://localhost:8000/api/callback \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "test-job-123",
    "url": "https://example.com/test.json",
    "fileName": "test-file.pdf",
    "items": 10,
    "durationSec": 123.5,
    "callbackToken": "optional-token"
  }'
```

Expected response:
```json
{
  "success": true,
  "message": "Callback received",
  "jobId": "test-job-123"
}
```

Flask server logs should show:
```
✅ Callback received for job test-job-123
   URL: https://example.com/test.json
   Items: 10
```

---

### 4. Test Result Retrieval

Poll for the result you just sent:

```bash
curl http://localhost:8000/api/result/test-job-123
```

Expected:
```json
{
  "jobId": "test-job-123",
  "url": "https://example.com/test.json",
  "fileName": "test-file.pdf",
  "items": 10,
  "durationSec": 123.5,
  "receivedAt": "2025-11-08T12:35:00.123",
  "status": "ready"
}
```

---

### 5. Test App Integration (Without n8n)

1. Open browser: `http://localhost:8000`
2. Go to **Settings** ⚙️
3. Configure:
   - **Callback URL**: `http://localhost:8000/api/callback`
   - **Callback Token**: `test-token-123`
4. Save configuration
5. Connect to Google Drive
6. Go back to main page
7. Select a PDF file
8. Enter PBS code: `TEST-123`
9. Click **Send to n8n Webhook**

Expected behavior:
- "Job Submitted Successfully!" message
- Results card appears with "Processing" badge
- App starts polling (check browser console: F12)

Then manually trigger a callback:

```bash
# Replace JOB_ID with the actual jobId shown in the app
curl -X POST http://localhost:8000/api/callback \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "20251108_123456_789",
    "url": "https://jsonplaceholder.typicode.com/todos/1",
    "fileName": "TEST-123.pdf",
    "items": 5,
    "durationSec": 10.5
  }'
```

The app should:
- Stop polling
- Show "Ready" badge (green)
- Display the JSON data
- Allow download/validation

---

### 6. Test with ngrok

Follow **NGROK-SETUP.md** for full ngrok setup.

Quick test with ngrok:

```bash
# Terminal 1: Flask server
python3 server.py

# Terminal 2: ngrok
ngrok http 8000

# Copy the HTTPS URL, e.g., https://abc123.ngrok-free.app

# Terminal 3: Test callback
curl -X POST https://abc123.ngrok-free.app/api/callback \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "ngrok-test-123",
    "url": "https://example.com/test.json",
    "fileName": "ngrok-test.pdf"
  }'
```

Check ngrok web interface: http://127.0.0.1:4040

---

## Full End-to-End Test with n8n

### Prerequisites

1. Flask server running
2. ngrok running and URL configured in app
3. n8n workflow configured

### Test Steps

1. **Open app**: http://localhost:8000
2. **Select PDF** from Google Drive
3. **Enter PBS code**: `E2E-TEST-001`
4. **Click "Send to n8n Webhook"**

Expected:
- ✅ 202 Accepted response
- ✅ Job ID displayed
- ✅ "Processing" badge appears
- ✅ App starts polling (every 5 seconds)

5. **Wait for n8n to process** (~4 minutes)

n8n should:
- ✅ Download PDF from Google Drive
- ✅ Process with AI/OCR
- ✅ Upload JSON to Supabase
- ✅ POST callback to ngrok URL

6. **App receives callback automatically**

Expected:
- ✅ Polling stops
- ✅ "Ready" badge appears
- ✅ JSON data displayed
- ✅ Can download/validate JSON

---

## Troubleshooting Tests

### Test 1: Server won't start

**Error**: `Address already in use`

**Solution**:
```bash
# Find what's using port 8000
lsof -i :8000

# Kill the process
kill -9 <PID>

# Or use a different port
PORT=8001 python3 server.py
```

---

### Test 2: Callback endpoint returns 404

**Check**:
- URL path is exactly `/api/callback` (with slash)
- POST method is used (not GET)
- Server is actually running

---

### Test 3: Result endpoint returns 202 instead of 200

**Reason**: Result not received yet

**Solutions**:
- Wait for n8n to send callback
- Or manually send callback (see test #3 above)

---

### Test 4: App not polling

**Check browser console (F12)**:

If you see errors:
- Make sure callback URL is configured in Settings
- Check that Flask server is running
- Verify URL is correct (including http:// or https://)

If you see `Starting to poll for job: ...`:
- ✅ Polling is working!
- Wait for callback or send manual callback

---

### Test 5: JSON fetch fails

**Error in browser**: `Failed to fetch JSON from URL`

**Possible causes**:
1. Supabase URL is invalid
2. CORS issues
3. File not publicly accessible

**Test the URL directly**:
```bash
curl https://YOUR-SUPABASE-URL/file.json
```

Should return valid JSON.

---

## Debugging Checklist

Before reporting issues, verify:

- [ ] Flask server is running
- [ ] No errors in Flask terminal
- [ ] Can access http://localhost:8000
- [ ] Health endpoint returns 200 OK
- [ ] Manual callback test works
- [ ] Browser console shows no errors
- [ ] Callback URL is configured in app
- [ ] ngrok is running (if using)
- [ ] ngrok web interface shows requests

---

## Performance Tests

### Test Concurrent Jobs

Send multiple PDFs quickly:

```bash
for i in {1..5}; do
  curl -X POST http://localhost:8000/api/callback \
    -H "Content-Type: application/json" \
    -d "{\"jobId\": \"job-$i\", \"url\": \"https://example.com/$i.json\"}"
done
```

Check all results:
```bash
curl http://localhost:8000/api/results
```

Expected:
```json
{
  "count": 5,
  "results": [
    {"jobId": "job-1", ...},
    {"jobId": "job-2", ...},
    ...
  ]
}
```

---

### Test Polling Performance

1. Send PDF to n8n
2. Open browser DevTools (F12) → Network tab
3. Filter by `/api/result/`
4. Watch polling requests

Expected:
- Request every ~5 seconds
- 202 status until result ready
- 200 status when ready
- Polling stops after receiving result

---

## Success Criteria

A fully working system should:

✅ **Server**:
- Starts without errors
- Health endpoint accessible
- Receives and stores callbacks
- Serves results via polling

✅ **App**:
- Loads successfully
- Connects to Google Drive
- Sends PDFs to n8n
- Shows processing status
- Polls for results
- Displays JSON when ready
- Allows download/validation

✅ **Integration**:
- n8n receives webhook
- n8n processes file
- n8n sends callback
- App receives callback
- User sees final JSON

---

## Next Steps After Testing

Once all tests pass:

1. Document your n8n workflow
2. Add error handling for edge cases
3. Consider adding:
   - Email notifications
   - Slack/Discord webhooks
   - Database persistence
   - User authentication
4. Deploy to production (replace localhost + ngrok)

Happy testing! 🧪
