import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Header from '../components/Header';
import MobileNav from '../components/MobileNav';

export default function NotifikasiPage() {
  const { token, user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // Helper: hitung selisih hari & jam dari sekarang ke tglExpired
  const hitungSisaWaktu = (tglExpired) => {
    const expiry = new Date(tglExpired);
    const now = new Date();
    const diffMs = expiry.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);
    const sisaJam = diffHours % 24;
    return { diffMs, diffHours, diffDays, sisaJam };
  };

  // Format tanggal + jam kadaluarsa
  const formatExpired = (tgl) => {
    return new Date(tgl).toLocaleString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Format selisih waktu ke teks Indonesia
  const formatSisaWaktu = (diffMs, diffHours, diffDays) => {
    if (diffMs < 0) {
      const ageHours = Math.abs(diffHours);
      if (ageHours < 24) return `Sudah kadaluarsa ${ageHours} jam yang lalu`;
      return `Sudah kadaluarsa ${Math.abs(diffDays)} hari yang lalu`;
    }
    if (diffHours < 1) return 'Kurang dari 1 jam lagi!';
    if (diffHours < 24) return `${diffHours} jam lagi`;
    if (diffDays === 1) return '1 hari lagi';
    return `${diffDays} hari lagi`;
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    const buildNotifications = async () => {
      const notifs = [];

      try {
        // 1. Fetch makanan milik user (penyedia)
        const resMakanan = await fetch('/api/makanan/saya', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resMakanan.ok) {
          const makananList = await resMakanan.json();

          makananList.forEach((m) => {
            const { diffMs, diffHours, diffDays, sisaJam } = hitungSisaWaktu(m.tglExpired);

            if (diffHours <= 6 && diffMs > 0) {
              // Sangat kritis: < 6 jam lagi
              notifs.push({
                id: `expired-kritis-${m.id}`,
                title: '🚨 Segera! Hampir Kadaluarsa',
                message: `Makanan "${m.nama}" Anda akan kadaluarsa dalam ${diffHours < 1 ? 'kurang dari 1 jam' : `${diffHours} jam`}! Kadaluarsa: ${formatExpired(m.tglExpired)}. Segera pindahkan ke Jalur B agar tersalurkan.`,
                time: formatSisaWaktu(diffMs, diffHours, diffDays),
                icon: 'emergency',
                color: 'text-red-600 bg-red-50',
                priority: 1,
              });
            } else if (diffDays === 1) {
              // Kritis: H-1
              notifs.push({
                id: `expired-h1-${m.id}`,
                title: '⚠️ Reminder: H-1 Kadaluarsa (Diskon 50%)',
                message: `Makanan "${m.nama}" Anda akan kadaluarsa besok pada ${formatExpired(m.tglExpired)}. Harga otomatis dipotong 50% menjadi Rp ${(m.hargaAsli * 0.5).toLocaleString('id-ID')} agar cepat terjual.`,
                time: `Kadaluarsa: ${formatExpired(m.tglExpired)}`,
                icon: 'notifications_active',
                color: 'text-orange-600 bg-orange-50',
                priority: 2,
              });
            } else if (diffDays === 2) {
              // Perhatian: H-2
              notifs.push({
                id: `expired-h2-${m.id}`,
                title: '⏰ Info: H-2 Kadaluarsa (Diskon 20%)',
                message: `Makanan "${m.nama}" akan kadaluarsa dalam 2 hari (${formatExpired(m.tglExpired)}). Harga platform otomatis diskon 20% menjadi Rp ${(m.hargaAsli * 0.8).toLocaleString('id-ID')}.`,
                time: `Kadaluarsa: ${formatExpired(m.tglExpired)}`,
                icon: 'schedule',
                color: 'text-amber-600 bg-amber-50',
                priority: 3,
              });
            } else if (diffMs < 0 && diffMs > -(3 * 24 * 60 * 60 * 1000)) {
              // Sudah kadaluarsa tapi dalam 3 hari (Jalur B)
              notifs.push({
                id: `expired-past-${m.id}`,
                title: '🐄 Makanan Masuk Jalur B (Pakan Hewan)',
                message: `Makanan "${m.nama}" telah kadaluarsa sejak ${formatExpired(m.tglExpired)}. Otomatis dipindahkan ke Jalur B (Pakan Hewan/Non-Konsumsi). Silakan koordinasikan pengambilan.`,
                time: formatSisaWaktu(diffMs, diffHours, diffDays),
                icon: 'local_shipping',
                color: 'text-blue-600 bg-blue-50',
                priority: 4,
              });
            }
          });
        }

        // 2. Fetch transaksi masuk (sebagai penyedia) yang menunggu konfirmasi
        const resTransaksi = await fetch('/api/transaksi/masuk', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (resTransaksi.ok) {
          const transaksiList = await resTransaksi.json();
          transaksiList.forEach((t) => {
            notifs.push({
              id: `transaksi-${t.id}`,
              title: '💰 Pembayaran Masuk Menunggu Konfirmasi',
              message: `${t.pemesan?.nama || 'Seseorang'} memesan "${t.makanan?.nama}" sebanyak ${t.jumlah} porsi senilai Rp ${(t.totalBayar || 0).toLocaleString('id-ID')}. Silakan cek dan konfirmasi di Riwayat Transaksi.`,
              time: new Date(t.createdAt).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }),
              icon: 'payments',
              color: 'text-green-700 bg-green-50',
              priority: 2,
            });
          });
        }

        // Urutkan berdasarkan prioritas
        notifs.sort((a, b) => a.priority - b.priority);

      } catch (err) {
        console.error('Notifikasi fetch error:', err);
      }

      setNotifications(notifs);
      setLoading(false);
    };

    buildNotifications();
  }, [token]);

  return (
    <div className="bg-gray-50 text-gray-800 min-h-screen pb-24 font-sans flex flex-col">
      <Header />

      <main className="mx-auto w-full max-w-md flex-grow px-4 py-6 md:max-w-2xl md:px-8">

        {/* Header Title */}
        <div className="mb-5">
          <h1 className="text-lg font-black text-gray-800">Pemberitahuan</h1>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Notifikasi real-time — kadaluarsa makanan & transaksi masuk Anda.
          </p>
        </div>

        {/* Legend */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-5 shadow-sm">
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Sistem Klasifikasi Jalur Otomatis</p>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="bg-green-50 rounded-xl p-2">
              <span className="text-[9px] font-black text-green-700 block">JALUR A</span>
              <span className="text-[9px] text-green-600">H &gt; 2 hari</span>
              <span className="text-[9px] font-semibold text-green-800 block">Layak Konsumsi</span>
            </div>
            <div className="bg-amber-50 rounded-xl p-2">
              <span className="text-[9px] font-black text-amber-700 block">JALUR B</span>
              <span className="text-[9px] text-amber-600">H-0 s/d H+2</span>
              <span className="text-[9px] font-semibold text-amber-800 block">Pakan Hewan</span>
            </div>
            <div className="bg-purple-50 rounded-xl p-2">
              <span className="text-[9px] font-black text-purple-700 block">JALUR C</span>
              <span className="text-[9px] text-purple-600">Lewat 3+ hari</span>
              <span className="text-[9px] font-semibold text-purple-800 block">Daur Ulang</span>
            </div>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex h-52 flex-col items-center justify-center">
            <div className="h-7 w-7 animate-spin rounded-full border-4 border-gray-200 border-t-[#1D9E75]"></div>
            <p className="mt-3 text-xs text-gray-500">Memuat notifikasi...</p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="space-y-3">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="bg-white rounded-3xl p-4 border border-gray-100 shadow-sm flex gap-4"
              >
                <div className={`w-10 h-10 rounded-2xl flex items-center justify-center flex-shrink-0 ${n.color}`}>
                  <span className="material-symbols-outlined text-lg">{n.icon}</span>
                </div>
                <div className="flex-grow min-w-0">
                  <div className="flex justify-between items-start gap-2">
                    <h3 className="text-xs font-bold text-gray-800 leading-tight flex-grow">{n.title}</h3>
                    <span className="text-[9px] text-gray-400 font-medium whitespace-nowrap flex-shrink-0">{n.time}</span>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed mt-1">{n.message}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mb-4">
              <span className="material-symbols-outlined text-3xl text-[#1D9E75]">check_circle</span>
            </div>
            <h3 className="font-bold text-gray-700 text-sm">Semua Baik-Baik Saja!</h3>
            <p className="text-[11px] text-gray-400 mt-1 max-w-xs">
              {token
                ? 'Tidak ada makanan yang akan segera kadaluarsa atau transaksi yang menunggu konfirmasi.'
                : 'Login untuk melihat notifikasi kadaluarsa makanan dan transaksi Anda.'}
            </p>
          </div>
        )}

      </main>
      <MobileNav />
    </div>
  );
}
