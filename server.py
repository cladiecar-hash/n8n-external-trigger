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

app = Flask(__name__)
CORS(app)

# Store callback results in memory (in production, use Redis or database)
callback_results = {}

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

# List all results (for debugging)
@app.route('/api/results', methods=['GET'])
def list_results():
    """Debug endpoint to see all stored results"""
    return jsonify({
        'count': len(callback_results),
        'results': list(callback_results.values())
    }), 200

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
╔══════════════════════════════════════════════════════════╗
║  🚀 Google Drive PDF Webhook Server                     ║
╠══════════════════════════════════════════════════════════╣
║  Server running on: http://localhost:{port}               ║
║  Callback endpoint: http://localhost:{port}/api/callback  ║
║  Results endpoint:  http://localhost:{port}/api/result/   ║
║                                                          ║
║  📝 Ready to receive callbacks from n8n!                 ║
╚══════════════════════════════════════════════════════════╝
    """)

    # Run with debug mode for development
    # In production, use gunicorn or waitress
    app.run(host='0.0.0.0', port=port, debug=True)
