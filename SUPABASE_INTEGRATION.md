# Integrazione Supabase RAG Diagnostics

## Panoramica
Questo sistema implementa un monitoraggio in tempo reale del processo di elaborazione PDF tramite la tabella `rag_diagnostics` su Supabase.

## Tabella Supabase: rag_diagnostics

### Struttura
```sql
create table public.rag_diagnostics (
  id uuid not null default gen_random_uuid(),
  workflow_name text null,
  node_name text null,
  error_message text null,
  error_code text null,
  input_file text null,
  timestamp timestamp with time zone null default now(),
  job_id text null,
  status text not null default 'Ongoing'::text,
  processed smallint null default '0'::smallint,
  to_process smallint null default '0'::smallint,
  constraint rag_diagnostics_pkey primary key (id)
) TABLESPACE pg_default;
```

### URL Dashboard
https://supabase.com/dashboard/project/tpsywkjczdtmdhpjqmyi/editor/29595

## Configurazione Frontend

### Parametri Richiesti
1. **Supabase URL**: `https://tpsywkjczdtmdhpjqmyi.supabase.co`
2. **Supabase Anon Key**: La chiave API di Supabase

Questi parametri vanno inseriti nella sezione "Configurazione" dell'applicazione.

## Integrazione n8n Webhook

### Requisiti per il Webhook
Il webhook n8n DEVE restituire una risposta JSON contenente il campo `job_id`:

```json
{
  "job_id": "unique-job-identifier-123",
  "message": "Elaborazione avviata",
  "status": "started"
}
```

### Flusso di Lavoro

1. **Invio al Webhook**
   - L'applicazione frontend invia i dati del PDF al webhook n8n
   - Il webhook genera un `job_id` univoco e lo restituisce

2. **Creazione Record Iniziale**
   - Il workflow n8n crea un record in `rag_diagnostics`:
   ```json
   {
     "job_id": "unique-job-identifier-123",
     "status": "Ongoing",
     "workflow_name": "PDF Processing",
     "input_file": "nome_file.pdf",
     "processed": 0,
     "to_process": 100,
     "timestamp": "2026-03-20T10:00:00Z"
   }
   ```

3. **Aggiornamenti Progressivi**
   - Durante l'elaborazione, il workflow aggiorna il record:
   ```json
   {
     "job_id": "unique-job-identifier-123",
     "status": "Ongoing",
     "processed": 45,
     "to_process": 100,
     "node_name": "Current Processing Node",
     "timestamp": "2026-03-20T10:05:00Z"
   }
   ```

4. **Completamento**
   - Al termine, il workflow imposta `status` a `"Completed"`:
   ```json
   {
     "job_id": "unique-job-identifier-123",
     "status": "Completed",
     "processed": 100,
     "to_process": 100,
     "timestamp": "2026-03-20T10:10:00Z"
   }
   ```

5. **Gestione Errori**
   - In caso di errore:
   ```json
   {
     "job_id": "unique-job-identifier-123",
     "status": "Error",
     "error_message": "Descrizione errore",
     "error_code": "ERROR_CODE",
     "timestamp": "2026-03-20T10:07:00Z"
   }
   ```

## Frontend: Monitoraggio in Tempo Reale

### Funzionalità
- **Polling automatico**: Il frontend interroga Supabase ogni secondo
- **Barra di progresso**: Visualizza `processed/to_process` in percentuale
- **Informazioni dettagliate**: Mostra workflow_name, node_name, timestamp
- **Gestione errori**: Visualizza error_message in caso di problemi
- **Timeout**: Dopo 10 minuti senza completamento, mostra errore di timeout

### Stati Possibili

Il workflow attraversa diverse fasi di elaborazione. Ogni fase può avere tre stati: **Started**, **Completed**, o **Aborted**.

#### Stati di Elaborazione
1. **Parse PDF Started** → Parsing del PDF iniziato
2. **Parse PDF Completed** → Parsing del PDF completato
3. **Parse PDF Aborted** → Parsing del PDF interrotto

4. **Metadata Extraction Started** → Estrazione metadati iniziata
5. **Metadata Extraction Completed** → Estrazione metadati completata
6. **Metadata Extraction Aborted** → Estrazione metadati interrotta

7. **Embedding Started** → Creazione embeddings iniziata
8. **Embedding Completed** → Creazione embeddings completata
9. **Embedding Aborted** → Creazione embeddings interrotta

10. **Procedure Extraction Started** → Estrazione procedure iniziata
11. **Procedure Extraction Ongoing** → Estrazione procedure in corso
12. **Procedure Extraction Completed** → Estrazione procedure completata
13. **Procedure Extraction Aborted** → Estrazione procedure interrotta

