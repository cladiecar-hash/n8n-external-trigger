# 🚂 Railway.app Deployment Guide

Guida completa per deployare l'applicazione su Railway.app per produzione.

---

## ✨ Vantaggi Railway

- 🆓 **$5 crediti gratis/mese** (sempre gratis per questa app)
- 🌐 **URL HTTPS fisso** (es: `tua-app.up.railway.app`)
- ⚡ **Deploy automatico da GitHub**
- 🔄 **Auto-restart** se il server crasha
- 📊 **Logs in tempo reale**
- 🚀 **Sempre online 24/7** (niente sleep mode)
- 🔐 **HTTPS certificato SSL** automatico

---

## 📋 Prerequisiti

Prima di iniziare, assicurati di avere:

- [ ] Account GitHub (gratis)
- [ ] Account Railway (gratis - creerai durante il processo)
- [ ] Il codice dell'app su GitHub (o pronto per essere caricato)

---

## 🚀 PASSO 1: Prepara il Repository GitHub

### **1a. Crea Repository su GitHub** (se non l'hai già)

1. Vai su: **https://github.com/new**
2. Nome repository: `n8n-external-trigger` (o come preferisci)
3. Visibilità: **Public** o **Private** (entrambi funzionano)
4. NON spuntare "Add a README" (abbiamo già i file)
5. Clicca **"Create repository"**

### **1b. Push del Codice su GitHub**

Apri il **Prompt dei Comandi** nella cartella del progetto e:

```bash
# Se non hai ancora inizializzato git
git init
git add .
git commit -m "Initial commit for Railway deployment"

# Aggiungi il remote (sostituisci con il TUO username/repo)
git remote add origin https://github.com/TUO-USERNAME/n8n-external-trigger.git

# Push
git branch -M main
git push -u origin main
```

✅ **Il codice è ora su GitHub!**

---

## 🚂 PASSO 2: Crea Account Railway

1. Vai su: **https://railway.app/**

2. Clicca **"Start a New Project"** o **"Login"**

3. **Sign up** usando:
   - **GitHub** (consigliato - più facile)
   - Email
   - Google

4. Se usi GitHub, autorizza Railway ad accedere ai tuoi repository

5. **Verifica email** (se richiesto)

✅ **Account creato!** Hai $5 di crediti gratis

---

## 📦 PASSO 3: Deploy l'Applicazione

### **3a. Crea Nuovo Progetto**

1. Nella dashboard Railway, clicca **"New Project"**

2. Scegli **"Deploy from GitHub repo"**

3. Se è la prima volta:
   - Clicca **"Configure GitHub App"**
   - Autorizza Railway
   - Seleziona i repository da condividere (tutti o solo specifici)

4. Seleziona il repository **`n8n-external-trigger`**

5. Clicca **"Deploy Now"**

### **3b. Railway Rileva Automaticamente**

Railway analizzerà il repository e rileverà:
- ✅ `requirements.txt` → App Python
- ✅ `Procfile` → Come avviare l'app
- ✅ `runtime.txt` → Versione Python

**Deployment inizia automaticamente!**

Vedrai:
```
⚙️  Building...
📦 Installing dependencies...
🚀 Starting application...
✅ Deployed successfully!
```

⏱️ **Tempo:** ~2-3 minuti per il primo deploy

---

## 🌐 PASSO 4: Ottieni l'URL Pubblico

### **4a. Genera Domain**

