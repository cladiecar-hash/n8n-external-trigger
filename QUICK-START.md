# 🚀 Guida Rapida - Primo Avvio

## Metodo Semplice: Doppio Click

### Opzione A: Con Script di Avvio

**Su Windows:**
1. Doppio click su `start-server.bat`
2. Si aprirà una finestra con il server
3. Apri il browser e vai su: `http://localhost:8000`

**Su Mac/Linux:**
1. Doppio click su `start-server.sh`
   (oppure da terminale: `./start-server.sh`)
2. Apri il browser e vai su: `http://localhost:8000`

### Opzione B: Apertura Diretta

1. Doppio click su `index.html`
2. Si apre nel browser

⚠️ Se hai problemi con l'autenticazione Google, usa l'Opzione A.

---

## Metodo Manuale: Da Terminale/Prompt

### Windows (PowerShell o CMD):
```cmd
cd percorso\della\cartella
python -m http.server 8000
```

### Mac/Linux (Terminale):
```bash
cd /percorso/della/cartella
python3 -m http.server 8000
```

Poi apri il browser su: **http://localhost:8000**

---

## ❓ Non hai Python?

### Scarica Python:
- **Windows/Mac**: https://www.python.org/downloads/
  - Durante l'installazione Windows: spunta "Add Python to PATH"

### Alternative senza Python:

**1. Con Node.js (se già installato):**
```bash
npx http-server -p 8000
```

**2. Con PHP (se già installato):**
```bash
php -S localhost:8000
```

**3. Con estensione Visual Studio Code:**
- Installa "Live Server" extension
- Click destro su `index.html` → "Open with Live Server"

**4. Apertura diretta:**
- Doppio click su `index.html`
- Funziona ma potrebbe avere limitazioni

---

## 🔑 Prima Configurazione (una volta aperta l'app)

1. **Ottieni credenziali Google:**
   - Vai su https://console.cloud.google.com/
   - Crea un progetto
   - Abilita "Google Drive API"
   - Crea credenziali (API Key + OAuth Client ID)
   - [Istruzioni dettagliate nel README.md]

2. **Configura il webhook n8n:**
   - Crea un workflow in n8n con un nodo Webhook
   - Copia l'URL del webhook

3. **Nell'app:**
   - Inserisci Client ID
   - Inserisci API Key
   - Inserisci URL webhook
   - Clicca "Salva Configurazione"

4. **Autorizza Google Drive:**
   - Clicca "Connetti a Google Drive"
   - Autorizza l'accesso

5. **Usa l'app:**
   - Cerca un file PDF
   - Selezionalo
   - Inserisci codice PBS (es: PBS12345)
   - Clicca "Invia a n8n Webhook"

---

## 🆘 Problemi Comuni

**"Nessun file trovato"**
- Assicurati di avere PDF nel tuo Google Drive
- Prova a cercare senza filtri

**"Errore di autenticazione"**
- Verifica che le credenziali siano corrette
- Controlla che l'URI di reindirizzamento OAuth includa `http://localhost:8000`

**"Errore CORS" o "file://"**
- Non stai usando un server locale
- Usa uno degli script di avvio o i metodi da terminale

**Il server non parte**
- Python non è installato
- Prova le alternative (Node.js, PHP, VS Code)
- O apri direttamente index.html

---

## 📖 Documentazione Completa

Per istruzioni dettagliate su:
- Setup Google Cloud
- Configurazione n8n
- Troubleshooting avanzato

Leggi: **README.md**
