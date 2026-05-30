const fs = require('fs');

const adminPage = 'd:/Nia/lomba/ResFood/frontend/src/pages/AdminDashboardPage.jsx';
let content = fs.readFileSync(adminPage, 'utf8');

// 1. Add imports and state hooks
content = content.replace(
  "import React from 'react';",
  "import React, { useState, useEffect } from 'react';"
);

// 2. Add State and useEffect inside the component
const componentStartRegex = /export default function AdminDashboardPage\(\) \{/;
const stateAndEffect = `export default function AdminDashboardPage() {
  const [stats, setStats] = useState({
    total_pangan: 0, reduksi_co2: 0, user_aktif: 0, listing_layak: 0, listing_tidak: 0, listing_total: 0
  });
  const [antrean, setAntrean] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': \`Bearer \${token}\` };

      const [statsRes, antreanRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/admin/makanan-menunggu', { headers }),
        fetch('/api/admin/users', { headers })
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (antreanRes.ok) setAntrean(await antreanRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleStatusUpdate = async (id, status) => {
    if (!window.confirm(\`Yakin ingin mengubah status menjadi \${status}?\`)) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(\`/api/admin/makanan/\${id}/status\`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': \`Bearer \${token}\`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        alert('Berhasil!');
        fetchAdminData();
      } else {
        alert('Gagal mengubah status');
      }
    } catch (err) {
      alert('Terjadi kesalahan');
    }
  };
`;
content = content.replace(componentStartRegex, stateAndEffect);

// 3. Replace Stats Numbers
content = content.replace(">1.248 Kg<", ">{stats.total_pangan} Kg<");
content = content.replace(">3.120 Ton<", ">{stats.reduksi_co2} Kg<");
content = content.replace(">2,840<", ">{stats.user_aktif}<");
content = content.replace(">840 Layak<", ">{stats.listing_layak} Layak<");
content = content.replace(">312 Tidak<", ">{stats.listing_tidak} Tidak<");
content = content.replace(">1,152<", ">{stats.listing_total}<");

// 4. Replace Antrean Persetujuan Listing
const tbodyAntreanRegex = /<tbody className="divide-y divide-outline-variant">([\s\S]*?)<\/tbody>/;
const dynamicAntrean = `<tbody className="divide-y divide-outline-variant">
                {antrean.length === 0 ? (
                  <tr><td colSpan="5" className="p-4 text-center text-on-surface-variant">Tidak ada antrean persetujuan.</td></tr>
                ) : (
                  antrean.map(item => (
                    <tr key={item.id} className="hover:bg-surface-container-low transition-all">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-surface-variant overflow-hidden flex-shrink-0">
                            <img alt={item.nama} className="w-full h-full object-cover" src={item.foto}/>
                          </div>
                          <div>
                            <p className="font-label-md text-label-md text-on-surface">{item.nama}</p>
                            <p className="text-xs text-on-surface-variant">{item.stok} Stok</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-body-md text-body-md text-on-surface">{item.penyedia?.nama || 'Unknown'}</td>
                      <td className="px-6 py-4">
                        <span className={\`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap \${item.jalur === 'A' ? 'bg-secondary-container text-on-secondary-container' : 'bg-[#D7CCC8] text-[#795548]'}\`}>
                          {item.jalur === 'A' ? 'Layak Konsumsi' : 'Tidak Layak'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs font-semibold">{new Date(item.created_at).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button onClick={() => handleStatusUpdate(item.id, 'tersedia')} className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary-container transition-all">Setujui</button>
                          <button onClick={() => handleStatusUpdate(item.id, 'ditolak')} className="px-4 py-2 border border-error text-error rounded-xl text-xs font-bold hover:bg-error-container transition-all">Tolak</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>`;
content = content.replace(tbodyAntreanRegex, dynamicAntrean);

// 5. Replace Manajemen Pengguna Table
const tbodyUsersRegex = /<tbody className="divide-y divide-outline-variant"(?:(?!<tbody)[\s\S])*?(?!<\/table>)<\/tbody>/;
// Wait, regex might match the wrong tbody. Let's just do an index-based search.
const tbodys = content.split('<tbody className="divide-y divide-outline-variant">');
if (tbodys.length >= 3) {
  // tbodys[0] is everything before first tbody
  // tbodys[1] is first tbody (Antrean) - already replaced
  // tbodys[2] is second tbody (Users)
  
  const endOfUsers = tbodys[2].indexOf('</tbody>');
  const dynamicUsers = `
                {users.length === 0 ? (
                  <tr><td colSpan="5" className="p-4 text-center text-on-surface-variant">Memuat data pengguna...</td></tr>
                ) : (
                  users.map(u => (
                    <tr key={u.id} className="hover:bg-surface-container-low transition-all">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-primary flex-shrink-0">
                            {u.nama.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-label-md text-label-md text-on-surface">{u.nama}</p>
                            <p className="text-xs text-on-surface-variant">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-body-md text-body-md capitalize">{u.role}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-primary">{u.poin || 0} pt</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="flex items-center gap-1 text-primary text-xs font-bold uppercase whitespace-nowrap">
                          <span className="w-2 h-2 bg-primary rounded-full"></span> Aktif
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="p-2 hover:bg-surface-container-high rounded-lg transition-all">
                          <span className="material-symbols-outlined text-on-surface-variant">more_vert</span>
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              `;
  tbodys[2] = dynamicUsers + tbodys[2].substring(endOfUsers);
  content = tbodys.join('<tbody className="divide-y divide-outline-variant">');
}

fs.writeFileSync(adminPage, content, 'utf8');
console.log('AdminDashboardPage updated!');
