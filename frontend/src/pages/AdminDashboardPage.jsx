import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import MobileNav from '../components/MobileNav';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    total_pangan: 0, reduksi_co2: 0, user_aktif: 0, listing_layak: 0, listing_tidak: 0, listing_total: 0
  });
  const [pembayaranList, setPembayaranList] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAdminData = async () => {
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [statsRes, pembayaranRes, usersRes] = await Promise.all([
        fetch('/api/admin/stats', { headers }),
        fetch('/api/admin/pembayaran', { headers }),
        fetch('/api/admin/users', { headers })
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (pembayaranRes.ok) setPembayaranList(await pembayaranRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
    } catch (err) {
      console.error('Error fetching admin data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Route guard check
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (!userStr || !token) {
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      if (user.role !== 'admin') {
        alert('Akses Ditolak: Halaman ini hanya untuk Administrator!');
        navigate('/login');
        return;
      }
    } catch (e) {
      navigate('/login');
      return;
    }

    fetchAdminData();
  }, [navigate]);

  const handleVerifyPayment = async (id, status) => {
    if (!window.confirm(`Yakin ingin memverifikasi pembayaran ini sebagai ${status === 'lunas' ? 'SETUJU (LUNAS)' : 'DITOLAK'}?`)) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`/api/admin/pembayaran/${id}/verifikasi`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        alert('Berhasil memverifikasi pembayaran!');
        fetchAdminData();
      } else {
        alert('Gagal memverifikasi pembayaran');
      }
    } catch (err) {
      alert('Terjadi kesalahan');
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-24 md:pb-0">
      {/* TopAppBar */}
      <Header />

      <main className="max-w-[1440px] mx-auto px-8 md:px-12 py-8 space-y-8">
        {/* Header & Date Range */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="font-headline-lg text-headline-lg text-on-surface">Admin Dashboard</h2>
            <p className="text-on-surface-variant font-body-md text-body-md">Pantauan real-time sirkulasi pangan Kota Solo.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center bg-surface-container-lowest border border-outline-variant rounded-xl px-4 py-2 gap-3 shadow-sm">
              <span className="material-symbols-outlined text-primary">calendar_today</span>
              <span className="font-label-md text-label-md text-on-surface">Mei 2024 - Hari Ini</span>
            </div>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = '/login';
              }}
              className="flex items-center bg-error-container text-error border border-error/20 rounded-xl px-4 py-2 gap-2 shadow-sm hover:bg-error/10 transition-colors font-bold cursor-pointer"
            >
              <span className="material-symbols-outlined">logout</span>
              Logout
            </button>
          </div>
        </div>

        {/* High-Level Stats Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stat 1 */}
          <div className="p-6 bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-white flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-secondary-container rounded-lg">
                <span className="material-symbols-outlined text-on-secondary-container">restaurant</span>
              </div>
              <span className="text-primary font-bold text-label-md flex items-center gap-1">
                +12% <span className="material-symbols-outlined text-sm">trending_up</span>
              </span>
            </div>
            <div>
              <p className="text-on-surface-variant font-label-md text-label-md">Total Pangan Diselamatkan</p>
              <p className="text-on-surface font-headline-md text-headline-md">{stats.total_pangan} Kg</p>
            </div>
          </div>
          
          {/* Stat 2 */}
          <div className="p-6 bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-white flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-primary-container rounded-lg text-white">
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>eco</span>
              </div>
              <span className="text-primary font-bold text-label-md flex items-center gap-1">
                +8% <span className="material-symbols-outlined text-sm">trending_up</span>
              </span>
            </div>
            <div>
              <p className="text-on-surface-variant font-label-md text-label-md">Reduksi CO2</p>
              <p className="text-on-surface font-headline-md text-headline-md">{stats.reduksi_co2} Kg</p>
            </div>
          </div>
          
          {/* Stat 3 */}
          <div className="p-6 bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-white flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-secondary-container rounded-lg">
                <span className="material-symbols-outlined text-on-secondary-container">groups</span>
              </div>
              <span className="text-primary font-bold text-label-md flex items-center gap-1">
                +45 <span className="material-symbols-outlined text-sm">arrow_upward</span>
              </span>
            </div>
            <div>
              <p className="text-on-surface-variant font-label-md text-label-md">User Aktif</p>
              <p className="text-on-surface font-headline-md text-headline-md">{stats.user_aktif}</p>
            </div>
          </div>
          
          {/* Stat 4 */}
          <div className="p-6 bg-surface-container-lowest rounded-xl shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-white flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="p-3 bg-tertiary-container rounded-lg text-white">
                <span className="material-symbols-outlined">inventory</span>
              </div>
              <div className="flex flex-col items-end">
                <span className="text-primary font-bold text-label-sm">{stats.listing_layak} Layak</span>
                <span className="text-tertiary font-bold text-label-sm">{stats.listing_tidak} Tidak</span>
              </div>
            </div>
            <div>
              <p className="text-on-surface-variant font-label-md text-label-md">Listing Listing Aktif</p>
              <p className="text-on-surface font-headline-md text-headline-md">{stats.listing_total}</p>
            </div>
          </div>
        </div>

        {/* Middle Section: Heatmap & Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Solo Waste Heatmap */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-headline-sm text-headline-sm text-on-surface">Peta Intensitas Limbah Solo</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-primary text-white rounded-full text-xs font-semibold">Layak</span>
                <span className="px-3 py-1 bg-tertiary text-white rounded-full text-xs font-semibold">Tidak Layak</span>
              </div>
            </div>
            <div className="relative h-[400px] w-full rounded-2xl overflow-hidden bg-surface-container-high shadow-lg border border-outline-variant">
              <div className="absolute inset-0 bg-cover bg-center" style={{backgroundImage: "url('https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1200&q=80')"}}>
                {/* Heatmap Overlay Effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-transparent pointer-events-none"></div>
                {/* Representative Markers */}
                <div className="absolute top-1/4 left-1/3 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                <div className="absolute bottom-1/3 right-1/4 w-32 h-32 bg-tertiary/20 rounded-full blur-xl animate-pulse"></div>
              </div>
              {/* Zoom Controls */}
              <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-surface-container-low">
                  <span className="material-symbols-outlined">add</span>
                </button>
                <button className="w-10 h-10 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-surface-container-low">
                  <span className="material-symbols-outlined">remove</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Activity Feed */}
          <div className="space-y-4">
            <h3 className="font-headline-sm text-headline-sm text-on-surface">Aktivitas Terbaru</h3>
            <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant p-6 h-[400px] overflow-y-auto shadow-sm space-y-6">
              {/* Feed Item 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-on-secondary-container">check_circle</span>
                </div>
                <div className="space-y-1">
                  <p className="font-label-md text-label-md text-on-surface">Restoran Sederhana menyumbang 5kg Nasi Padang</p>
                  <p className="text-xs text-on-surface-variant">2 menit yang lalu • Laweyan</p>
                </div>
              </div>
              {/* Feed Item 2 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">eco</span>
                </div>
                <div className="space-y-1">
                  <p className="font-label-md text-label-md text-on-surface">Peternakan Ayam Joyo mengambil 10kg sisa sayur</p>
                  <p className="text-xs text-on-surface-variant">15 menit yang lalu • Jebres</p>
                </div>
              </div>
              {/* Feed Item 3 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-white">person_add</span>
                </div>
                <div className="space-y-1">
                  <p className="font-label-md text-label-md text-on-surface">User baru 'Admin Solo Square' terverifikasi</p>
                  <p className="text-xs text-on-surface-variant">1 jam yang lalu • Banjarsari</p>
                </div>
              </div>
              {/* Feed Item 4 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-error-container flex items-center justify-center">
                  <span className="material-symbols-outlined text-error">warning</span>
                </div>
                <div className="space-y-1">
                  <p className="font-label-md text-label-md text-on-surface">Laporan listing kadaluarsa: Roti Bakar 88</p>
                  <p className="text-xs text-on-surface-variant">3 jam yang lalu • Serengan</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Verification Queue Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">Verifikasi Pembayaran Manual</h3>
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">{pembayaranList.length} Antrean</span>
          </div>
          <div className="overflow-x-auto bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant">
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Pemesan</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Item Makanan</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Jumlah Pembayaran</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Bukti Transfer</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {pembayaranList.length === 0 ? (
                  <tr><td colSpan="5" className="p-8 text-center text-on-surface-variant">Tidak ada antrean pembayaran yang perlu diverifikasi.</td></tr>
                ) : (
                  pembayaranList.map(item => (
                    <tr key={item.id} className="hover:bg-surface-container-low transition-all">
                      <td className="px-6 py-4">
                        <p className="font-bold text-on-surface">{item.transaksi?.pemesan?.nama || 'Unknown'}</p>
                        <p className="text-xs text-on-surface-variant">{item.transaksi?.pemesan?.email}</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-semibold text-on-surface">{item.transaksi?.makanan?.nama || 'Item Makanan'}</p>
                        <p className="text-xs text-on-surface-variant">{item.transaksi?.jumlah} Porsi</p>
                      </td>
                      <td className="px-6 py-4">
                        <p className="font-bold text-primary">Rp {parseFloat(item.jumlah).toLocaleString('id-ID')}</p>
                        <p className="text-[10px] uppercase font-bold text-on-surface-variant">{item.metode}</p>
                      </td>
                      <td className="px-6 py-4">
                        {item.bukti_transfer ? (
                          <div className="w-16 h-16 rounded-lg overflow-hidden border border-outline-variant bg-surface-container shadow-sm flex items-center justify-center">
                            <img 
                              alt="Bukti Transfer" 
                              className="w-full h-full object-cover cursor-pointer hover:scale-110 transition-transform" 
                              src={item.bukti_transfer} 
                              onClick={() => window.open(item.bukti_transfer)}
                              title="Klik untuk memperbesar"
                            />
                          </div>
                        ) : (
                          <span className="text-xs text-error">Tidak ada file</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <button 
                            onClick={() => handleVerifyPayment(item.id, 'lunas')} 
                            className="px-4 py-2 bg-primary text-white rounded-xl text-xs font-bold hover:bg-primary/90 transition-all"
                          >
                            Setujui
                          </button>
                          <button 
                            onClick={() => handleVerifyPayment(item.id, 'ditolak')} 
                            className="px-4 py-2 border border-error text-error rounded-xl text-xs font-bold hover:bg-error/10 transition-all"
                          >
                            Tolak
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* User Management Table */}
        <div className="space-y-4">
          <h3 className="font-headline-sm text-headline-sm text-on-surface">Manajemen Pengguna</h3>
          <div className="overflow-x-auto bg-surface-container-lowest rounded-2xl border border-outline-variant shadow-sm">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-surface-container border-b border-outline-variant">
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">User</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Peran</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Skor Dampak</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant">Status</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-on-surface-variant text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
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
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full py-12 px-8 md:px-12 flex flex-col md:flex-row justify-between items-center gap-4 bg-surface-container-highest border-t border-outline-variant mt-8 mb-20 md:mb-0">
        <div className="flex flex-col gap-2">
          <p className="text-headline-md font-headline-md text-on-surface">ResFood</p>
          <p className="text-body-md font-body-md text-on-surface-variant">© 2024 ResFood Solo. Memberdayakan Ekonomi Sirkular.</p>
        </div>
        <div className="flex gap-6">
          <Link to="#" className="text-on-surface-variant hover:text-primary transition-all font-label-lg text-label-lg">Tentang Kami</Link>
          <Link to="#" className="text-on-surface-variant hover:text-primary transition-all font-label-lg text-label-lg">Kebijakan Privasi</Link>
          <Link to="#" className="text-on-surface-variant hover:text-primary transition-all font-label-lg text-label-lg">Hubungi Kami</Link>
          <Link to="#" className="text-on-surface-variant hover:text-primary transition-all font-label-lg text-label-lg">Syarat & Ketentuan</Link>
        </div>
      </footer>

      {/* BottomNavBar (Mobile Only) */}
      <MobileNav />
    </div>
  );
}
