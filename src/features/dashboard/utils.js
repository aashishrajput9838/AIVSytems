export function exportResultsToCsv(testResults) {
  if (!testResults?.length) return;
  const headers = [
    'id', 'title', 'user_query', 'model_response', 'expected_min', 'expected_max', 'score', 'result', 'notes', 'validators'
  ];
  const esc = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;
  const rows = testResults.map(r => {
    const validators = (r.validators || [])
      .map(v => `${v.name}:${typeof v.score === 'number' ? v.score.toFixed(2) : v.score}`)
      .join('; ');
    return [
      r.id,
      r.title,
      r.userQuery,
      r.modelResponse,
      typeof r.expectedMinScore === 'number' ? r.expectedMinScore : '',
      typeof r.expectedMaxScore === 'number' ? r.expectedMaxScore : '',
      typeof r.score === 'number' ? r.score.toFixed(3) : '',
      typeof r.pass === 'boolean' ? (r.pass ? 'PASS' : 'FAIL') : '',
      r.notes || '',
      validators,
    ];
  });
  const csv = [headers, ...rows].map(row => row.map(esc).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `validation_test_results_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function exportLogsToCsv(logs) {
  if (!logs?.length) return;
  const headers = [
    'id','timestamp','user_query','model_response','validation_score','entity_type','external_verification_required','notes','created_by','source'
  ];
  const esc = (val) => `"${String(val ?? '').replace(/"/g, '""')}"`;
  const rows = logs.map(l => [
    l.id || '',
    l.timestamp?.seconds ? new Date(l.timestamp.seconds * 1000).toISOString() : (l.timestamp || ''),
    l.user_query || '',
    l.model_response || '',
    typeof l.validation_score === 'number' ? Number(l.validation_score).toFixed(3) : '',
    l.entity_info?.entityType || '',
    l.external_verification_required ? 'true' : 'false',
    l.notes || '',
    l.created_by || '',
    l.source || '',
  ]);
  const csv = [headers, ...rows].map(r => r.map(esc).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `logs_${Date.now()}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}


