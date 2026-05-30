const fs = require('fs');
const p = require('path');
const s = 'd:/Nia/lomba/ResFood/frontend/src';

let uc = fs.readFileSync(p.join(s, 'pages/UploadPage.jsx'), 'utf8');
let ec = uc
  .replace(/UploadPage/g, 'EditProductPage')
  .replace('Donasikan Makananmu', 'Edit Item Anda')
  .replace('Bantu kurangi limbah makanan dan berikan dampak nyata bagi warga Solo.', 'Perbarui detail makanan atau produk organik yang Anda tawarkan.')
  .replace('Daftarkan Makanan', 'Simpan Perubahan');
fs.writeFileSync(p.join(s, 'pages/EditProductPage.jsx'), ec);

let ac = fs.readFileSync(p.join(s, 'App.jsx'), 'utf8');
if(!ac.includes('EditProductPage')) {
  ac = ac.replace("import AdminDashboardPage from './pages/AdminDashboardPage';", "import AdminDashboardPage from './pages/AdminDashboardPage';\nimport EditProductPage from './pages/EditProductPage';");
  ac = ac.replace('<Route path="/admin" element={<AdminDashboardPage />} />', '<Route path="/admin" element={<AdminDashboardPage />} />\n        <Route path="/edit-produk" element={<EditProductPage />} />');
  fs.writeFileSync(p.join(s, 'App.jsx'), ac);
}

let cc = fs.readFileSync(p.join(s, 'pages/CatalogPage.jsx'), 'utf8');
cc = cc.replace(/to="\/detail"([^>]*?>\s*Kelola Item)/g, 'to="/edit-produk"$1');
cc = cc.replace(/<button([^>]+)>\s*Kelola Item\s*<\/button>/g, '<Link to="/edit-produk"$1>\n                  Kelola Item\n                </Link>');
fs.writeFileSync(p.join(s, 'pages/CatalogPage.jsx'), cc);

console.log('Script ran successfully.');
