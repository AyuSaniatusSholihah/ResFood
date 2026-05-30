const fs = require('fs');
const file = 'd:/Nia/lomba/ResFood/frontend/src/pages/UploadPage.jsx';
let content = fs.readFileSync(file, 'utf8');

// 1. Add foto state
content = content.replace(
  "const [loading, setLoading] = useState(false);",
  "const [loading, setLoading] = useState(false);\n  const [foto, setFoto] = useState(null);"
);

// 2. Modify handleSubmit to use FormData
const oldSubmit = `const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:3000/api/makanan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${token}\`
        },
        body: JSON.stringify({
          nama,
          deskripsi: deskripsi || activeCategory,
          harga_asli: price || 0,
          jalur: condition === 'edible' ? 'A' : 'B',
          tgl_expired: tglExpired,
          stok: parseInt(stok)
        })
      });`;

const newSubmit = `const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const formData = new FormData();
      formData.append('nama', nama);
      formData.append('deskripsi', deskripsi || activeCategory || '');
      formData.append('harga_asli', price || 0);
      formData.append('jalur', condition === 'edible' ? 'A' : 'B');
      formData.append('tgl_expired', tglExpired);
      formData.append('stok', stok);
      if (foto) {
        formData.append('foto', foto);
      }

      const res = await fetch('http://localhost:3000/api/makanan', {
        method: 'POST',
        headers: {
          'Authorization': \`Bearer \${token}\`
        },
        body: formData
      });`;

content = content.replace(oldSubmit, newSubmit);

// 3. Add input file inside the UI
const oldFileUI = `<div className="border-2 border-dashed border-outline-variant rounded-xl p-10 flex flex-col items-center justify-center bg-surface hover:bg-surface-container-low transition-colors cursor-pointer group">
              <span className="material-symbols-outlined text-4xl text-primary mb-3 group-hover:scale-110 transition-transform">add_a_photo</span>
              <p className="font-body-md text-body-md text-on-surface-variant text-center">Tarik dan lepas foto atau <span className="text-primary font-bold">Pilih File</span></p>
              <p className="font-label-sm text-label-sm text-outline mt-2">Format JPG, PNG (Maks. 5MB)</p>
            </div>`;

const newFileUI = `<label className="border-2 border-dashed border-outline-variant rounded-xl p-10 flex flex-col items-center justify-center bg-surface hover:bg-surface-container-low transition-colors cursor-pointer group relative overflow-hidden">
              <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer" onChange={(e) => setFoto(e.target.files[0])} />
              {foto ? (
                <div className="flex flex-col items-center">
                  <span className="material-symbols-outlined text-4xl text-primary mb-2">check_circle</span>
                  <p className="font-body-md text-primary font-bold text-center">{foto.name}</p>
                  <p className="font-label-sm text-label-sm text-outline mt-1">Klik untuk mengganti foto</p>
                </div>
              ) : (
                <>
                  <span className="material-symbols-outlined text-4xl text-primary mb-3 group-hover:scale-110 transition-transform">add_a_photo</span>
                  <p className="font-body-md text-body-md text-on-surface-variant text-center">Tarik dan lepas foto atau <span className="text-primary font-bold">Pilih File</span></p>
                  <p className="font-label-sm text-label-sm text-outline mt-2">Format JPG, PNG (Maks. 5MB)</p>
                </>
              )}
            </label>`;

content = content.replace(oldFileUI, newFileUI);

fs.writeFileSync(file, content, 'utf8');
console.log('UploadPage file selection applied.');
