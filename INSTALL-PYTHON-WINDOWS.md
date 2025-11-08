# 🐍 Guida Installazione Python per Windows

## ✅ Installazione Passo-Passo

### **Passo 1: Scarica Python**

1. Vai al sito ufficiale: **https://www.python.org/downloads/**
2. Clicca sul pulsante giallo **"Download Python 3.x.x"** (versione più recente)
3. Il file si chiamerà qualcosa come `python-3.12.0-amd64.exe`
4. Aspetta che il download finisca

---

### **Passo 2: Avvia l'Installer**

1. Doppio click sul file scaricato (`python-3.12.0-amd64.exe`)
2. Windows potrebbe chiedere conferma → Clicca **"Sì"**

---

### **Passo 3: IMPORTANTE - Configura l'Installazione**

📌 **ATTENZIONE**: Questo è il passo più importante!

Nella prima schermata dell'installer vedrai:

```
┌─────────────────────────────────────────────────┐
│  Install Python 3.12.0                          │
├─────────────────────────────────────────────────┤
│                                                 │
│  ☐ Install launcher for all users              │
│  ☐ Add python.exe to PATH        ⬅️ IMPORTANTE! │
│                                                 │
│  ┌─────────────────────────────────────────┐   │
│  │  Install Now                            │   │
│  │  (recommended)                          │   │
│  └─────────────────────────────────────────┘   │
│                                                 │
│  Customize installation                         │
│                                                 │
└─────────────────────────────────────────────────┘
```

**✅ DEVI FARE QUESTO:**

1. **Spunta la casella** ☑️ **"Add python.exe to PATH"**
   - Questa è la cosa PIÙ IMPORTANTE!
   - Senza questo, gli script .bat non funzioneranno

2. Poi puoi scegliere:
   - **Opzione A (Consigliata)**: Clicca **"Install Now"**
   - **Opzione B (Avanzata)**: Clicca **"Customize installation"** (vedi sotto)

---

### **Passo 4a: Installazione Rapida (Consigliata)**

Se hai cliccato **"Install Now"**:

1. Python si installerà automaticamente con:
   - ✅ pip (incluso)
   - ✅ IDLE
   - ✅ Documentazione
   - ✅ Tutte le feature standard

2. Aspetta che l'installazione finisca (1-2 minuti)

3. Quando vedi **"Setup was successful"**:
   - Clicca **"Close"**
   - ✅ Fatto!

---

### **Passo 4b: Installazione Personalizzata (Opzionale)**

Se hai cliccato **"Customize installation"**:

**Schermata 1 - Optional Features:**
```
☑️ Documentation
☑️ pip               ⬅️ ASSICURATI CHE SIA SPUNTATO!
☑️ tcl/tk and IDLE
☑️ Python test suite
☑️ py launcher
☑️ for all users (requires admin privileges)
```
- **pip DEVE essere spuntato!** ✅
- Clicca **"Next"**

**Schermata 2 - Advanced Options:**
```
☑️ Install for all users
☑️ Associate files with Python
☑️ Create shortcuts
☑️ Add Python to environment variables  ⬅️ IMPORTANTE!
☐ Precompile standard library
☐ Download debugging symbols
☐ Download debug binaries
```
- **Add Python to environment variables DEVE essere spuntato!** ✅
- Clicca **"Install"**

**Schermata 3 - Installazione:**
- Aspetta che finisca (1-2 minuti)
- Clicca **"Close"** quando vedi "Setup was successful"

---

### **Passo 5: Verifica l'Installazione**

#### **Metodo 1: Prompt dei Comandi**

1. Apri il **Prompt dei Comandi**:
   - Premi **Win + R**
   - Digita `cmd`
   - Premi **Invio**

2. Digita questi comandi per verificare:

```cmd
python --version
```
**Dovresti vedere**: `Python 3.12.0` (o la versione che hai installato)

```cmd
pip --version
```
**Dovresti vedere**: `pip 23.x.x from C:\Users\...\Python\...`

3. Se vedi entrambe le versioni: ✅ **Installazione riuscita!**

#### **Metodo 2: Usa lo script di test**

1. Doppio click su **`install-dependencies.bat`**
2. Se vedi la versione di Python e pip: ✅ **Tutto OK!**
3. Lo script installerà automaticamente Flask e flask-cors

---

## ⚠️ Problema: "Python non trovato" o "comando non riconosciuto"

Se dopo l'installazione vedi ancora errori:

### **Soluzione 1: Riavvia il Computer**

L'aggiunta al PATH richiede spesso un riavvio completo:

1. Chiudi tutte le finestre
2. Riavvia il computer
3. Riprova gli script

