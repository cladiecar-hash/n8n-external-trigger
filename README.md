# 📄 Google Drive PDF to n8n Webhook

Applicazione web per inviare file PDF da Google Drive a un webhook n8n con codice PBS alfanumerico associato.

## ✨ Caratteristiche

- 🔐 Autenticazione OAuth2 con Google Drive
- 💾 Salvataggio sicuro delle credenziali nel browser (localStorage)
- ✏️ Modifica delle credenziali dopo il primo inserimento
- 📁 Navigazione e ricerca di cartelle in Google Drive
- 🔍 Ricerca e selezione di file PDF
- 🏷️ Associazione di codice PBS alfanumerico ai file
- 📤 Invio automatico al webhook n8n
- 🎨 Interfaccia utente moderna e responsive

## 📋 Prerequisiti

1. **Google Cloud Project** con Google Drive API abilitata
2. **Credenziali OAuth 2.0** (Client ID e API Key)
3. **Webhook n8n** configurato e funzionante

## 🚀 Setup Google Cloud Project

### Passo 1: Creare un Progetto Google Cloud

1. Vai su [Google Cloud Console](https://console.cloud.google.com/)
2. Clicca su "Nuovo Progetto"
3. Inserisci un nome per il progetto (es: "n8n-drive-integration")
4. Clicca "Crea"

### Passo 2: Abilitare Google Drive API

1. Nel tuo progetto, vai su **API e Servizi** > **Libreria**
2. Cerca "Google Drive API"
3. Clicca su "Google Drive API"
4. Clicca "Abilita"

### Passo 3: Creare le Credenziali

#### Creare API Key:

1. Vai su **API e Servizi** > **Credenziali**
2. Clicca su "+ CREA CREDENZIALI"
3. Seleziona "Chiave API"
4. Copia la chiave API generata (la userai nell'applicazione)
5. (Opzionale) Clicca su "Limita chiave" per configurare le restrizioni:
   - In "Restrizioni per le applicazioni" seleziona "Referrer HTTP"
   - Aggiungi il tuo dominio (es: `http://localhost:*` per test locali)
   - In "Restrizioni API" seleziona "Google Drive API"
6. Salva

#### Creare OAuth 2.0 Client ID:

1. Vai su **API e Servizi** > **Credenziali**
2. Clicca su "+ CREA CREDENZIALI"
3. Seleziona "ID client OAuth"
4. Se richiesto, configura la schermata di consenso OAuth:
   - Tipo di applicazione: **Esterna**
   - Nome applicazione: (es: "Google Drive PDF Sender")
   - Email di supporto: la tua email
   - Ambiti: aggiungi `https://www.googleapis.com/auth/drive.readonly`
   - Aggiungi utenti di test (se in modalità test)
   - Salva
5. Torna a creare le credenziali:
   - Tipo di applicazione: **Applicazione web**
   - Nome: (es: "Web Client")
   - URI di reindirizzamento autorizzati: aggiungi l'URL della tua app
     - Per test locale: `http://localhost:8000`
     - Per produzione: il tuo dominio
6. Clicca "Crea"
7. Copia il **Client ID** (lo userai nell'applicazione)

### Passo 4: Configurare la Schermata di Consenso OAuth

1. Vai su **API e Servizi** > **Schermata consenso OAuth**
2. Compila i campi obbligatori:
   - Nome applicazione
   - Email di supporto
   - Logo (opzionale)
3. Nella sezione "Ambiti", clicca "AGGIUNGI O RIMUOVI AMBITI"
4. Cerca e seleziona: `https://www.googleapis.com/auth/drive.readonly`
5. Salva e continua
6. Aggiungi utenti di test (se in modalità test)
7. Salva

## 🛠️ Setup n8n Webhook

### Creare un Workflow n8n

1. Apri la tua istanza n8n
2. Crea un nuovo workflow
3. Aggiungi un nodo **Webhook**
4. Configura il Webhook:
   - **HTTP Method**: POST
   - **Path**: scegli un percorso (es: `google-drive-pdf`)
   - **Authentication**: None (o configura secondo le tue esigenze)
5. Copia l'URL del webhook (es: `https://your-n8n.com/webhook/google-drive-pdf`)

### Esempio di Workflow n8n

Il webhook riceverà un payload JSON semplice con questi dati:

```json
{
  "fileId": "1abc...xyz",
  "pbsCode": "PBS-12345_ABC"
}
```

**Nota**: L'applicazione invia solo l'ID del file Google Drive e il codice PBS. Il tuo workflow n8n può poi utilizzare il `fileId` per scaricare il file direttamente da Google Drive quando necessario, utilizzando il nodo "Google Drive" di n8n.

Vantaggi di questo approccio:
- ⚡ Invio molto più veloce (non scarica il file intero)
- 💾 Meno dati da trasferire
- 🔄 n8n può scaricare il file on-demand
- 🔐 Maggiore sicurezza (file rimane su Google Drive)

## 💻 Installazione e Uso

### Metodo 1: Apertura Diretta (Locale)

1. Scarica tutti i file del progetto:
   - `index.html`
   - `styles.css`
   - `app.js`

2. Apri `index.html` direttamente nel browser

   **⚠️ IMPORTANTE**: Alcune funzionalità potrebbero non funzionare con il protocollo `file://`. È consigliato usare un server HTTP locale.

### Metodo 2: Server HTTP Locale (Consigliato)

#### Usando Python:

```bash
# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000
```

#### Usando Node.js (http-server):

```bash
# Installa http-server
npm install -g http-server

# Avvia il server
http-server -p 8000
```

#### Usando PHP:

```bash
php -S localhost:8000
```

3. Apri il browser e vai su: `http://localhost:8000`

### Metodo 3: Deploy su Hosting

Puoi fare il deploy su qualsiasi hosting web statico:
- GitHub Pages
- Netlify
- Vercel
- Firebase Hosting
- ecc.

## 📖 Guida all'Uso

### Prima Configurazione

1. Apri l'applicazione nel browser
2. Nella sezione **"Configurazione Google Drive API"**:
   - Inserisci il **Google Client ID** (ottenuto nel setup)
   - Inserisci la **Google API Key** (ottenuta nel setup)
   - Inserisci l'**URL del Webhook n8n**
3. Clicca su **"Salva Configurazione"**

Le credenziali verranno salvate nel localStorage del browser.

### Autenticazione Google Drive

1. Nella sezione **"Autenticazione Google Drive"**
2. Clicca su **"Connetti a Google Drive"**
3. Autorizza l'applicazione ad accedere al tuo Google Drive (sola lettura)
4. Dopo l'autorizzazione, vedrai il messaggio "Autenticato con successo"

### Selezione File PDF

1. (Opzionale) Cerca una cartella specifica:
   - Inserisci il nome della cartella nel campo "Cerca Cartella"
   - Clicca "Cerca"
   - Clicca sulla cartella per visualizzare i suoi file

2. Cerca file PDF:
   - (Opzionale) Inserisci un termine di ricerca nel campo "Cerca File PDF"
   - Clicca "Cerca PDF"
   - Verranno mostrati tutti i file PDF trovati

3. Clicca sul file PDF che vuoi inviare

### Invio al Webhook

1. Inserisci il **Codice PBS** (alfanumerico, es: PBS12345ABC)
2. Clicca su **"Invia a n8n Webhook"**
3. Attendi il completamento (verrà mostrato lo stato di avanzamento)
4. Riceverai una conferma di invio riuscito

### Modifica Configurazione

1. Clicca su **"Modifica Configurazione"**
2. Modifica i campi che desideri
3. Clicca su **"Salva Configurazione"**
4. Riconnettiti a Google Drive

### Reset Completo

- Clicca su **"Reset Completo Applicazione"** in fondo alla pagina
- Conferma l'operazione
- Tutte le configurazioni salvate verranno eliminate

## 🔒 Sicurezza

- Le credenziali sono salvate nel **localStorage** del browser (client-side)
- L'applicazione richiede solo accesso **read-only** a Google Drive
- Il file PDF viene convertito in base64 per l'invio al webhook
- **NON** salvare credenziali sensibili nel codice sorgente
- Usa HTTPS in produzione per proteggere le comunicazioni

## 🐛 Troubleshooting

### Errore: "Google API non inizializzata"
- Verifica che Client ID e API Key siano corretti
- Controlla che l'API Google Drive sia abilitata nel progetto
- Ricarica la pagina

### Errore: "Autorizzazione negata"
- Verifica che l'URI di reindirizzamento sia configurato correttamente nelle credenziali OAuth
- Assicurati di aver aggiunto il tuo account come "utente di test" se l'app è in modalità test

### Errore: "Nessun file trovato"
- Verifica di avere file PDF nel tuo Google Drive
- Controlla che i file non siano nel cestino
- Prova a cercare senza filtri

### Errore nell'invio al webhook
- Verifica che l'URL del webhook sia corretto
- Controlla che il webhook n8n sia attivo e raggiungibile
- Verifica i log di n8n per dettagli sull'errore
- Controlla CORS se il webhook è su un dominio diverso

### CORS Error
Se ricevi errori CORS, assicurati che il webhook n8n accetti richieste dal tuo dominio:
1. In n8n, nelle impostazioni del nodo Webhook
2. Aggiungi l'header CORS appropriato

## 📝 Formato Dati Inviati al Webhook

```json
{
  "fileId": "string (ID del file su Google Drive)",
  "pbsCode": "string (codice PBS con lettere, numeri, - e _)"
}
```

**Esempio reale**:
```json
{
  "fileId": "1a2b3c4d5e6f7g8h9i0j",
  "pbsCode": "PBS-12345_TEST"
}
```

Il workflow n8n può utilizzare il `fileId` per scaricare il file da Google Drive usando il nodo "Google Drive" con l'operazione "Download File".

## 🎨 Personalizzazione

Puoi personalizzare l'aspetto modificando il file `styles.css`:
- Colori del tema
- Font
- Spaziature
- Layout responsive

## 📜 Licenza

Questo progetto è fornito "così com'è" senza alcuna garanzia.

## 🤝 Supporto

Per problemi o domande:
1. Controlla la sezione Troubleshooting
2. Verifica la console del browser per errori
3. Controlla i log del webhook n8n

## 🔄 Versione

**v1.0.0** - Prima release
- Autenticazione Google Drive OAuth2
- Selezione e invio file PDF
- Gestione credenziali
- Codice PBS alfanumerico
- Integrazione webhook n8n
