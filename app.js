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
    const supabaseUrl = localStorage.getItem('supabase_url');
    const supabaseKey = localStorage.getItem('supabase_key');

    if (clientId && apiKey && webhookUrl && supabaseUrl && supabaseKey) {
        document.getElementById('clientId').value = clientId;
        document.getElementById('apiKey').value = apiKey;
        document.getElementById('webhookUrl').value = webhookUrl;
        document.getElementById('supabaseUrl').value = supabaseUrl;
        document.getElementById('supabaseKey').value = supabaseKey;

        document.getElementById('saveConfig').style.display = 'none';
        document.getElementById('editConfig').style.display = 'inline-block';
        document.getElementById('authSection').style.display = 'block';

        // Disabilita i campi
        document.getElementById('clientId').disabled = true;
        document.getElementById('apiKey').disabled = true;
        document.getElementById('webhookUrl').disabled = true;
        document.getElementById('supabaseUrl').disabled = true;
        document.getElementById('supabaseKey').disabled = true;

        showMessage('Configurazione caricata dal browser', 'info', 'authStatus');
    }
}

function saveConfig() {
    const clientId = document.getElementById('clientId').value.trim();
    const apiKey = document.getElementById('apiKey').value.trim();
    const webhookUrl = document.getElementById('webhookUrl').value.trim();
    const supabaseUrl = document.getElementById('supabaseUrl').value.trim();
    const supabaseKey = document.getElementById('supabaseKey').value.trim();

    if (!clientId || !apiKey || !webhookUrl || !supabaseUrl || !supabaseKey) {
        alert('Compila tutti i campi della configurazione');
        return;
    }

    // Validazione URL webhook
    try {
        new URL(webhookUrl);
        new URL(supabaseUrl);
    } catch {
        alert('URL webhook o Supabase non valido');
        return;
    }

    localStorage.setItem('google_client_id', clientId);
    localStorage.setItem('google_api_key', apiKey);
    localStorage.setItem('webhook_url', webhookUrl);
    localStorage.setItem('supabase_url', supabaseUrl);
    localStorage.setItem('supabase_key', supabaseKey);

    document.getElementById('saveConfig').style.display = 'none';
    document.getElementById('editConfig').style.display = 'inline-block';
    document.getElementById('authSection').style.display = 'block';

    // Disabilita i campi
    document.getElementById('clientId').disabled = true;
    document.getElementById('apiKey').disabled = true;
    document.getElementById('webhookUrl').disabled = true;
    document.getElementById('supabaseUrl').disabled = true;
    document.getElementById('supabaseKey').disabled = true;

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
    document.getElementById('supabaseUrl').disabled = false;
    document.getElementById('supabaseKey').disabled = false;

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

// ============= SUPABASE DIAGNOSTICS =============

async function checkJobStatus(jobId) {
    const supabaseUrl = localStorage.getItem('supabase_url');
    const supabaseKey = localStorage.getItem('supabase_key');

    if (!supabaseUrl || !supabaseKey) {
        throw new Error('Configurazione Supabase mancante');
    }

    const response = await fetch(`${supabaseUrl}/rest/v1/rag_diagnostics?job_id=eq.${jobId}&order=timestamp.desc`, {
        headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`,
            'Content-Type': 'application/json'
        }
    });

    if (!response.ok) {
        throw new Error(`Errore Supabase: ${response.status}`);
    }

    const data = await response.json();
    return data;
}

async function pollJobStatus(jobId, updateCallback) {
    const maxAttempts = 600; // 10 minuti (600 * 1 secondo)
    let attempts = 0;
    let pollingInterval;

    return new Promise((resolve, reject) => {
        pollingInterval = setInterval(async () => {
            try {
                attempts++;

                const statusRecords = await checkJobStatus(jobId);

                if (!statusRecords || statusRecords.length === 0) {
                    if (attempts > 5) {
                        // Se dopo 5 tentativi non ci sono record, probabilmente c'è un problema
                        clearInterval(pollingInterval);
                        reject(new Error('Nessun record trovato per questo job'));
                    }
                    return;
                }

                // Prendi il record più recente
                const latestStatus = statusRecords[0];

                // Chiama la callback con l'aggiornamento
                updateCallback(latestStatus);

                // Controlla se il processo è completato o ha un errore
                if (latestStatus.status === 'Completed' || latestStatus.status === 'completed') {
                    clearInterval(pollingInterval);
                    resolve(latestStatus);
                } else if (latestStatus.status === 'Error' || latestStatus.status === 'error' || latestStatus.error_message) {
                    clearInterval(pollingInterval);
                    reject(new Error(latestStatus.error_message || 'Errore nel processo'));
                }

                // Timeout dopo maxAttempts
                if (attempts >= maxAttempts) {
                    clearInterval(pollingInterval);
                    reject(new Error('Timeout: processo non completato entro 10 minuti'));
                }

            } catch (error) {
                console.error('Errore durante il polling:', error);
                // Non interrompiamo subito, potrebbe essere un errore temporaneo
                if (attempts >= maxAttempts) {
                    clearInterval(pollingInterval);
                    reject(error);
                }
            }
        }, 1000); // Polling ogni secondo
    });
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
    sendStatus.innerHTML = '<div class="loading">📤 Invio al webhook n8n...</div>';

    try {
        // Prepara i dati da inviare (File ID, PBS Code e metadata utili)
        const payload = {
            fileId: selectedFile.id,
            pbsCode: pbsCode,
            fileName: selectedFile.name,
            fileSize: selectedFile.size,
            mimeType: 'application/pdf',
            modifiedTime: selectedFile.modifiedTime,
            webViewLink: selectedFile.webViewLink || '',
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

        // Se il webhook restituisce un job_id, avvia il monitoraggio
        if (result.job_id || result.jobId) {
            const jobId = result.job_id || result.jobId;

            sendStatus.innerHTML = `
                <h3>⏳ Elaborazione in corso...</h3>
                <p><strong>Job ID:</strong> ${jobId}</p>
                <p><strong>File:</strong> ${selectedFile.name}</p>
                <p><strong>PBS:</strong> ${pbsCode}</p>
                <div id="progressInfo" style="margin-top: 15px;">
                    <div class="loading">Attendere elaborazione...</div>
                </div>
            `;

            // Avvia il polling dello stato
            try {
                const finalStatus = await pollJobStatus(jobId, (status) => {
                    // Callback chiamata ad ogni aggiornamento
                    updateProgressUI(status);
                });

                // Processo completato con successo
                sendStatus.className = 'status-box success';
                sendStatus.innerHTML = `
                    <h3>✓ Elaborazione Completata!</h3>
                    <p><strong>Job ID:</strong> ${jobId}</p>
                    <p><strong>File:</strong> ${selectedFile.name}</p>
                    <p><strong>PBS:</strong> ${pbsCode}</p>
                    <p><strong>Processati:</strong> ${finalStatus.processed}/${finalStatus.to_process}</p>
                    <p><strong>Completato:</strong> ${new Date(finalStatus.timestamp).toLocaleString('it-IT')}</p>
                `;

                // Reset form dopo successo
                setTimeout(() => {
                    document.getElementById('pbsCode').value = '';
                    clearFileSelection();
                }, 3000);

            } catch (pollError) {
                // Errore durante il polling o nel processo
                sendStatus.className = 'status-box error';
                sendStatus.innerHTML = `
                    <h3>✗ Errore durante l'elaborazione</h3>
                    <p><strong>Job ID:</strong> ${jobId}</p>
                    <p><strong>Errore:</strong> ${pollError.message}</p>
                `;
            }

        } else {
            // Vecchio comportamento: webhook non restituisce job_id
            sendStatus.className = 'status-box success';
            sendStatus.innerHTML = `
                <h3>✓ Invio Completato!</h3>
                <p><strong>File ID:</strong> ${selectedFile.id}</p>
                <p><strong>Nome File:</strong> ${selectedFile.name}</p>
                <p><strong>Codice PBS:</strong> ${pbsCode}</p>
                <p><strong>Timestamp:</strong> ${new Date().toLocaleString('it-IT')}</p>
                ${result.message ? `<p><strong>Risposta:</strong> ${result.message}</p>` : ''}
                <p style="color: orange;"><small>⚠️ Job ID non restituito: monitoraggio non disponibile</small></p>
            `;

            // Reset form
            setTimeout(() => {
                document.getElementById('pbsCode').value = '';
                clearFileSelection();
            }, 3000);
        }

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

function updateProgressUI(status) {
    const progressInfo = document.getElementById('progressInfo');
    if (!progressInfo) return;

    const percentage = status.to_process > 0
        ? Math.round((status.processed / status.to_process) * 100)
        : 0;

    let statusIcon = '⏳';
    let statusText = status.status || 'Ongoing';

    if (status.status === 'Completed' || status.status === 'completed') {
        statusIcon = '✓';
    } else if (status.status === 'Error' || status.status === 'error') {
        statusIcon = '✗';
    }

    progressInfo.innerHTML = `
        <div style="background: #f0f0f0; padding: 15px; border-radius: 8px;">
            <p><strong>Stato:</strong> ${statusIcon} ${statusText}</p>
            <p><strong>Progresso:</strong> ${status.processed} / ${status.to_process} (${percentage}%)</p>
            <div style="background: #ddd; height: 20px; border-radius: 10px; overflow: hidden; margin: 10px 0;">
                <div style="background: #4CAF50; height: 100%; width: ${percentage}%; transition: width 0.3s;"></div>
            </div>
            ${status.workflow_name ? `<p><small><strong>Workflow:</strong> ${status.workflow_name}</small></p>` : ''}
            ${status.node_name ? `<p><small><strong>Nodo:</strong> ${status.node_name}</small></p>` : ''}
            ${status.error_message ? `<p style="color: red;"><strong>Errore:</strong> ${status.error_message}</p>` : ''}
            <p><small>Ultimo aggiornamento: ${new Date(status.timestamp).toLocaleTimeString('it-IT')}</small></p>
        </div>
    `;
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
