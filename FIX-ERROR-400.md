# 🚨 Risoluzione Errore: "Error 400: invalid_request"

## ❌ ERRORE
```
Access blocked: Authorization Error
Error 400: invalid_request
```

## ✅ CAUSA
Mancano le "Origini JavaScript autorizzate" nelle credenziali OAuth.

---

## 🔧 SOLUZIONE PASSO-PASSO

### 1. Vai alle Credenziali

**Link diretto**: https://console.cloud.google.com/apis/credentials

Oppure:
- Google Cloud Console
- Menu → "API e servizi" → "Credenziali"

---

### 2. Modifica l'OAuth Client ID

1. Trova nella lista: **"ID client OAuth 2.0"**
2. Il nome dovrebbe essere "Web Client" (o come l'hai chiamato)
3. Clicca sull'icona **matita** ✏️ a destra

---

### 3. Configura le Origini JavaScript Autorizzate

⚠️ **QUESTA È LA PARTE MANCANTE!**

Nella sezione **"Origini JavaScript autorizzate"**:

1. Clicca **"+ AGGIUNGI URI"**
2. Inserisci ESATTAMENTE: `http://localhost:8000`
3. Clicca di nuovo **"+ AGGIUNGI URI"**
4. Inserisci: `http://localhost`

**IMPORTANTE**:
- ❌ NON mettere slash finale (`/`) per le origini JavaScript
- ✅ Usa `http://` (non `https://` per localhost)
- ✅ Se usi altra porta, cambiala (es: `http://localhost:3000`)

---

### 4. Verifica gli URI di Reindirizzamento

Nella sezione **"URI di reindirizzamento autorizzati"**:

Assicurati che ci siano ENTRAMBI:
1. `http://localhost:8000` (senza slash)
2. `http://localhost:8000/` (con slash)

Se mancano, aggiungili:
- Clicca **"+ AGGIUNGI URI"**
- Inserisci l'URI
- Ripeti per il secondo

---

### 5. Configurazione Finale

La tua configurazione deve essere ESATTAMENTE così:

```
┌─────────────────────────────────────────────┐
│ Modifica client OAuth                       │
├─────────────────────────────────────────────┤
│ Nome:                                       │
│ Web Client                                  │
│                                             │
│ Origini JavaScript autorizzate:             │
│ 1. http://localhost:8000                    │
│ 2. http://localhost                         │
│                                             │
│ URI di reindirizzamento autorizzati:        │
│ 1. http://localhost:8000                    │
│ 2. http://localhost:8000/                   │
└─────────────────────────────────────────────┘
```

---

### 6. Salva e Attendi

1. Clicca **"SALVA"** in fondo alla pagina
2. ⏱️ Attendi 10-30 secondi (le modifiche devono propagarsi)
3. Se vedi un messaggio di conferma, perfetto!

---

### 7. Riprova nell'Applicazione

1. Torna all'app: `http://localhost:8000`
2. **Ricarica completamente la pagina**:
   - Windows: `CTRL + SHIFT + R` oppure `CTRL + F5`
   - Mac: `CMD + SHIFT + R`
3. Se hai già salvato le credenziali:
   - Clicca "Modifica Configurazione"
   - Clicca "Salva Configurazione" di nuovo
4. Clicca **"Connetti a Google Drive"**
5. ✅ Dovrebbe funzionare!

---

## 🆘 Se Continua a Non Funzionare

### Soluzione A: Cancella Cache Browser

1. Apri DevTools (F12)
2. Tab "Application" (o "Storage")
3. Lato sinistro → "Local Storage"
4. Click destro → "Clear"
5. Ricarica la pagina (F5)

### Soluzione B: Usa Modalità Incognito

1. Apri una finestra **incognito/privata**
2. Vai su `http://localhost:8000`
3. Inserisci di nuovo le credenziali
4. Prova a connetterti

### Soluzione C: Verifica Altre Impostazioni

Torna su Google Cloud Console → Credenziali:

1. **Copia il Client ID**
   - Deve finire con `.apps.googleusercontent.com`
   - Copia l'ID COMPLETO

2. **Verifica che il progetto sia corretto**
   - In alto a sinistra, verifica il nome del progetto
   - Deve essere quello dove hai abilitato Google Drive API

3. **Controlla che l'API sia abilitata**
   - Menu → "API e servizi" → "API abilitate"
   - Deve esserci "Google Drive API"

### Soluzione D: Ricrea le Credenziali

Se niente funziona:

1. **Elimina** l'OAuth Client ID esistente
2. **Creane uno nuovo** con questi parametri:
   - Tipo: "Applicazione web"
   - Nome: "Web Client"
   - Origini JavaScript:
     - `http://localhost:8000`
     - `http://localhost`
   - URI di reindirizzamento:
     - `http://localhost:8000`
     - `http://localhost:8000/`
3. Copia il nuovo Client ID
4. Inseriscilo nell'app

---

## 📋 Checklist Completa

Prima di riprovare, verifica:

- [ ] OAuth Client ID modificato
- [ ] Origini JavaScript autorizzate aggiunte
- [ ] `http://localhost:8000` nelle origini
- [ ] `http://localhost` nelle origini
- [ ] URI di reindirizzamento verificati
- [ ] Modifiche salvate su Google Cloud
- [ ] Atteso 10-30 secondi
- [ ] Pagina ricaricata completamente (CTRL+SHIFT+R)
- [ ] Cache browser pulita (opzionale)

---

## 🎯 Perché Questo Errore?

**Spiegazione tecnica:**

Google OAuth 2.0 richiede che tu specifichi:

1. **URI di reindirizzamento** = dove Google ti rimanda dopo il login
2. **Origini JavaScript** = da dove parte la richiesta OAuth

L'errore 400 `invalid_request` si verifica quando:
- ❌ Le origini JavaScript non sono configurate
- ❌ L'origine della richiesta non corrisponde a quelle autorizzate
- ❌ C'è un mismatch tra ciò che l'app richiede e ciò che Google ha registrato

**La soluzione** è aggiungere `http://localhost:8000` nelle origini JavaScript autorizzate.

---

## ✅ Dopo la Correzione

Una volta risolto, vedrai:

1. Popup di Google che chiede di selezionare l'account
2. Messaggio "L'app non è verificata" → Clicca "Avanzate" → "Vai a... (non sicuro)"
3. Richiesta permessi (solo lettura Google Drive)
4. Redirect all'app con messaggio "✓ Autenticato con successo!"

---

## 📞 Serve Altro Aiuto?

Se l'errore persiste:
1. Fai uno screenshot della configurazione OAuth su Google Cloud
2. Controlla la console del browser (F12 → tab Console)
3. Cerca errori rossi e riportali
