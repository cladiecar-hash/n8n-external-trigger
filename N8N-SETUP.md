# 🔗 Configurazione Webhook n8n - Guida Completa

## 📋 Setup Base Webhook

### Step 1: Crea un Nuovo Workflow

1. Apri la tua istanza n8n
2. Clicca **"+ New workflow"** (o "+ Nuovo workflow")
3. Dai un nome al workflow: `Google Drive PDF Trigger`

---

### Step 2: Aggiungi Nodo Webhook

1. Clicca sul **"+"** per aggiungere un nodo
2. Cerca: **"Webhook"**
3. Seleziona il nodo **"Webhook"**

---

### Step 3: Configura il Webhook

Nel nodo Webhook, configura:

**Authentication**: `None` (o configura come preferisci)

**HTTP Method**: `POST`

**Path**: `google-drive-pdf` (o quello che preferisci)

**Respond**:
- Modo: `Immediately`
- Response Code: `200`

**Options** (opzionale):
- Response Data: `First Entry JSON`

---

### Step 4: Copia l'URL del Webhook

1. **Clicca su "Execute Node"** (o "Esegui nodo") nel webhook
2. Il webhook si attiverà e vedrai l'URL in attesa
3. **Copia l'URL** (qualcosa tipo):
   ```
   https://your-n8n-instance.com/webhook/google-drive-pdf
   ```
4. Incolla questo URL nell'app web (campo "URL Webhook n8n")

---

## 🎯 Workflow Completo Esempio

Ecco un workflow completo che:
1. Riceve il webhook
2. Scarica il file da Google Drive
3. Salva il file su disco
4. Risponde all'app

### Workflow Struttura:

```
[Webhook] → [Google Drive] → [Write Binary File] → [Respond to Webhook]
```

---

### 1️⃣ Nodo: Webhook (già configurato sopra)

Riceve:
```json
{
  "fileId": "1abc...xyz",
  "pbsCode": "PBS-123_TEST"
}
```

---

### 2️⃣ Nodo: Google Drive - Download File

**Nodo**: Aggiungi nodo **"Google Drive"**

**Configurazione**:
- **Resource**: `File`
- **Operation**: `Download`
- **File ID**: `{{ $json.fileId }}` ← Usa il fileId dal webhook
- **Options**:
  - Binary Property: `data` (default)

**Credenziali**: Dovrai autenticare n8n con Google Drive
- Clicca su "Create New Credential"
- Segui la procedura OAuth per autorizzare n8n

**Output**: Il file PDF scaricato come dati binari

---

### 3️⃣ Nodo: Write Binary File (Opzionale)

**Nodo**: Aggiungi nodo **"Write Binary File"**

**Configurazione**:
- **File Name**: `{{ $node["Webhook"].json["pbsCode"] }}.pdf`
  - Oppure: `/path/to/save/{{ $json.pbsCode }}.pdf`
- **Binary Property**: `data`
- **Options**:
  - Create Folders: `true` (crea cartelle se non esistono)

Questo salva il PDF su disco con il nome del codice PBS.

---

### 4️⃣ Nodo: Respond to Webhook

**Nodo**: Aggiungi nodo **"Respond to Webhook"**

**Configurazione**:
- **Response Data Source**: `Define Below`
- **Response Body**:
  ```json
  {
    "success": true,
    "message": "File ricevuto e salvato",
    "pbsCode": "={{ $node['Webhook'].json['pbsCode'] }}",
    "fileId": "={{ $node['Webhook'].json['fileId'] }}"
  }
  ```

Questo invia una risposta all'app confermando la ricezione.

---

## 🔄 Workflow Alternativo: Con Database

Se vuoi salvare i dati in un database invece di scaricare il file:

```
[Webhook] → [Database] → [Respond to Webhook]
```

### Nodo Database (esempio con Postgres/MySQL/Airtable)

**Esempio con Postgres**:

**Nodo**: **"Postgres"**

**Configurazione**:
- **Operation**: `Insert`
- **Table**: `pdf_files`
- **Columns**:
  ```
  file_id: {{ $json.fileId }}
  pbs_code: {{ $json.pbsCode }}
  created_at: {{ $now }}
  status: pending
  ```

Poi puoi avere un workflow separato che processa i file in background.

---

## 🚀 Workflow Avanzato: Completo

Un workflow più completo potrebbe essere:

```
[Webhook]
   ↓
[Google Drive - Download File]
   ↓
[Write Binary File]
   ↓
[Split into branches]
   ├→ [Database - Save Record]
   ├→ [Send Email Notification]
   └→ [Process PDF with AI/OCR]
   ↓
[Respond to Webhook]
```

---

## 📝 Esempio JSON Workflow n8n (Importabile)

Salva questo in un file `.json` e importalo in n8n:

