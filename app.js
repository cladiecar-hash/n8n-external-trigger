// Configurazione e stato dell'applicazione
const APP_CONFIG = {
    DISCOVERY_DOCS: ['https://www.googleapis.com/discovery/v1/apis/drive/v3/rest'],
    SCOPES: 'https://www.googleapis.com/auth/drive.readonly'
};

let tokenClient;
let gapiInited = false;
let gisInited = false;
let currentFolderId = null;
let selectedFile = null;

// ============= INIZIALIZZAZIONE =============

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    loadStoredConfig();
    attachEventListeners();
    gapiLoaded();
    gisLoaded();
}

// ============= GESTIONE CONFIGURAZIONE =============

function loadStoredConfig() {
    const clientId = localStorage.getItem('google_client_id');
    const apiKey = localStorage.getItem('google_api_key');
    const webhookUrl = localStorage.getItem('webhook_url');

    if (clientId && apiKey && webhookUrl) {
        document.getElementById('clientId').value = clientId;
        document.getElementById('apiKey').value = apiKey;
        document.getElementById('webhookUrl').value = webhookUrl;

        document.getElementById('saveConfig').style.display = 'none';
        document.getElementById('editConfig').style.display = 'inline-block';
        document.getElementById('authSection').style.display = 'block';

        // Disabilita i campi
        document.getElementById('clientId').disabled = true;
        document.getElementById('apiKey').disabled = true;
        document.getElementById('webhookUrl').disabled = true;

        showMessage('Configurazione caricata dal browser', 'info', 'authStatus');
    }
}

function saveConfig() {
    const clientId = document.getElementById('clientId').value.trim();
    const apiKey = document.getElementById('apiKey').value.trim();
    const webhookUrl = document.getElementById('webhookUrl').value.trim();

    if (!clientId || !apiKey || !webhookUrl) {
        alert('Compila tutti i campi della configurazione');
        return;
    }

    // Validazione URL webhook
    try {
        new URL(webhookUrl);
    } catch {
        alert('URL webhook non valido');
        return;
    }

    localStorage.setItem('google_client_id', clientId);
    localStorage.setItem('google_api_key', apiKey);
    localStorage.setItem('webhook_url', webhookUrl);

    document.getElementById('saveConfig').style.display = 'none';
    document.getElementById('editConfig').style.display = 'inline-block';
    document.getElementById('authSection').style.display = 'block';

    // Disabilita i campi
    document.getElementById('clientId').disabled = true;
    document.getElementById('apiKey').disabled = true;
    document.getElementById('webhookUrl').disabled = true;

    showMessage('Configurazione salvata con successo!', 'success', 'authStatus');

    // Reinizializza Google API con le nuove credenziali
    gapiInited = false;
    gisInited = false;
    gapiLoaded();
    gisLoaded();
}

function editConfig() {
    document.getElementById('clientId').disabled = false;
    document.getElementById('apiKey').disabled = false;
    document.getElementById('webhookUrl').disabled = false;

    document.getElementById('saveConfig').style.display = 'inline-block';
    document.getElementById('editConfig').style.display = 'none';

    document.getElementById('authSection').style.display = 'none';
    document.getElementById('fileSection').style.display = 'none';
    document.getElementById('sendSection').style.display = 'none';

    showMessage('Modalità modifica attivata', 'info', 'authStatus');
}

function resetApp() {
    if (confirm('Sei sicuro di voler resettare completamente l\'applicazione? Tutte le configurazioni salvate verranno eliminate.')) {
        localStorage.clear();
        location.reload();
    }
}

// ============= GOOGLE API INITIALIZATION =============

function gapiLoaded() {
    const apiKey = localStorage.getItem('google_api_key');
    if (!apiKey) {
        console.log('API Key non ancora configurata');
        return;
    }

    gapi.load('client', async () => {
        await gapi.client.init({
            apiKey: apiKey,
            discoveryDocs: APP_CONFIG.DISCOVERY_DOCS,
        });
        gapiInited = true;
        maybeEnableButtons();
    });
}

function gisLoaded() {
    const clientId = localStorage.getItem('google_client_id');
    if (!clientId) {
        console.log('Client ID non ancora configurato');
        return;
    }

    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: clientId,
        scope: APP_CONFIG.SCOPES,
        callback: (response) => {
            if (response.error !== undefined) {
                throw (response);
            }
            handleAuthSuccess();
        },
    });
    gisInited = true;
    maybeEnableButtons();
}

function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        document.getElementById('authorizeBtn').disabled = false;
    }
}

// ============= AUTENTICAZIONE =============

function handleAuthClick() {
    tokenClient.callback = async (resp) => {
        if (resp.error !== undefined) {
            showMessage('Errore di autenticazione: ' + resp.error, 'error', 'authStatus');
            return;
        }
        handleAuthSuccess();
    };

    if (gapi.client.getToken() === null) {
        tokenClient.requestAccessToken({ prompt: 'consent' });
    } else {
        tokenClient.requestAccessToken({ prompt: '' });
    }
}

