import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import MobileNav from '../components/MobileNav';

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { token, logout, isAdmin } = useAuth();
  
  const [stats, setStats] = useState({
    totalMakananTerdaftar: 0,
    totalTransaksi: 0,
    totalUserAktif: 0,
    totalPenyedia: 0
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const fetchAdminData = async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      const [statsRes, usersRes] = await Promise.all([
        fetch('/api/admin/dashboard', { headers }),
        fetch('/api/admin/users', { headers })
      ]);

      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData);
      }
      if (usersRes.ok) {
        const usersData = await usersRes.json();
        setUsers(usersData);
      }
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token || !isAdmin()) {
      alert('Akses Ditolak: Halaman ini hanya untuk Administrator!');
      navigate('/dashboard');
      return;
    }
    fetchAdminData();
  }, [token, navigate]);

  const handleToggleUser = async (targetUser) => {
    const actionText = targetUser.isActive ? 'BANNED (Nonaktifkan)' : 'AKTIFKAN';
    const confirm = window.confirm(`Apakah Anda yakin ingin mengubah status user "${targetUser.nama}" menjadi ${actionText}?`);
    if (!confirm) return;

    setActionLoadingId(targetUser.id);
    try {
      const response = await fetch(`/api/admin/users/${targetUser.id}/toggle`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      if (response.ok) {
        alert(data.message || 'Status user berhasil diperbarui.');
        fetchAdminData();
      } else {
        alert('Gagal memperbarui status user: ' + data.message);
      }
    } catch (err) {
      alert('Terjadi kesalahan koneksi.');
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen pb-24 md:pb-12 font-sans">
      <Header />

      <main className="mx-auto w-full max-w-md px-4 py-6 md:max-w-4xl md:px-8">
        
        {/* Title & Logout */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-xl font-extrabold text-gray-800 md:text-2xl">Admin Portal</h1>
            <p className="text-[11px] text-gray-500 mt-0.5">Pantauan sirkulasi pangan Kota Solo (Real-time)</p>
          </div>
          <button 
            onClick={logout}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100 rounded-xl hover:bg-rose-100 transition-colors shadow-sm"
          >
            <span className="material-symbols-outlined text-sm font-semibold">logout</span>
            Keluar
          </button>
        </div>

        {loading ? (
          <div className="flex h-64 flex-col items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-[#1D9E75]"></div>
            <p className="mt-3 text-xs text-gray-500 font-medium">Memuat data administratif...</p>
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              
              {/* Stat 1 */}
              <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="w-8 h-8 rounded-xl bg-green-50 text-[#1D9E75] flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">restaurant</span>
                </div>
                <div className="mt-4">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Makanan</p>
                  <p className="text-xl font-black text-gray-800 mt-0.5">{stats.totalMakananTerdaftar}</p>
                </div>
              </div>

              {/* Stat 2 */}
              <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="w-8 h-8 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">receipt_long</span>
                </div>
                <div className="mt-4">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Transaksi</p>
                  <p className="text-xl font-black text-gray-800 mt-0.5">{stats.totalTransaksi}</p>
                </div>
              </div>

              {/* Stat 3 */}
              <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-500 flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">people</span>
                </div>
                <div className="mt-4">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">User Aktif</p>
                  <p className="text-xl font-black text-gray-800 mt-0.5">{stats.totalUserAktif}</p>
                </div>
              </div>

              {/* Stat 4 */}
              <div className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-500 flex items-center justify-center">
                  <span className="material-symbols-outlined text-sm">storefront</span>
                </div>
                <div className="mt-4">
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Total Penyedia</p>
                  <p className="text-xl font-black text-gray-800 mt-0.5">{stats.totalPenyedia}</p>
                </div>
              </div>

            </div>

            {/* Users Table / List */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-800">Manajemen Pengguna (Role: USER)</h3>
                <p className="text-[10px] text-gray-400">Total terdaftar: {users.length} pengguna</p>
              </div>

              {/* Mobile List View (Hidden on larger screens) */}
              <div className="block md:hidden divide-y divide-gray-100">
                {users.length === 0 ? (
                  <p className="p-4 text-center text-xs text-gray-400">Belum ada user terdaftar.</p>
                ) : (
                  users.map(u => (
                    <div key={u.id} className="p-4 flex flex-col gap-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-xs font-bold text-gray-800">{u.nama}</p>
                          <p className="text-[10px] text-gray-400">{u.email}</p>
                        </div>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                          u.isActive ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
                        }`}>
                          {u.isActive ? 'Aktif' : 'Banned'}
                        </span>
                      </div>
                      <div className="flex justify-between items-center text-[10px] text-gray-500 pt-1 border-t border-gray-50">
                        <span>Pangan Terdaftar: <strong className="text-gray-800">{u.jumlahMakananTerdaftar}</strong></span>
                        <button
                          onClick={() => handleToggleUser(u)}
                          disabled={actionLoadingId === u.id}
                          className={`px-3 py-1 rounded-lg text-[10px] font-bold border transition-colors ${
                            u.isActive
                              ? 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100'
                              : 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100'
                          }`}
                        >
                          {actionLoadingId === u.id ? 'Memproses...' : u.isActive ? 'Ban User' : 'Aktifkan'}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Desktop Table View (Hidden on mobile) */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-100">
                      <th className="px-6 py-3 text-xs font-bold text-gray-500">Nama Pengguna</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500">Email</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500">Pangan Terdaftar</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500">Status</th>
                      <th className="px-6 py-3 text-xs font-bold text-gray-500 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-xs">
                    {users.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-400">Belum ada user terdaftar.</td>
                      </tr>
                    ) : (
                      users.map(u => (
                        <tr key={u.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4 font-bold text-gray-800">{u.nama}</td>
                          <td className="px-6 py-4 text-gray-600">{u.email}</td>
                          <td className="px-6 py-4 font-medium text-gray-700">{u.jumlahMakananTerdaftar} Makanan</td>
                          <td className="px-6 py-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase border ${
                              u.isActive ? 'bg-green-50 text-green-700 border-green-100' : 'bg-rose-50 text-rose-700 border-rose-100'
                            }`}>
                              {u.isActive ? 'Aktif' : 'Banned'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => handleToggleUser(u)}
                              disabled={actionLoadingId === u.id}
                              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold border transition-colors ${
                                u.isActive
                                  ? 'bg-rose-50 text-rose-600 border-rose-100 hover:bg-rose-100'
                                  : 'bg-green-50 text-green-600 border-green-100 hover:bg-green-100'
                              }`}
                            >
                              {actionLoadingId === u.id ? 'Memproses...' : u.isActive ? 'Ban User' : 'Aktifkan'}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      <MobileNav />
    </div>
  );
}