1. Nel progetto Railway, clicca sul **service** (quadrato con nome dell'app)

2. Vai alla tab **"Settings"**

3. Scorri fino a **"Networking"** → **"Public Networking"**

4. Clicca **"Generate Domain"**

Railway genererà un URL tipo:
```
https://n8n-external-trigger-production-abc123.up.railway.app
```

✅ **Copia questo URL!** È il tuo URL fisso di produzione

### **4b. (Opzionale) Custom Domain**

Se vuoi usare il tuo dominio (es: `app.tuosito.com`):

1. Nella stessa sezione **"Networking"**
2. Clicca **"Custom Domain"**
3. Inserisci il dominio
4. Configura DNS come indicato
5. Railway gestirà HTTPS automaticamente

---

## ⚙️ PASSO 5: Test l'Applicazione

### **5a. Verifica Health Check**

Apri nel browser:
```
https://IL-TUO-URL.up.railway.app/api/health
```

Dovresti vedere:
```json
{
  "status": "healthy",
  "timestamp": "2025-11-08T...",
  "activeJobs": 0
}
```

✅ **Server funziona!**

### **5b. Test Homepage**

Apri:
```
https://IL-TUO-URL.up.railway.app
```

Dovresti vedere l'app HTML (Google Drive PDF Sender)

✅ **App online!**

---

## 🔧 PASSO 6: Configura Google OAuth

### **6a. Aggiungi Railway URL a Google Cloud**

L'app ora è su Railway, quindi devi autorizzare il nuovo URL in Google Cloud:

1. Vai su: **https://console.cloud.google.com/**

2. Seleziona il tuo progetto

3. **API e Servizi** → **Credenziali**

4. Clicca sul tuo **OAuth 2.0 Client ID**

5. In **"URI di reindirizzamento autorizzati"** clicca **"+ AGGIUNGI URI"**

6. Aggiungi:
   ```
   https://IL-TUO-URL.up.railway.app
   ```
   Esempio: `https://n8n-external-trigger-production-abc123.up.railway.app`

7. **Salva**

✅ **Google OAuth configurato per produzione!**

---

## 📝 PASSO 7: Configura l'App

### **7a. Apri l'App su Railway**

1. Vai su: `https://IL-TUO-URL.up.railway.app`

2. Clicca **Settings** ⚙️

3. Configura:
   - **Google Client ID**: (il tuo Client ID)
   - **Google API Key**: (la tua API Key)
   - **n8n Webhook URL**: `https://your-n8n.com/webhook/...`
   - **Callback URL**: `https://IL-TUO-URL.up.railway.app/api/callback`
   - **Callback Token**: (opzionale) `your-secret-token`

4. **Salva Configuration**

✅ **App configurata!**

---

## 🔗 PASSO 8: Aggiorna n8n

### **8a. Aggiorna Callback URL in n8n**

Nel tuo workflow n8n:

1. Apri il nodo **HTTP Request** (per il callback)

2. **URL**: Cambia da ngrok a Railway:
   ```
   https://IL-TUO-URL.up.railway.app/api/callback
   ```

3. **Method**: POST

4. **Body** (JSON):
   ```json
   {
     "jobId": "{{ $json.jobId }}",
     "url": "{{ $json.supabasePublicUrl }}",
     "fileName": "{{ $json.fileName }}",
     "items": "{{ $json.itemCount }}",
     "durationSec": "{{ $json.processingTime }}"
   }
   ```

5. **Salva** il workflow

✅ **n8n configurato con URL fisso!**

---

## 🎉 PASSO 9: Test End-to-End

### **Test completo:**

1. **Apri** l'app: `https://IL-TUO-URL.up.railway.app`

2. **Connetti** a Google Drive (OAuth dovrebbe funzionare)

3. **Seleziona** un PDF

4. **Inserisci** PBS code

5. **Invia** a n8n webhook

6. **Aspetta** ~3-4 minuti per il processing

7. **Verifica** che l'app riceva automaticamente il callback!

   L'app dovrebbe:
   - Mostrare "Processing" badge (giallo)
   - Fare polling ogni 5 secondi
   - Ricevere il risultato da n8n
   - Mostrare "Ready" badge (verde)
   - Visualizzare il JSON

✅ **Tutto funziona!**

---

## 📊 PASSO 10: Monitoring e Logs

### **10a. Visualizza Logs in Tempo Reale**

1. Nel progetto Railway, clicca sul **service**

2. Vai alla tab **"Deployments"**

3. Clicca sull'ultimo deployment (con ✅ verde)

4. Vedrai i logs in tempo reale:
   ```
   ✅ Callback received for job 20251108_123456_789
      URL: https://supabase.co/...
      Items: 264
   ```

### **10b. Metriche**

Nella tab **"Metrics"** vedrai:
- 📊 CPU usage
- 💾 Memory usage
- 🌐 Network traffic
- ⚡ Response times

### **10c. Variabili d'Ambiente** (se necessarie)

Se vuoi configurare credenziali via environment variables:

1. Tab **"Variables"**
2. Clicca **"+ New Variable"**
3. Aggiungi variabili:
   ```
   FLASK_ENV=production
   SECRET_KEY=your-secret-key
   ```
4. **Deploy** → Railway ri-deploya automaticamente

---

## 🔄 Aggiornamenti Futuri

### **Deploy Automatico**

Ogni volta che fai **push su GitHub**, Railway re-deploya automaticamente!

```bash
# Fai modifiche al codice
git add .
git commit -m "Update feature X"
git push

# Railway rileva il push e re-deploya automaticamente!
```

✅ **CI/CD automatico!**

### **Rollback**

Se un deploy ha problemi:

1. Tab **"Deployments"**
2. Trova un deployment precedente funzionante
3. Clicca **"⋮"** → **"Redeploy"**

---

## 💰 Costi e Limiti

### **Piano Gratuito ($5 crediti/mese):**

**Include:**
- ✅ 500 ore di esecuzione (~20 giorni full-time)
- ✅ $5 di servizi vari
- ✅ Unlimited progetti
- ✅ HTTPS gratis
- ✅ Auto-scaling

**Per questa app:**
- Consumo stimato: **~$0.50 - $2/mese**
- ✅ **Sempre gratis con i $5 crediti**

**Se superi i $5:**
- Railway ti avvisa
- Puoi aggiungere carta di credito (pay-as-you-go)
- O l'app si ferma fino al mese successivo

### **Piano Paid ($5/mese fisso):**

Se vuoi evitare sorprese:
- $5/mese fisso
- $20 di crediti inclusi
- Priority support

---

## 🔧 Troubleshooting

### **Problema: Deploy fallisce**

**Check:**
1. Verifica che `requirements.txt` sia committato
2. Verifica che `Procfile` sia presente
3. Guarda i logs per l'errore specifico

**Fix comuni:**
- Mancano dipendenze: Aggiungi a `requirements.txt`
- Errore Python version: Verifica `runtime.txt`

### **Problema: App crasha dopo deploy**

1. Vai a **"Deployments"** → Clicca deployment
2. Leggi i logs per vedere l'errore
3. Errori comuni:
   - Porta sbagliata: Usiamo `$PORT` automaticamente ✅
   - Moduli mancanti: Aggiungi a requirements.txt

### **Problema: Callback non arriva**

**Verifica:**
1. URL callback in n8n è corretto?
2. Include `/api/callback` alla fine?
3. È HTTPS (non HTTP)?

**Test manuale:**
```bash
curl -X POST https://IL-TUO-URL.up.railway.app/api/callback \
  -H "Content-Type: application/json" \
  -d '{"jobId":"test-123","url":"https://example.com/test.json"}'
```

Dovrebbe rispondere: `{"success": true, ...}`

### **Problema: Google OAuth non funziona**

**Verifica:**
1. Hai aggiunto l'URL Railway a Google Cloud Console?
2. URL è esattamente uguale (con/senza trailing slash)?
3. Riprova dopo 5-10 minuti (cache Google)

---

## 🎯 Checklist Deployment Completo

Prima di dichiarare "finito", verifica:

- [ ] Codice pushato su GitHub
- [ ] Progetto Railway creato
- [ ] Deploy completato con successo (✅ verde)
- [ ] URL pubblico generato
- [ ] Health check funziona (`/api/health`)
- [ ] App HTML si apre
- [ ] URL Railway aggiunto a Google Cloud Console
- [ ] OAuth Google funziona su Railway
- [ ] Configurazione salvata nell'app
- [ ] URL callback aggiornato in n8n
- [ ] Test end-to-end completato con successo
- [ ] Logs mostrano callback ricevuti correttamente

---

## 📚 Risorse Utili

- **Railway Docs**: https://docs.railway.app/
- **Railway Discord**: https://discord.gg/railway (supporto community)
- **Dashboard Railway**: https://railway.app/dashboard
- **Pricing**: https://railway.app/pricing

---

## 🆘 Supporto

Se hai problemi:

1. **Leggi i logs** in Railway (tab Deployments)
2. **Controlla questo troubleshooting** sopra
3. **Verifica la checklist** completa
4. **Railway Discord** per supporto community

---

## 🎉 Conclusione

Dopo aver completato questi passi:

✅ **App online 24/7** su Railway
✅ **URL HTTPS fisso** (non cambia più!)
✅ **Callback automatici** da n8n
✅ **Deploy automatico** da GitHub
✅ **Gratis** con i $5 crediti/mese
✅ **Produzione-ready**

**Puoi:**
- Chiudere il laptop (app resta online)
- Non pensare più a ngrok
- Configurare n8n una volta sola
- Scalare se serve più traffico

**Non serve più:**
- ❌ Tenere PC acceso
- ❌ Aggiornare URL ngrok
- ❌ Riavviare server manualmente

Congratulazioni! 🎉 La tua app è in produzione!
