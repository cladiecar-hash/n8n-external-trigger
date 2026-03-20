#!/bin/bash
# Esempi di query REST API Supabase per rag_diagnostics
# Sostituisci YOUR_SUPABASE_ANON_KEY con la tua chiave

SUPABASE_URL="https://tpsywkjczdtmdhpjqmyi.supabase.co"
SUPABASE_KEY="YOUR_SUPABASE_ANON_KEY"

# ============= QUERY BASE =============

# Tutti i record (ordinati per data)
curl -X GET "${SUPABASE_URL}/rest/v1/rag_diagnostics?order=timestamp.desc" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" | jq

# Ultimi 10 record
curl -X GET "${SUPABASE_URL}/rest/v1/rag_diagnostics?order=timestamp.desc&limit=10" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" | jq

# Record per job_id specifico
JOB_ID="job_1234567890_abc123"
curl -X GET "${SUPABASE_URL}/rest/v1/rag_diagnostics?job_id=eq.${JOB_ID}&order=timestamp.desc" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" | jq

# ============= QUERY PER STATO =============

# Job in corso
curl -X GET "${SUPABASE_URL}/rest/v1/rag_diagnostics?status=eq.Ongoing&order=timestamp.desc" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" | jq

# Job completati
curl -X GET "${SUPABASE_URL}/rest/v1/rag_diagnostics?status=eq.Completed&order=timestamp.desc" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" | jq

# Job con errori (usando OR)
curl -X GET "${SUPABASE_URL}/rest/v1/rag_diagnostics?or=(status.eq.Error,error_message.not.is.null)&order=timestamp.desc" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" | jq

# Job abortiti
curl -X GET "${SUPABASE_URL}/rest/v1/rag_diagnostics?status=like.*Aborted*&order=timestamp.desc" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" | jq

# ============= QUERY CON FILTRI MULTIPLI =============

# Job in corso da più di 10 minuti
CUTOFF_TIME=$(date -u -d '10 minutes ago' '+%Y-%m-%dT%H:%M:%S')
curl -X GET "${SUPABASE_URL}/rest/v1/rag_diagnostics?status=eq.Ongoing&timestamp=lt.${CUTOFF_TIME}&order=timestamp.asc" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" | jq

# Job di oggi
TODAY=$(date -u '+%Y-%m-%d')
curl -X GET "${SUPABASE_URL}/rest/v1/rag_diagnostics?timestamp=gte.${TODAY}T00:00:00&order=timestamp.desc" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" | jq

# ============= SELEZIONE CAMPI SPECIFICI =============

# Solo alcuni campi
curl -X GET "${SUPABASE_URL}/rest/v1/rag_diagnostics?select=job_id,status,timestamp,processed,to_process&order=timestamp.desc&limit=10" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" | jq

# ============= COUNT E AGGREGAZIONI =============

# Conta tutti i record
curl -X GET "${SUPABASE_URL}/rest/v1/rag_diagnostics?select=count" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  -H "Prefer: count=exact" | jq

# Conta per stato (PostgREST non supporta GROUP BY, devi processare lato client)
curl -X GET "${SUPABASE_URL}/rest/v1/rag_diagnostics?select=status" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" | jq 'group_by(.status) | map({status: .[0].status, count: length})'

# ============= RICERCA FULL-TEXT =============

# Cerca nel nome del file
curl -X GET "${SUPABASE_URL}/rest/v1/rag_diagnostics?input_file=ilike.*manual*&order=timestamp.desc" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" | jq

# Cerca negli errori
curl -X GET "${SUPABASE_URL}/rest/v1/rag_diagnostics?error_message=ilike.*timeout*&order=timestamp.desc" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" | jq

# ============= RESPONSE FORMAT =============

# Output CSV
curl -X GET "${SUPABASE_URL}/rest/v1/rag_diagnostics?order=timestamp.desc&limit=10" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  -H "Accept: text/csv" > output.csv

# ============= INSERIMENTO/AGGIORNAMENTO =============

# Inserisci nuovo record (esempio da n8n)
curl -X POST "${SUPABASE_URL}/rest/v1/rag_diagnostics" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "job_id": "job_test_123",
    "status": "Ongoing",
    "workflow_name": "Test Workflow",
    "input_file": "test.pdf",
    "processed": 0,
    "to_process": 100
  }' | jq

# Aggiorna record esistente (via job_id)
curl -X PATCH "${SUPABASE_URL}/rest/v1/rag_diagnostics?job_id=eq.job_test_123" \
  -H "apikey: ${SUPABASE_KEY}" \
  -H "Authorization: Bearer ${SUPABASE_KEY}" \
  -H "Content-Type: application/json" \
  -H "Prefer: return=representation" \
  -d '{
    "status": "Completed",
    "processed": 100
  }' | jq

# ============= ELIMINAZIONE =============

# Elimina record per job_id (ATTENZIONE!)
# curl -X DELETE "${SUPABASE_URL}/rest/v1/rag_diagnostics?job_id=eq.job_test_123" \
#   -H "apikey: ${SUPABASE_KEY}" \
#   -H "Authorization: Bearer ${SUPABASE_KEY}"

# ============= MONITORING IN TEMPO REALE =============

# Watch continuo (ogni 2 secondi)
watch -n 2 "curl -s -X GET '${SUPABASE_URL}/rest/v1/rag_diagnostics?status=eq.Ongoing&order=timestamp.desc&limit=5' \
  -H 'apikey: ${SUPABASE_KEY}' \
  -H 'Authorization: Bearer ${SUPABASE_KEY}' | jq"

# ============= ESEMPI PRATICI =============

# Traccia progresso di un job specifico (polling ogni secondo)
track_job() {
    local JOB_ID=$1
    while true; do
        clear
        echo "=== Tracking Job: ${JOB_ID} ==="
        echo ""
        curl -s -X GET "${SUPABASE_URL}/rest/v1/rag_diagnostics?job_id=eq.${JOB_ID}&order=timestamp.desc&limit=1" \
          -H "apikey: ${SUPABASE_KEY}" \
          -H "Authorization: Bearer ${SUPABASE_KEY}" | jq '.[0] | {status, processed, to_process, node_name, timestamp}'

        sleep 1
    done
}

# Uso: track_job "job_1234567890_abc123"