14. **Add Context Started** → Aggiunta contesto iniziata
15. **Add Context Completed** → Aggiunta contesto completata
16. **Add Context Aborted** → Aggiunta contesto interrotta

17. **Semantic Fix Started** → Correzione semantica iniziata
18. **Semantic Fix Completed** → Correzione semantica completata ✅ **(STATO FINALE DI SUCCESSO)**
19. **Aborted** → Processo completamente interrotto

#### Stati Generici (Legacy)
- `Ongoing`: Elaborazione in corso
- `Completed` o `completed`: Elaborazione completata
- `Error` o `error`: Errore durante l'elaborazione

#### ⚠️ Gestione Stati "Aborted"
**IMPORTANTE**: Quando il frontend riceve uno stato che termina con "Aborted", il polling deve **fermarsi immediatamente** perché il workflow n8n ha già interrotto l'esecuzione. Non ci saranno ulteriori aggiornamenti.

## Esempio di Flusso Stati nel Workflow

Durante l'elaborazione, il workflow n8n dovrebbe aggiornare progressivamente il record in Supabase:

```
1. Parse PDF Started (processed: 0/100)
   ↓
2. Parse PDF Completed (processed: 15/100)
   ↓
3. Metadata Extraction Started (processed: 15/100)
   ↓
4. Metadata Extraction Completed (processed: 30/100)
   ↓
5. Embedding Started (processed: 30/100)
   ↓
6. Embedding Completed (processed: 50/100)
   ↓
7. Procedure Extraction Started (processed: 50/100)
   ↓
8. Procedure Extraction Ongoing (processed: 55/100)
   ↓
9. Procedure Extraction Completed (processed: 70/100)
   ↓
10. Add Context Started (processed: 70/100)
    ↓
11. Add Context Completed (processed: 85/100)
    ↓
12. Semantic Fix Started (processed: 85/100)
    ↓
13. Semantic Fix Completed (processed: 100/100) ✅ SUCCESSO
```

**In caso di errore:**
```
1. Parse PDF Started (processed: 0/100)
   ↓
2. [ERRORE]
   ↓
3. Parse PDF Aborted (processed: 0/100, error_message: "File corrotto")
   ⚠️ WORKFLOW FERMATO
```

## Esempio di Implementazione n8n

### Nodo 1: Webhook (Trigger)
```javascript
// Genera job_id univoco
const jobId = `job_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

return {
  json: {
    job_id: jobId,
    ...items[0].json
  }
};
```

### Nodo 2: Inserimento Iniziale Supabase
```javascript
// POST a Supabase rag_diagnostics
{
  "job_id": "{{$node['Webhook'].json['job_id']}}",
  "status": "Ongoing",
  "workflow_name": "PDF RAG Processing",
  "input_file": "{{$node['Webhook'].json['fileName']}}",
  "processed": 0,
  "to_process": 100
}
```

### Nodo 3-N: Aggiornamento Progressivo
```javascript
// PATCH a Supabase per ogni step
{
  "processed": 25,  // Incrementa ad ogni step
  "node_name": "Current Node Name"
}
```

### Nodo Finale: Completamento
```javascript
// PATCH a Supabase
{
  "status": "Completed",
  "processed": 100,
  "to_process": 100
}
```

### Nodo Error Handler
```javascript
// PATCH a Supabase in caso di errore
{
  "status": "Error",
  "error_message": "{{$node['ErrorNode'].json['message']}}",
  "error_code": "{{$node['ErrorNode'].json['code']}}"
}
```

## Note Importanti

1. **job_id univoco**: Usare sempre un identificatore univoco per ogni job
2. **Timestamp automatico**: Supabase aggiorna automaticamente il timestamp
3. **Polling frequenza**: Il frontend fa polling ogni 1 secondo
4. **Timeout**: Dopo 10 minuti il frontend smette di fare polling
5. **Stato finale**: Il processo si considera completo quando `status === 'Completed'` o c'è un errore

## Troubleshooting

### Il frontend non riceve aggiornamenti
- Verificare che il `job_id` sia corretto
- Controllare i permessi RLS su Supabase
- Verificare che la Supabase Anon Key sia corretta

### Il polling non si ferma
- Verificare che lo status finale sia esattamente `"Completed"` (case-sensitive)
- Controllare che non ci siano errori nel workflow n8n

### Errori di connessione
- Verificare l'URL Supabase
- Controllare la validità della Anon Key
- Verificare la configurazione CORS su Supabase
