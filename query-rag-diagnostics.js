// Script per interrogare la tabella rag_diagnostics
// Esegui con: node query-rag-diagnostics.js

const SUPABASE_URL = 'https://tpsywkjczdtmdhpjqmyi.supabase.co';
const SUPABASE_KEY = 'YOUR_SUPABASE_ANON_KEY'; // Inserisci la tua chiave

// ============= FUNZIONI DI QUERY =============

async function getAllRecords() {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rag_diagnostics?order=timestamp.desc`, {
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
        }
    });
    return await response.json();
}

async function getRecordsByJobId(jobId) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rag_diagnostics?job_id=eq.${jobId}&order=timestamp.desc`, {
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
        }
    });
    return await response.json();
}

async function getRecordsByStatus(status) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rag_diagnostics?status=eq.${status}&order=timestamp.desc`, {
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
        }
    });
    return await response.json();
}

async function getRecentRecords(limit = 10) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/rag_diagnostics?order=timestamp.desc&limit=${limit}`, {
        headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
        }
    });
    return await response.json();
}

async function getRecordsByDateRange(startDate, endDate) {
    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/rag_diagnostics?timestamp=gte.${startDate}&timestamp=lte.${endDate}&order=timestamp.desc`,
        {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        }
    );
    return await response.json();
}

async function getOngoingJobs() {
    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/rag_diagnostics?status=eq.Ongoing&order=timestamp.desc`,
        {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        }
    );
    return await response.json();
}

async function getErrorRecords() {
    const response = await fetch(
        `${SUPABASE_URL}/rest/v1/rag_diagnostics?or=(status.eq.Error,error_message.not.is.null)&order=timestamp.desc`,
        {
            headers: {
                'apikey': SUPABASE_KEY,
                'Authorization': `Bearer ${SUPABASE_KEY}`
            }
        }
    );
    return await response.json();
}

// ============= ESEMPI DI USO =============

async function main() {
    try {
        console.log('=== Ultimi 10 record ===');
        const recent = await getRecentRecords(10);
        console.table(recent);

        console.log('\n=== Job in corso ===');
        const ongoing = await getOngoingJobs();
        console.table(ongoing);

        console.log('\n=== Record con errori ===');
        const errors = await getErrorRecords();
        console.table(errors);

        // Esempio: cerca per job_id specifico
        // const jobRecords = await getRecordsByJobId('job_1234567890_abc123');
        // console.log('\n=== Record per Job ID ===');
        // console.table(jobRecords);

        // Esempio: cerca per range di date
        // const startDate = '2026-03-20T00:00:00';
        // const endDate = '2026-03-20T23:59:59';
        // const dateRecords = await getRecordsByDateRange(startDate, endDate);
        // console.log('\n=== Record per Data ===');
        // console.table(dateRecords);

    } catch (error) {
        console.error('Errore:', error.message);
    }
}

// Esegui se chiamato direttamente
if (require.main === module) {
    main();
}

module.exports = {
    getAllRecords,
    getRecordsByJobId,
    getRecordsByStatus,
    getRecentRecords,
    getRecordsByDateRange,
    getOngoingJobs,
    getErrorRecords
};
