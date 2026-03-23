-- Query SQL per interrogare rag_diagnostics

-- ============= QUERY BASE =============

-- Tutti i record ordinati per data
SELECT * FROM rag_diagnostics
ORDER BY timestamp DESC;

-- Ultimi 10 record
SELECT * FROM rag_diagnostics
ORDER BY timestamp DESC
LIMIT 10;

-- Record per un job_id specifico
SELECT * FROM rag_diagnostics
WHERE job_id = 'job_1234567890_abc123'
ORDER BY timestamp DESC;

-- ============= QUERY PER STATO =============

-- Job in corso
SELECT * FROM rag_diagnostics
WHERE status = 'Ongoing'
ORDER BY timestamp DESC;

-- Job completati
SELECT * FROM rag_diagnostics
WHERE status IN ('Completed', 'completed', 'Semantic Fix Completed')
ORDER BY timestamp DESC;

-- Job con errori
SELECT * FROM rag_diagnostics
WHERE status = 'Error' OR error_message IS NOT NULL
ORDER BY timestamp DESC;

-- Job abortiti
SELECT * FROM rag_diagnostics
WHERE status LIKE '%Aborted%'
ORDER BY timestamp DESC;

-- ============= QUERY AGGREGATE =============

-- Conta job per stato
SELECT status, COUNT(*) as count
FROM rag_diagnostics
GROUP BY status
ORDER BY count DESC;

-- Progressi medi per workflow
SELECT workflow_name,
       AVG(processed::float / NULLIF(to_process, 0) * 100) as avg_progress
FROM rag_diagnostics
WHERE to_process > 0
GROUP BY workflow_name;

-- Job più recenti con info complete
SELECT
    job_id,
    status,
    workflow_name,
    node_name,
    input_file,
    processed,
    to_process,
    ROUND(processed::numeric / NULLIF(to_process, 0) * 100, 2) as progress_percentage,
    timestamp,
    error_message
FROM rag_diagnostics
ORDER BY timestamp DESC
LIMIT 20;

-- ============= QUERY PER DATA =============

-- Record di oggi
SELECT * FROM rag_diagnostics
WHERE timestamp::date = CURRENT_DATE
ORDER BY timestamp DESC;

-- Record ultima ora
SELECT * FROM rag_diagnostics
WHERE timestamp > NOW() - INTERVAL '1 hour'
ORDER BY timestamp DESC;

-- Record per range di date
SELECT * FROM rag_diagnostics
WHERE timestamp BETWEEN '2026-03-20 00:00:00' AND '2026-03-20 23:59:59'
ORDER BY timestamp DESC;

-- ============= QUERY AVANZATE =============

-- Timeline completa di un job
SELECT
    timestamp,
    status,
    node_name,
    processed,
    to_process,
    error_message
FROM rag_diagnostics
WHERE job_id = 'job_1234567890_abc123'
ORDER BY timestamp ASC;

-- Job che hanno impiegato più tempo (differenza tra primo e ultimo record)
WITH job_times AS (
    SELECT
        job_id,
        MIN(timestamp) as start_time,
        MAX(timestamp) as end_time,
        MAX(timestamp) - MIN(timestamp) as duration
    FROM rag_diagnostics
    GROUP BY job_id
)
SELECT
    job_id,
    start_time,
    end_time,
    EXTRACT(EPOCH FROM duration) as duration_seconds
FROM job_times
ORDER BY duration DESC
LIMIT 10;

-- Job incompleti (Ongoing da più di 10 minuti)
SELECT * FROM rag_diagnostics
WHERE status = 'Ongoing'
AND timestamp < NOW() - INTERVAL '10 minutes'
ORDER BY timestamp ASC;

-- Distribuzione errori per tipo
SELECT
    error_code,
    error_message,
    COUNT(*) as occurrences
FROM rag_diagnostics
WHERE error_message IS NOT NULL
GROUP BY error_code, error_message
ORDER BY occurrences DESC;

-- ============= QUERY DI MANUTENZIONE =============

-- Elimina record più vecchi di 30 giorni
DELETE FROM rag_diagnostics
WHERE timestamp < NOW() - INTERVAL '30 days';

-- Elimina job completati più vecchi di 7 giorni
DELETE FROM rag_diagnostics
WHERE status IN ('Completed', 'Semantic Fix Completed')
AND timestamp < NOW() - INTERVAL '7 days';
