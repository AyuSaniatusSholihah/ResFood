const fetch = global.fetch || require('node-fetch');
const base = 'http://localhost:3000';

(async () => {
  try {
    // 1) login
    const loginRes = await fetch(base + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ayusaniatuss@student.uns.ac.id', password: 'password123' })
    });
    const loginJson = await loginRes.json();
    console.log('Login status', loginRes.status, loginJson.message || 'ok');
    if (!loginRes.ok) return process.exit(1);
    const token = loginJson.token;

    // 2) post makanan (JSON body, no file)
    const tgl = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
    const postBody = {
      nama: 'Tes Makanan Otomatis',
      deskripsi: 'Ini deskripsi otomatis',
      hargaAsli: 12000,
      tglExpired: tgl,
      stok: 3
    };

    const postRes = await fetch(base + '/api/makanan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify(postBody)
    });
    const postJson = await postRes.json().catch(() => ({}));
    console.log('POST /api/makanan status:', postRes.status);
    console.log('Response:', JSON.stringify(postJson, null, 2));
  } catch (e) {
    console.error('Test script error:', e && e.stack ? e.stack : e);
  }
})();
