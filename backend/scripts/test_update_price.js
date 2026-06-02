const fetch = global.fetch || require('node-fetch');
const base = 'http://localhost:3000';
(async()=>{
  try{
    const loginRes = await fetch(base + '/api/auth/login',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({email:'ayusaniatuss@student.uns.ac.id',password:'password123'})});
    const login = await loginRes.json();
    if(!loginRes.ok){console.error('login failed',login);return}
    const token = login.token;
    const id = 2; // product id
    const form = new (require('form-data'))();
    form.append('harga_platform','7777');
    const res = await fetch(base + '/api/makanan/' + id, {method:'PUT', headers: { Authorization: 'Bearer ' + token }, body: form});
    const txt = await res.text();
    console.log(res.status, txt);
  }catch(e){console.error(e)}
})();
