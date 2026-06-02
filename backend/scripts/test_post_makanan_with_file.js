const fs = require('fs');
const base = 'http://localhost:3000';

(async () => {
  try {
    const loginRes = await fetch(base + '/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ayusaniatuss@student.uns.ac.id', password: 'password123' })
    });
    const loginJson = await loginRes.json();
    if (!loginRes.ok) {
      console.error('Login failed:', loginJson);
      return;
    }
    const token = loginJson.token;

    const FormData = global.FormData;
    const form = new FormData();
    form.append('nama', 'Upload With File Test');
    form.append('deskripsi', 'desc file');
    form.append('hargaAsli', '15000');
    form.append('tglExpired', new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString());
    form.append('stok', '2');
    const filePath = 'D:/Nia/lomba/ResFood/backend/uploads/1779884945827-38223211.jpg';
    form.append('foto', fs.createReadStream(filePath));

    const res = await fetch(base + '/api/makanan', {
      method: 'POST',
      headers: {
        'Authorization': 'Bearer ' + token
      },
      body: form
    });

    const text = await res.text();
    console.log('Status:', res.status);
    console.log('Body:', text);
  } catch (e) {
    console.error('Error during upload test:', e && e.stack ? e.stack : e);
  }
})();