### **Soluzione 2: Aggiungi Python al PATH Manualmente**

Se il riavvio non ha funzionato:

#### **Trova dove è installato Python:**

Probabilmente in uno di questi percorsi:
- `C:\Users\TuoNome\AppData\Local\Programs\Python\Python312\`
- `C:\Python312\`
- `C:\Program Files\Python312\`

#### **Aggiungi al PATH:**

1. Premi **Win + Pausa** (o tasto destro su "Questo PC" → Proprietà)
2. Clicca **"Impostazioni di sistema avanzate"**
3. Clicca **"Variabili d'ambiente"**
4. Nella sezione **"Variabili di sistema"**, trova **"Path"**
5. Clicca **"Modifica"**
6. Clicca **"Nuovo"**
7. Aggiungi questi DUE percorsi (uno alla volta):
   ```
   C:\Users\TuoNome\AppData\Local\Programs\Python\Python312\
   C:\Users\TuoNome\AppData\Local\Programs\Python\Python312\Scripts\
   ```
   ⚠️ **Sostituisci** `TuoNome` con il tuo nome utente Windows
   ⚠️ **Sostituisci** `Python312` con la versione che hai installato

8. Clicca **OK** → **OK** → **OK**
9. **Riavvia il computer**
10. Riprova

### **Soluzione 3: Reinstalla Python**

Se ancora non funziona:

1. **Disinstalla Python**:
   - Impostazioni → App → Cerca "Python" → Disinstalla

2. **Scarica di nuovo** da https://www.python.org/downloads/

3. **Reinstalla** assicurandoti di:
   - ✅ Spuntare **"Add python.exe to PATH"**
   - ✅ Scegliere "Install for all users" se possibile
   - ✅ Verificare che pip sia incluso

4. **Riavvia il computer**

---

## 📊 Checklist Installazione Completa

Verifica che tutto sia OK:

- [ ] Python scaricato dal sito ufficiale
- [ ] Installer eseguito
- [ ] ✅ **"Add python.exe to PATH" spuntato**
- [ ] ✅ **pip incluso nell'installazione**
- [ ] Installazione completata con successo
- [ ] Computer riavviato
- [ ] `python --version` funziona nel cmd
- [ ] `pip --version` funziona nel cmd
- [ ] `install-dependencies.bat` funziona
- [ ] Flask e flask-cors installati correttamente

---

## 🎯 Dopo l'Installazione

Una volta che Python è installato correttamente:

### **1. Installa le Dipendenze:**

```
Doppio click su: install-dependencies.bat
```

Dovresti vedere:
```
╔══════════════════════════════════════════════════════════╗
║  📦 Installing Python Dependencies...                   ║
╚══════════════════════════════════════════════════════════╝

Current Python version:
Python 3.12.0

Current pip version:
pip 23.3.1 from ...

Installing packages from requirements.txt...

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Successfully installed Flask-3.0.0 flask-cors-4.0.0 ...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

✅ All dependencies installed successfully!

Installed packages:
Flask          3.0.0
flask-cors     4.0.0
```

### **2. Avvia l'App:**

```
Doppio click su: start-all.bat
```

Dovrebbe aprire 2 finestre e funzionare tutto! 🎉

---

## 💡 Link Utili

- **Download Python**: https://www.python.org/downloads/
- **Documentazione Python**: https://docs.python.org/3/
- **Guida pip**: https://pip.pypa.io/en/stable/getting-started/

---

## 🆘 Ancora Problemi?

Se dopo aver seguito questa guida hai ancora problemi:

1. **Verifica la versione di Windows**:
   - Python richiede Windows 7 o superiore
   - Preferibilmente Windows 10/11

2. **Prova Python dal Microsoft Store** (alternativa):
   - Apri Microsoft Store
   - Cerca "Python 3.12"
   - Clicca "Ottieni"
   - Installa
   - pip è incluso automaticamente
   - PATH è configurato automaticamente

3. **Verifica antivirus/firewall**:
   - A volte bloccano l'installazione
   - Disabilita temporaneamente durante l'installazione

4. **Esegui come Amministratore**:
   - Tasto destro su installer Python
   - "Esegui come amministratore"

---

## ✅ Riepilogo Veloce

```
1. Scarica Python da python.org
2. ✅ Spunta "Add python.exe to PATH"
3. ✅ Assicurati che pip sia incluso
4. Installa
5. Riavvia computer
6. Testa: python --version
7. Testa: pip --version
8. Esegui: install-dependencies.bat
9. Esegui: start-all.bat
10. 🎉 Fatto!
```

---

Buona installazione! 🚀