function handleAuthSuccess() {
    document.getElementById('authorizeBtn').style.display = 'none';
    document.getElementById('signoutBtn').style.display = 'inline-block';
    document.getElementById('fileSection').style.display = 'block';
    document.getElementById('sendSection').style.display = 'block';

    showMessage('✓ Autenticato con successo!', 'success', 'authStatus');

    // Carica automaticamente i file dalla root
    listFiles();
}

function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token);
        gapi.client.setToken('');

        document.getElementById('authorizeBtn').style.display = 'inline-block';
        document.getElementById('signoutBtn').style.display = 'none';
        document.getElementById('fileSection').style.display = 'none';
        document.getElementById('sendSection').style.display = 'none';

        showMessage('Disconnesso', 'info', 'authStatus');
        clearFileSelection();
    }
}

// ============= GOOGLE DRIVE FILE MANAGEMENT =============

async function searchFolders() {
    const searchTerm = document.getElementById('folderSearch').value.trim();
    const folderList = document.getElementById('folderList');

    folderList.innerHTML = '<div class="loading">Caricamento cartelle</div>';

    try {
        let query = "mimeType='application/vnd.google-apps.folder' and trashed=false";
        if (searchTerm) {
            query += ` and name contains '${searchTerm}'`;
        }

        const response = await gapi.client.drive.files.list({
            q: query,
            pageSize: 20,
            fields: 'files(id, name, modifiedTime)',
            orderBy: 'name'
        });

        const folders = response.result.files;

        if (!folders || folders.length === 0) {
            folderList.innerHTML = '<div style="padding: 20px; text-align: center; color: #777;">Nessuna cartella trovata</div>';
            return;
        }

        folderList.innerHTML = folders.map(folder => `
            <div class="folder-item" onclick="selectFolder('${folder.id}', '${folder.name.replace(/'/g, "\\'")}')">
                <span class="folder-icon">📁</span>
                <span class="file-name">${folder.name}</span>
            </div>
        `).join('');

    } catch (error) {
        console.error('Errore nella ricerca delle cartelle:', error);
        folderList.innerHTML = '<div style="padding: 20px; text-align: center; color: red;">Errore nel caricamento delle cartelle</div>';
    }
}

function selectFolder(folderId, folderName) {
    currentFolderId = folderId;
    showMessage(`Cartella selezionata: ${folderName}`, 'info', 'authStatus');
    listFiles(folderId);
}

