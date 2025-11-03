# 🔐 Guida Setup Google Cloud - Passo per Passo

## ⚠️ RISOLUZIONE ERRORE 404 GOOGLE

Se vedi "404. That's an error" da Google, significa che devi configurare le credenziali OAuth.

---

## 📋 PROCEDURA COMPLETA

### STEP 1: Crea Progetto Google Cloud

1. **Vai su**: https://console.cloud.google.com/
2. Clicca su **"Seleziona un progetto"** (in alto a sinistra)
3. Clicca **"NUOVO PROGETTO"**
4. Inserisci nome: `n8n-drive-pdf` (o come preferisci)
5. Clicca **"CREA"**
6. Attendi che il progetto venga creato
7. Seleziona il nuovo progetto dal menu a tendina

---

### STEP 2: Abilita Google Drive API

1. Nel menu laterale, vai su **"API e servizi"** → **"Libreria"**
2. Cerca: `Google Drive API`
3. Clicca su **"Google Drive API"**
4. Clicca **"ABILITA"**
5. Attendi l'abilitazione (circa 10 secondi)

---

### STEP 3: Configura Schermata Consenso OAuth

**IMPORTANTE: Fai questo PRIMA di creare le credenziali!**

1. Nel menu laterale: **"API e servizi"** → **"Schermata consenso OAuth"**
2. Seleziona: **"Esterni"**
3. Clicca **"CREA"**

4. **Pagina 1 - Informazioni app:**
   - Nome applicazione: `Google Drive PDF Sender`
   - Email supporto utenti: la tua email
   - Logo: lascia vuoto (opzionale)
   - Email sviluppatore: la tua email
   - Clicca **"SALVA E CONTINUA"**

5. **Pagina 2 - Ambiti:**
   - Clicca **"AGGIUNGI O RIMUOVI AMBITI"**
   - Cerca: `drive.readonly`
   - Seleziona: ✅ `.../auth/drive.readonly` (Visualizza i file di Google Drive)
   - Clicca **"AGGIORNA"**
   - Clicca **"SALVA E CONTINUA"**

6. **Pagina 3 - Utenti di test:**
   - Clicca **"+ ADD USERS"**
   - Inserisci la TUA email (quella del Google Drive da cui vuoi leggere i PDF)
   - Clicca **"AGGIUNGI"**
   - Clicca **"SALVA E CONTINUA"**

7. **Pagina 4 - Riepilogo:**
   - Controlla che tutto sia OK
   - Clicca **"TORNA ALLA DASHBOARD"**

---

### STEP 4: Crea API Key

1. Nel menu laterale: **"API e servizi"** → **"Credenziali"**
2. Clicca **"+ CREA CREDENZIALI"** (in alto)
3. Seleziona **"Chiave API"**
4. Copia la chiave generata (es: `AIzaSyA...`)
5. **SALVALA** in un posto sicuro (ti servirà dopo)
6. (Opzionale) Clicca **"LIMITA CHIAVE"**:
   - Nome: `Drive API Key`
   - Restrizioni API → Seleziona: **"Google Drive API"**
   - Clicca **"SALVA"**

---

### STEP 5: Crea OAuth 2.0 Client ID

1. Sempre in **"Credenziali"**
2. Clicca **"+ CREA CREDENZIALI"**
3. Seleziona **"ID client OAuth"**

4. **Tipo di applicazione**: **"Applicazione web"**

5. **Nome**: `Web Client`

6. **URI di reindirizzamento autorizzati** - IMPORTANTE!
   - Clicca **"+ Aggiungi URI"**
   - Inserisci ESATTAMENTE: `http://localhost:8000`
   - Se usi altra porta, cambia (es: `http://localhost:3000`)
   - Clicca **"+ Aggiungi URI"** di nuovo
   - Inserisci: `http://localhost:8000/` (con slash finale)

7. Clicca **"CREA"**

8. **COPIA le credenziali**:
   - **Client ID**: qualcosa tipo `123456789.apps.googleusercontent.com`
   - **SALVALO** (ti serve nell'app)
   - Puoi chiudere il popup (le credenziali restano visibili nella pagina)

---

### STEP 6: Inserisci le Credenziali nell'App

1. Torna alla tua app: `http://localhost:8000`
2. Ricarica la pagina (F5)
3. Nella sezione **"Configurazione Google Drive API"**:
   - **Google Client ID**: incolla quello copiato (`.apps.googleusercontent.com`)
   - **Google API Key**: incolla quella copiata (`AIzaSy...`)
   - **URL Webhook n8n**: inserisci l'URL del tuo webhook n8n
4. Clicca **"Salva Configurazione"**

---

### STEP 7: Connettiti a Google Drive

1. Clicca **"Connetti a Google Drive"**
2. Si aprirà un popup di Google
3. Seleziona il tuo account Google
4. Ti dirà che l'app non è verificata → Clicca **"Avanzate"**
5. Clicca **"Vai a Google Drive PDF Sender (non sicuro)"**
6. Leggi i permessi richiesti (solo lettura Drive)
7. Clicca **"Continua"**
8. ✅ Fatto! Ora sei connesso

---

## 🎯 Riepilogo Veloce

**Link importanti:**
- Google Cloud Console: https://console.cloud.google.com/
- Vai direttamente ad API: https://console.cloud.google.com/apis/dashboard
- Vai a Credenziali: https://console.cloud.google.com/apis/credentials

**Cosa ti serve:**
1. ✅ Progetto creato
2. ✅ Google Drive API abilitata
3. ✅ Schermata consenso configurata
4. ✅ API Key copiata
5. ✅ OAuth Client ID copiato
6. ✅ URI di reindirizzamento: `http://localhost:8000`

---

## ❓ Problemi Comuni

**"404 That's an error"**
→ L'URI di reindirizzamento non include `http://localhost:8000`
→ Vai in Credenziali → Modifica OAuth Client ID → Aggiungi l'URI

**"L'app non è verificata"**
→ Normale per app in sviluppo
→ Clicca "Avanzate" → "Vai a ... (non sicuro)"

**"Accesso negato"**
→ Non hai aggiunto la tua email come "utente di test"
→ Vai in "Schermata consenso OAuth" → "Utenti di test" → Aggiungi email

**"API Key non valida"**
→ Verifica che l'API Key sia corretta (copia/incolla senza spazi)
→ Assicurati che Google Drive API sia abilitata

---

## 🎬 Video Tutorial Google

Se preferisci un video:
- Cerca su YouTube: "Google OAuth setup tutorial"
- Oppure: "Google Drive API setup"

---

## ✅ Checklist Finale

Prima di usare l'app, verifica:

- [ ] Progetto Google Cloud creato
- [ ] Google Drive API abilitata
- [ ] Schermata consenso OAuth configurata (Esterni)
- [ ] Email aggiunta come "utente di test"
- [ ] API Key creata e copiata
- [ ] OAuth Client ID creato e copiato
- [ ] URI `http://localhost:8000` aggiunto
- [ ] Credenziali inserite nell'app
- [ ] Configurazione salvata nell'app

Se hai tutti i ✅, clicca "Connetti a Google Drive" e dovrebbe funzionare!

---

## 🆘 Serve Aiuto?

Se hai ancora problemi:
1. Controlla la console del browser (F12)
2. Guarda gli errori nella tab "Console"
3. Verifica che l'URI di reindirizzamento corrisponda ESATTAMENTE
