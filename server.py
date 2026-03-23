#!/usr/bin/env python3
"""
Flask server for Google Drive PDF Webhook App
Handles callbacks from n8n and serves the HTML application
"""

from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from datetime import datetime
import json
import os
import requests

app = Flask(__name__)
CORS(app)

# Store callback results in memory (in production, use Redis or database)
callback_results = {}
validation_results = {}

# Serve static files
@app.route('/')
def index():
    return send_from_directory('.', 'app-v2.html')

@app.route('/<path:path>')
def serve_static(path):
    return send_from_directory('.', path)

# Callback endpoint for n8n
@app.route('/api/callback', methods=['POST'])
def receive_callback():
    """
    Receives callback from n8n after processing
    Expected payload:
    {
        "jobId": "20251108_042444_817453",
        "url": "https://supabase.co/storage/v1/object/public/...",
        "fileName": "PBS-123.pdf",
        "items": 42,
        "durationSec": 245.3,
        "callbackToken": "optional-token"
    }
    """
    try:
        data = request.get_json()

        # Validate required fields
        if not data or 'jobId' not in data:
            return jsonify({'error': 'Missing jobId'}), 400

        job_id = data['jobId']

        # Optional: Validate callback token if you want security
        # expected_token = "your-secret-token"
        # if data.get('callbackToken') != expected_token:
        #     return jsonify({'error': 'Invalid token'}), 401

        # Store the result
        callback_results[job_id] = {
            'jobId': job_id,
            'url': data.get('url'),
            'fileName': data.get('fileName'),
            'items': data.get('items'),
            'durationSec': data.get('durationSec'),
            'receivedAt': datetime.now().isoformat(),
            'status': 'ready'
        }

        print(f"✅ Callback received for job {job_id}")
        print(f"   URL: {data.get('url')}")
        print(f"   Items: {data.get('items')}")

        return jsonify({
            'success': True,
            'message': 'Callback received',
            'jobId': job_id
        }), 200

    except Exception as e:
        print(f"❌ Error processing callback: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Validation callback endpoint
@app.route('/api/validation-callback', methods=['POST'])
def receive_validation_callback():
    """
    Receives callback from n8n after validation processing
    Expected payload:
    {
        "jobId": "20251108_042444_817453",
        "status": "success",
        "message": "Validation completed",
        "itemsProcessed": 42
    }
    """
    try:
        data = request.get_json()

        if not data or 'jobId' not in data:
            return jsonify({'error': 'Missing jobId'}), 400

        job_id = data['jobId']

        # Store validation result
        validation_results[job_id] = {
            'jobId': job_id,
            'status': data.get('status', 'success'),
            'message': data.get('message', 'Validation completed'),
            'itemsProcessed': data.get('itemsProcessed'),
            'receivedAt': datetime.now().isoformat()
        }

        print(f"✅ Validation callback received for job {job_id}")
        print(f"   Status: {data.get('status')}")
        print(f"   Items: {data.get('itemsProcessed')}")

        return jsonify({
            'success': True,
            'message': 'Validation callback received',
            'jobId': job_id
        }), 200

    except Exception as e:
        print(f"❌ Error processing validation callback: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Poll endpoint for HTML app
@app.route('/api/result/<job_id>', methods=['GET'])
def get_result(job_id):
    """
    Allows HTML app to poll for results
    Returns the callback data if available
    """
    if job_id in callback_results:
        result = callback_results[job_id]
        # Optional: Remove after retrieval to save memory
        # del callback_results[job_id]
        return jsonify(result), 200
    else:
        return jsonify({
            'status': 'processing',
            'message': 'Result not ready yet'
        }), 202

# Poll endpoint for validation results
@app.route('/api/validation-result/<job_id>', methods=['GET'])
def get_validation_result(job_id):
    """
    Allows HTML app to poll for validation results
    """
    if job_id in validation_results:
        result = validation_results[job_id]
        return jsonify(result), 200
    else:
        return jsonify({
            'status': 'processing',
            'message': 'Validation result not ready yet'
        }), 202

# List all results (for debugging)
@app.route('/api/results', methods=['GET'])
def list_results():
    """Debug endpoint to see all stored results"""
    return jsonify({
        'count': len(callback_results),
        'results': list(callback_results.values())
    }), 200

# Proxy endpoint for n8n webhooks (solves CORS issues)
@app.route('/api/proxy-webhook', methods=['POST'])
def proxy_webhook():
    """
    Proxy endpoint to forward requests to n8n webhooks
    Solves CORS issues by making the request server-side

    Expected payload:
    {
        "webhookUrl": "https://n8n-instance/webhook/...",
        "data": { ... } // The actual payload to send to n8n
    }
    """
    try:
        payload = request.get_json()

        if not payload or 'webhookUrl' not in payload:
            return jsonify({'error': 'Missing webhookUrl'}), 400

        if 'data' not in payload:
            return jsonify({'error': 'Missing data'}), 400

        webhook_url = payload['webhookUrl']
        webhook_data = payload['data']

        # Make the request to n8n webhook
        print(f"📤 Proxying request to: {webhook_url}")

        response = requests.post(
            webhook_url,
            json=webhook_data,
            headers={'Content-Type': 'application/json'},
            timeout=30  # 30 second timeout
        )

        print(f"✅ n8n response: {response.status_code}")

        # Forward the response back to the client
        try:
            response_data = response.json()
        except:
            response_data = {'message': response.text}

        return jsonify({
            'success': response.ok,
            'status': response.status_code,
            'data': response_data
        }), response.status_code

    except requests.RequestException as e:
        print(f"❌ Error proxying to n8n: {str(e)}")
        return jsonify({
            'error': 'Failed to reach n8n webhook',
            'details': str(e)
        }), 502

    except Exception as e:
        print(f"❌ Error processing proxy request: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Health check
@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'healthy',
        'timestamp': datetime.now().isoformat(),
        'activeJobs': len(callback_results)
    }), 200

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    print(f"""
╔═══════════════════════════════════════════════════════════════════╗
║  🚀 Google Drive PDF Webhook Server                              ║
╠═══════════════════════════════════════════════════════════════════╣
║  Server running on: http://localhost:{port}                        ║
║                                                                   ║
║  📥 Extraction Callback:  http://localhost:{port}/api/callback     ║
║  📤 Validation Callback:  http://localhost:{port}/api/validation-callback ║
║  📊 Results Endpoint:     http://localhost:{port}/api/result/      ║
║  ✅ Validation Results:   http://localhost:{port}/api/validation-result/ ║
║                                                                   ║
║  📝 Ready to receive callbacks from n8n!                          ║
╚═══════════════════════════════════════════════════════════════════╝
    """)

    # Run with debug mode for development
    # In production, use gunicorn or waitress
    app.run(host='0.0.0.0', port=port, debug=True)
