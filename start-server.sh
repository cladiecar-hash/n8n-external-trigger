#!/bin/bash

echo "🚀 Avvio Server per Google Drive PDF App..."
echo ""
echo "📂 Cartella: $(pwd)"
echo ""

# Verifica se Python 3 è disponibile
if command -v python3 &> /dev/null; then
    echo "✓ Python 3 trovato"
    echo "🌐 Apertura server su http://localhost:8000"
    echo ""
    echo "👉 Apri il browser e vai su: http://localhost:8000"
    echo ""
    echo "⏹️  Per fermare il server: premi CTRL+C"
    echo ""
    python3 -m http.server 8000
elif command -v python &> /dev/null; then
    echo "✓ Python trovato"
    echo "🌐 Apertura server su http://localhost:8000"
    echo ""
    echo "👉 Apri il browser e vai su: http://localhost:8000"
    echo ""
    echo "⏹️  Per fermare il server: premi CTRL+C"
    echo ""
    python -m SimpleHTTPServer 8000
else
    echo "❌ Python non trovato"
    echo ""
    echo "Opzioni alternative:"
    echo "1. Installa Python da https://www.python.org/"
    echo "2. Apri index.html direttamente con doppio click"
    echo "3. Usa un altro server locale (Node.js, PHP, ecc.)"
fi