```json
{
  "name": "Google Drive PDF Webhook Handler",
  "nodes": [
    {
      "parameters": {
        "httpMethod": "POST",
        "path": "google-drive-pdf",
        "responseMode": "responseNode",
        "options": {}
      },
      "id": "webhook-1",
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "typeVersion": 1,
      "position": [250, 300]
    },
    {
      "parameters": {
        "authentication": "oAuth2",
        "resource": "file",
        "operation": "download",
        "fileId": "={{ $json.fileId }}",
        "options": {}
      },
      "id": "google-drive-1",
      "name": "Google Drive",
      "type": "n8n-nodes-base.googleDrive",
      "typeVersion": 3,
      "position": [450, 300],
      "credentials": {
        "googleDriveOAuth2Api": {
          "id": "1",
          "name": "Google Drive account"
        }
      }
    },
    {
      "parameters": {
        "fileName": "=/tmp/pdfs/{{ $node['Webhook'].json['pbsCode'] }}.pdf",
        "options": {}
      },
      "id": "write-file-1",
      "name": "Write Binary File",
      "type": "n8n-nodes-base.writeBinaryFile",
      "typeVersion": 1,
      "position": [650, 300]
    },
    {
      "parameters": {
        "respondWith": "json",
        "responseBody": "={{ { \"success\": true, \"message\": \"File ricevuto e salvato\", \"pbsCode\": $node['Webhook'].json['pbsCode'], \"fileId\": $node['Webhook'].json['fileId'] } }}"
      },
      "id": "respond-1",
      "name": "Respond to Webhook",
      "type": "n8n-nodes-base.respondToWebhook",
      "typeVersion": 1,
      "position": [850, 300]
    }
  ],
  "connections": {
    "Webhook": {
      "main": [
        [
          {
            "node": "Google Drive",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Google Drive": {
      "main": [
        [
          {
            "node": "Write Binary File",
            "type": "main",
            "index": 0
          }
        ]
      ]
    },
    "Write Binary File": {
      "main": [
        [
          {
            "node": "Respond to Webhook",
            "type": "main",
            "index": 0
          }
        ]
      ]
    }
  },
  "pinData": {}
}
```

---

## 🔧 Setup Google Drive in n8n

Per permettere a n8n di scaricare file da Google Drive:

### Step 1: Crea Credenziali Google in n8n

1. In n8n, vai su **"Credentials"** (menu laterale)
2. Clicca **"+ Add Credential"**
3. Cerca: **"Google Drive OAuth2 API"**
4. Clicca per creare

### Step 2: Configura OAuth

Ti serviranno:
- **Client ID** (dallo stesso progetto Google Cloud dell'app)
- **Client Secret** (lo trovi nelle credenziali OAuth su Google Cloud)

**Come ottenere il Client Secret**:
1. Vai su: https://console.cloud.google.com/apis/credentials
2. Clicca sul tuo OAuth Client ID
3. Vedrai sia **Client ID** che **Client Secret**
4. Copialo

### Step 3: Autorizza in n8n

1. Inserisci Client ID e Client Secret in n8n
2. Clicca **"Sign in with Google"**
3. Autorizza l'accesso
4. Salva le credenziali

### Step 4: Usa le Credenziali

Nel nodo "Google Drive", seleziona le credenziali appena create.

---

## ✅ Test del Workflow

### Test 1: Test Manuale

1. Nel nodo Webhook, clicca **"Listen for Test Event"**
2. Nell'app web, invia un file PDF
3. Il webhook riceverà i dati
4. Clicca **"Execute Workflow"** in n8n
5. Verifica che il file venga scaricato e salvato

### Test 2: Test con Webhook Attivo

1. **Attiva il workflow** (interruttore in alto a destra)
2. Nell'app web, invia un file PDF
3. Il workflow si eseguirà automaticamente
4. Controlla i log di esecuzione in n8n

---

## 🐛 Troubleshooting n8n

### Errore: "File not found" o 403

**Problema**: n8n non ha accesso al file su Google Drive

**Soluzione**:
1. Verifica che le credenziali Google Drive in n8n siano dello stesso account che ha accesso ai file
2. Riautorizza le credenziali in n8n
3. Assicurati che lo scope includa `drive.readonly`

### Errore: "Invalid fileId"

**Problema**: Il fileId non è valido o il formato è errato

**Soluzione**:
1. Nell'app, verifica che il file sia selezionato correttamente
2. Controlla i dati ricevuti dal webhook (tab "Executions" in n8n)
3. Verifica che `{{ $json.fileId }}` sia corretto nel nodo Google Drive

### Webhook non riceve dati

**Problema**: L'app non riesce a raggiungere il webhook

**Soluzione**:
1. Verifica che l'URL webhook sia corretto nell'app
2. Controlla che n8n sia raggiungibile dall'esterno
3. Verifica CORS se n8n è su dominio diverso
4. Controlla i log del browser (F12 → Console)

### File non viene salvato

**Problema**: Permessi di scrittura o path errato

**Soluzione**:
1. Verifica che il path nel nodo "Write Binary File" sia valido
2. Controlla i permessi della cartella di destinazione
3. Usa un path assoluto (es: `/tmp/pdfs/...`)

---

## 💡 Best Practices

1. **Attiva il workflow** dopo averlo testato
2. **Monitora le esecuzioni** regolarmente
3. **Gestisci gli errori** con nodi "Error Trigger"
4. **Log importante**: Salva i dati in database per tracciabilità
5. **Notifiche**: Aggiungi notifiche email/Slack in caso di errore

---

## 🎯 Quick Start (TL;DR)

1. Crea workflow in n8n
2. Aggiungi nodo **Webhook** (POST, path: `google-drive-pdf`)
3. Copia URL webhook → Incollalo nell'app
4. Aggiungi nodo **Google Drive** (Download, fileId: `{{ $json.fileId }}`)
5. Configura credenziali Google Drive in n8n
6. Aggiungi nodo **Respond to Webhook**
7. Connetti i nodi
8. Attiva il workflow
9. Testa dall'app web!

---

## 📞 Hai bisogno di aiuto?

Se hai problemi con la configurazione n8n, dimmi:
- Quale nodo ti dà problemi?
- Che errore vedi?
- Hai già configurato Google Drive in n8n?

Sono qui per aiutarti! 😊
