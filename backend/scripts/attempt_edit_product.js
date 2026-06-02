const fetch = global.fetch || require('node-fetch');
const FormData = require('form-data');
const base = 'http://localhost:3000';
(async()=>{
  try{
    // login
    const loginRes = await fetch(base + '/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'ayusaniatuss@student.uns.ac.id',password:'password123'})});
    const login = await loginRes.json();
    console.log('login status', loginRes.status, login.message || login.token ? 'ok' : 'no');
    if(!loginRes.ok){console.error('Login failed', login); return}
    const token = login.token;
    // get one product for this penyedia
    const mRes = await fetch(base + '/api/makanan');
    const all = await mRes.json();
    const mine = all.find(x => x.penyediaId === 11 || (x.penyedia && x.penyedia.id === 11));
    console.log('found product', !!mine, mine && mine.id);
    if(!mine){ console.error('No product found for penyedia 11'); return }
    const id = mine.id;
    const form = new FormData();
    form.append('harga_platform', '9999');
    const res = await fetch(base + '/api/makanan/' + id, {method:'PUT', headers:{ Authorization: 'Bearer ' + token }, body: form});
    const text = await res.text();
    console.log('PUT status', res.status);
    console.log('PUT response', text);
  }catch(e){console.error(e && e.stack ? e.stack : e)}
})();