async function listFiles(folderId = null) {
    const fileList = document.getElementById('fileList');
    const searchTerm = document.getElementById('fileSearch').value.trim();

    fileList.innerHTML = '<div class="loading">Caricamento file PDF</div>';

    try {
        let query = "mimeType='application/pdf' and trashed=false";

        if (folderId) {
            query += ` and '${folderId}' in parents`;
        }

        if (searchTerm) {
            query += ` and name contains '${searchTerm}'`;
        }

        const response = await gapi.client.drive.files.list({
            q: query,
            pageSize: 30,
            fields: 'files(id, name, size, modifiedTime, webViewLink)',
            orderBy: 'modifiedTime desc'
        });

        const files = response.result.files;

        if (!files || files.length === 0) {
            fileList.innerHTML = '<div style="padding: 20px; text-align: center; color: #777;">Nessun file PDF trovato</div>';
            return;
        }

        fileList.innerHTML = files.map(file => {
            const size = formatFileSize(file.size);
            const date = new Date(file.modifiedTime).toLocaleDateString('it-IT');

            return `
                <div class="file-item" onclick='selectFile(${JSON.stringify(file)})'>
                    <span class="file-icon">📄</span>
                    <div style="flex: 1;">
                        <div class="file-name">${file.name}</div>
                        <div class="file-info">${size} - Modificato: ${date}</div>
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error('Errore nel caricamento dei file:', error);
        fileList.innerHTML = '<div style="padding: 20px; text-align: center; color: red;">Errore nel caricamento dei file</div>';
    }
}

function selectFile(file) {
    selectedFile = file;

    // Evidenzia il file selezionato
    document.querySelectorAll('.file-item').forEach(item => {
        item.classList.remove('selected');
    });
    event.currentTarget.classList.add('selected');

    // Mostra il file selezionato
    document.getElementById('selectedFile').style.display = 'block';
    document.getElementById('selectedFileName').textContent = file.name;

    // Abilita il pulsante di invio se c'è anche il codice PBS
    updateSendButton();
}

function clearFileSelection() {
    selectedFile = null;
    document.getElementById('selectedFile').style.display = 'none';
    document.querySelectorAll('.file-item').forEach(item => {
        item.classList.remove('selected');
    });
    updateSendButton();
}

// ============= INVIO A WEBHOOK N8N =============

async function sendToWebhook() {
    const pbsCode = document.getElementById('pbsCode').value.trim();
    const webhookUrl = localStorage.getItem('webhook_url');
    const sendStatus = document.getElementById('sendStatus');

    if (!selectedFile) {
        alert('Seleziona prima un file PDF');
        return;
    }

    if (!pbsCode) {
        alert('Inserisci il codice PBS');
        return;
    }

    // Validazione codice PBS (alfanumerico, trattini e underscore)
    if (!/^[A-Za-z0-9_-]+$/.test(pbsCode)) {
        alert('Il codice PBS deve contenere solo lettere, numeri, trattini (-) e underscore (_)');
        return;
    }

    document.getElementById('sendBtn').disabled = true;
    sendStatus.style.display = 'block';
    sendStatus.className = 'status-box';
    sendStatus.innerHTML = '<div class="loading">Scaricamento del file da Google Drive</div>';

    try {
        // Scarica il file da Google Drive
        const response = await gapi.client.drive.files.get({
            fileId: selectedFile.id,
            alt: 'media'
        }, {
            responseType: 'blob'
        });

        sendStatus.innerHTML = '<div class="loading">Preparazione dell\'invio al webhook</div>';

        // Converti il blob in base64
        const fileBlob = new Blob([response.body], { type: 'application/pdf' });
        const base64Data = await blobToBase64(fileBlob);

        sendStatus.innerHTML = '<div class="loading">Invio al webhook n8n</div>';

        // Prepara i dati da inviare
        const payload = {
            pbsCode: pbsCode,
            fileName: selectedFile.name,
            fileSize: selectedFile.size,
            fileId: selectedFile.id,
            modifiedTime: selectedFile.modifiedTime,
            webViewLink: selectedFile.webViewLink || '',
            fileData: base64Data,
            mimeType: 'application/pdf',
            timestamp: new Date().toISOString()
        };

        // Invia al webhook
        const webhookResponse = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });

        if (!webhookResponse.ok) {
            throw new Error(`Errore HTTP: ${webhookResponse.status} - ${webhookResponse.statusText}`);
        }

        const result = await webhookResponse.json().catch(() => ({}));

        sendStatus.className = 'status-box success';
        sendStatus.innerHTML = `
            <h3>✓ Invio Completato!</h3>
            <p><strong>File:</strong> ${selectedFile.name}</p>
            <p><strong>Codice PBS:</strong> ${pbsCode}</p>
            <p><strong>Dimensione:</strong> ${formatFileSize(selectedFile.size)}</p>
            <p><strong>Timestamp:</strong> ${new Date().toLocaleString('it-IT')}</p>
            ${result.message ? `<p><strong>Risposta:</strong> ${result.message}</p>` : ''}
        `;

        // Reset form
        document.getElementById('pbsCode').value = '';
        clearFileSelection();

    } catch (error) {
        console.error('Errore nell\'invio:', error);
        sendStatus.className = 'status-box error';
        sendStatus.innerHTML = `
            <h3>✗ Errore nell'invio</h3>
            <p>${error.message}</p>
            <p>Controlla la console per maggiori dettagli.</p>
        `;
    } finally {
        document.getElementById('sendBtn').disabled = false;
    }
}

// ============= UTILITY FUNCTIONS =============

function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            // Rimuovi il prefixo "data:application/pdf;base64,"
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
}

function formatFileSize(bytes) {
    if (!bytes) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function showMessage(message, type, elementId) {
    const element = document.getElementById(elementId);
    element.className = `status-box ${type}`;
    element.innerHTML = `<p>${message}</p>`;
}

function updateSendButton() {
    const pbsCode = document.getElementById('pbsCode').value.trim();
    const sendBtn = document.getElementById('sendBtn');

    sendBtn.disabled = !(selectedFile && pbsCode && /^[A-Za-z0-9_-]+$/.test(pbsCode));
}

// ============= EVENT LISTENERS =============

function attachEventListeners() {
    document.getElementById('saveConfig').addEventListener('click', saveConfig);
    document.getElementById('editConfig').addEventListener('click', editConfig);
    document.getElementById('authorizeBtn').addEventListener('click', handleAuthClick);
    document.getElementById('signoutBtn').addEventListener('click', handleSignoutClick);
    document.getElementById('searchFolderBtn').addEventListener('click', searchFolders);
    document.getElementById('searchFileBtn').addEventListener('click', () => listFiles(currentFolderId));
    document.getElementById('clearSelection').addEventListener('click', clearFileSelection);
    document.getElementById('sendBtn').addEventListener('click', sendToWebhook);
    document.getElementById('resetApp').addEventListener('click', resetApp);

    // Aggiorna il pulsante di invio quando si modifica il codice PBS
    document.getElementById('pbsCode').addEventListener('input', updateSendButton);

    // Enter per cercare
    document.getElementById('folderSearch').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') searchFolders();
    });

    document.getElementById('fileSearch').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') listFiles(currentFolderId);
    });
}
