import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Header from '../components/Header';
import MobileNav from '../components/MobileNav';
import OnboardingFlowModal from '../components/OnboardingFlowModal';

export default function DashboardPage() {
  const { addToCart } = useCart();
  const [makananList, setMakananList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('A'); // 'A' | 'B' | 'C'
  const [currentUser, setCurrentUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showTourModal, setShowTourModal] = useState(false);
  const [onboardingSaving, setOnboardingSaving] = useState(false);
  const [onboardingError, setOnboardingError] = useState('');

  // Countdown timer (demo)
  const [timeLeft, setTimeLeft] = useState(54 * 60 + 12);
  useEffect(() => {
    const t = setInterval(() => setTimeLeft(p => p > 0 ? p - 1 : 59 * 60 + 59), 1000);
    return () => clearInterval(t);
  }, []);
  const mm = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const ss = (timeLeft % 60).toString().padStart(2, '0');

  useEffect(() => {
    const u = localStorage.getItem('user');
    if (u) { try { setCurrentUser(JSON.parse(u)); } catch {} }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    fetch('/api/user/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Gagal memuat profil');
        return res.json();
      })
      .then((data) => {
        const nextProfile = {
          ...data,
          onboarding_prompt_seen: data.onboarding_prompt_seen ? true : false
        };

        setProfile(nextProfile);
        setCurrentUser(nextProfile);
        localStorage.setItem('user', JSON.stringify(nextProfile));

        if (nextProfile.onboarding_prompt_seen) {
          return;
        }

        // Tandai sebagai sudah pernah ditampilkan sejak pertama kali popup muncul.
        setProfile((prev) => prev ? { ...prev, onboarding_prompt_seen: true } : prev);
        setCurrentUser((prev) => prev ? { ...prev, onboarding_prompt_seen: true } : prev);
        localStorage.setItem('user', JSON.stringify({ ...nextProfile, onboarding_prompt_seen: true }));
        updateProfile({ onboarding_prompt_seen: true }).catch(() => {
          // Abaikan agar popup tetap tidak mengganggu sesi berjalan.
        });

        const butuhAlamat = !nextProfile.kecamatan;
        const butuhTour = !nextProfile.onboarding_tour_seen;
        if (butuhAlamat) {
          setShowAddressModal(true);
          return;
        }
        if (butuhTour) {
          setShowTourModal(true);
        }
      })
      .catch(() => {
        // Biar tidak mengganggu dashboard jika API profil gagal.
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    fetch('/api/makanan')
      .then(r => r.json())
      .then(data => { setMakananList(Array.isArray(data) ? data : []); })
      .catch(() => setMakananList([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = makananList.filter(m => m.jalur === activeTab);

  const updateProfile = async (payload) => {
    const token = localStorage.getItem('token');
    if (!token) return null;

    const response = await fetch('/api/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Gagal menyimpan data profil');
    }

    setProfile(data.user);
    setCurrentUser(data.user);
    localStorage.setItem('user', JSON.stringify(data.user));
    return data.user;
  };

  const handleSaveAddress = async (payload) => {
    setOnboardingSaving(true);
    setOnboardingError('');
    try {
      const updated = await updateProfile(payload);
      setShowAddressModal(false);
      if (!updated?.onboarding_tour_seen) {
        setShowTourModal(true);
        return;
      }

      await updateProfile({ onboarding_prompt_seen: true });
    } catch (error) {
      setOnboardingError(error.message || 'Gagal menyimpan alamat');
    } finally {
      setOnboardingSaving(false);
    }
  };

  const handleSkipAddress = async () => {
    setOnboardingError('');
    setShowAddressModal(false);
    if (!profile?.onboarding_tour_seen) {
      setShowTourModal(true);
      return;
    }

    try {
      await updateProfile({ onboarding_prompt_seen: true });
    } catch (error) {
      setOnboardingError(error.message || 'Gagal menyimpan status popup');
    }
  };

  const handleFinishTour = async () => {
    setOnboardingSaving(true);
    setOnboardingError('');
    try {
      await updateProfile({ onboarding_tour_seen: true, onboarding_prompt_seen: true });
      setShowTourModal(false);
    } catch (error) {
      setOnboardingError(error.message || 'Gagal menyimpan status panduan');
    } finally {
      setOnboardingSaving(false);
    }
  };

  const handleAddToCart = (item, e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      id: item.id,
      name: item.nama,
      seller: item.penyedia?.nama || 'TurahanSolo',
      price: item.hargaPlatform ?? item.harga_platform ?? 0,
      image: item.foto || 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=400&q=80',
      quantity: 1
    });
    alert('Ditambahkan ke keranjang!');
  };

  const jalurConfig = {
    A: { label: 'Jalur A', sub: 'Layak Konsumsi', color: '#1D9E75', bg: '#F0FDF9', border: '#A7F3D0', icon: 'restaurant' },
    B: { label: 'Jalur B', sub: 'Pakan Hewan', color: '#D97706', bg: '#FFFBEB', border: '#FDE68A', icon: 'pets' },
    C: { label: 'Jalur C', sub: 'Daur Ulang', color: '#7C3AED', bg: '#FAF5FF', border: '#DDD6FE', icon: 'recycling' },
  };

  const formatPrice = (v) => {
    if (!v || v === 0) return 'Gratis';
    return 'Rp ' + Number(v).toLocaleString('id-ID');
  };

  const formatExpiry = (tgl) => {
    if (!tgl) return null;
    return new Date(tgl).toLocaleString('id-ID', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen font-sans" style={{ background: '#F8FAF9' }}>
      <Header />

      <main className="pb-28 max-w-md mx-auto md:max-w-4xl">

        {/* ── HERO GREETING ── */}
        <div
          className="px-5 pt-5 pb-6 relative overflow-hidden"
          style={{ background: 'linear-gradient(135deg, #1D9E75 0%, #0D7A59 100%)' }}
        >
          {/* Decorative blob */}
          <div className="absolute -right-8 -top-8 w-36 h-36 rounded-full opacity-10 bg-white" />
          <div className="absolute right-8 bottom-0 w-20 h-20 rounded-full opacity-10 bg-white" />

          <p className="text-white/70 text-xs font-medium mb-0.5">
            Selamat datang{currentUser?.nama ? ',' : ''}
          </p>
          <h1 className="text-white text-xl font-black leading-tight mb-1">
            {currentUser?.nama || 'Sobat TurahanSolo'} 👋
          </h1>
          <p className="text-white/80 text-[11px] leading-relaxed mb-5">
            Ada makanan surplus yang perlu diselamatkan hari ini.
          </p>

          {/* Stats row */}
          <div className="flex gap-3">
            {[
              { icon: 'eco', label: 'Tersedia', value: makananList.length + ' Item' },
              { icon: 'schedule', label: 'Flash Sale', value: mm + ':' + ss },
            ].map((s, i) => (
              <div
                key={i}
                className="flex-1 rounded-2xl px-3 py-2.5 flex items-center gap-2"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}
              >
                <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {s.icon}
                </span>
                <div>
                  <p className="text-white/70 text-[9px] font-medium leading-none">{s.label}</p>
                  <p className="text-white text-[13px] font-black leading-tight">{s.value}</p>
                </div>
              </div>
            ))}

            <Link
              to="/upload"
              className="flex-1 rounded-2xl px-3 py-2.5 flex items-center gap-2 active:scale-95 transition-transform"
              style={{ background: 'rgba(255,255,255,0.95)' }}
            >
              <span className="material-symbols-outlined text-[20px]" style={{ color: '#1D9E75', fontVariationSettings: "'FILL' 1" }}>
                add_circle
              </span>
              <div>
                <p className="text-gray-400 text-[9px] font-medium leading-none">Bagikan</p>
                <p className="text-[13px] font-black leading-tight" style={{ color: '#1D9E75' }}>Makanan</p>
              </div>
            </Link>
          </div>
        </div>

        {/* ── QUICK ACCESS ICONS ── */}
        <div className="px-4 py-4 grid grid-cols-4 gap-3">
          {[
            { to: '/katalog', icon: 'storefront', label: 'Katalog', color: '#1D9E75' },
            { to: '/riwayat', icon: 'receipt_long', label: 'Riwayat', color: '#2563EB' },
            { to: '/dampak', icon: 'bar_chart', label: 'Dampak', color: '#7C3AED' },
            { to: '/notifikasi', icon: 'notifications_active', label: 'Notif', color: '#D97706' },
          ].map((q) => (
            <Link key={q.to} to={q.to} className="flex flex-col items-center gap-1.5 group">
              <div
                className="w-13 h-13 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm transition-transform active:scale-90"
                style={{ background: q.color + '18' }}
              >
                <span
                  className="material-symbols-outlined text-[22px]"
                  style={{ color: q.color, fontVariationSettings: "'FILL' 1" }}
                >
                  {q.icon}
                </span>
              </div>
              <span className="text-[10px] font-semibold text-gray-500">{q.label}</span>
            </Link>
          ))}
        </div>

        {/* ── FLASH SALE BANNER ── */}
        <div className="px-4 mb-4">
          <div
            className="rounded-3xl p-4 flex items-center gap-4 relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #FEF3C7, #FDE68A)' }}
          >
            <div className="absolute -right-4 -bottom-4 opacity-20">
              <span className="material-symbols-outlined text-[80px] text-amber-600" style={{ fontVariationSettings: "'FILL' 1" }}>
                local_fire_department
              </span>
            </div>
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: '#F59E0B' }}>
              <span className="material-symbols-outlined text-white text-[22px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                flash_on
              </span>
            </div>
            <div className="flex-1 min-w-0 relative z-10">
              <p className="text-xs font-black text-amber-900">⚡ Flash Sale Surplus!</p>
              <p className="text-[10px] text-amber-700 mt-0.5">Diskon hingga 80% — berakhir dalam</p>
              <p className="text-lg font-black text-amber-900 tracking-widest mt-0.5">{mm}<span className="text-amber-600 animate-pulse">:</span>{ss}</p>
            </div>
            <Link
              to="/flash-sale"
              className="flex-shrink-0 rounded-xl px-3 py-2 text-[11px] font-black text-white shadow active:scale-95 transition-transform relative z-10"
              style={{ background: '#F59E0B' }}
            >
              Lihat
            </Link>
          </div>
        </div>

        {/* ── JALUR TABS ── */}
        <div className="px-4 mb-4">
          <div className="flex gap-2 p-1 rounded-2xl" style={{ background: '#EEF2EE' }}>
            {Object.entries(jalurConfig).map(([key, cfg]) => (
              <button
                key={key}
                onClick={() => setActiveTab(key)}
                className="flex-1 flex flex-col items-center py-2.5 rounded-xl transition-all duration-200 active:scale-95"
                style={activeTab === key ? {
                  background: '#fff',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                } : {}}
              >
                <span
                  className="material-symbols-outlined text-[18px] mb-0.5"
                  style={{
                    color: activeTab === key ? cfg.color : '#9CA3AF',
                    fontVariationSettings: activeTab === key ? "'FILL' 1" : "'FILL' 0",
                  }}
                >
                  {cfg.icon}
                </span>
                <span
                  className="text-[10px] font-black"
                  style={{ color: activeTab === key ? cfg.color : '#9CA3AF' }}
                >
                  {cfg.label}
                </span>
                <span
                  className="text-[8px] font-medium"
                  style={{ color: activeTab === key ? cfg.color + 'CC' : '#C4C4C4' }}
                >
                  {cfg.sub}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* ── FOOD LIST ── */}
        <div className="px-4">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h2 className="text-sm font-black text-gray-800">{jalurConfig[activeTab].label} — {jalurConfig[activeTab].sub}</h2>
              <p className="text-[10px] text-gray-400 mt-0.5">
                {filtered.length > 0 ? `${filtered.length} item tersedia` : 'Tidak ada item'}
              </p>
            </div>
            <Link
              to="/katalog"
              className="text-[11px] font-bold flex items-center gap-0.5"
              style={{ color: '#1D9E75' }}
            >
              Lihat Semua
              <span className="material-symbols-outlined text-[14px]">arrow_forward</span>
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-14">
              <div className="w-8 h-8 rounded-full border-4 border-gray-100 border-t-[#1D9E75] animate-spin mb-3" />
              <p className="text-xs text-gray-400">Memuat makanan...</p>
            </div>
          ) : filtered.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
              {filtered.map((item) => {
                const price = item.hargaPlatform ?? item.harga_platform ?? 0;
                const origPrice = item.hargaAsli ?? item.harga_asli ?? 0;
                const hasDiscount = price < origPrice && origPrice > 0;
                const cfg = jalurConfig[item.jalur] || jalurConfig['A'];
                return (
                  <Link
                    key={item.id}
                    to={`/makanan/${item.id}`}
                    className="flex flex-col overflow-hidden rounded-2xl bg-white shadow-sm border active:scale-95 transition-all duration-150"
                    style={{ borderColor: '#F3F4F6' }}
                  >
                    {/* Image */}
                    <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">
                      <img
                        src={item.foto || 'https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=400&q=80'}
                        alt={item.nama}
                        className="w-full h-full object-cover"
                      />
                      {/* Jalur badge */}
                      <span
                        className="absolute top-2 left-2 text-[8px] font-black px-1.5 py-0.5 rounded-lg"
                        style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}` }}
                      >
                        {cfg.label}
                      </span>
                      {/* Discount badge */}
                      {hasDiscount && (
                        <span className="absolute top-2 right-2 bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded-lg">
                          -{Math.round((1 - price / origPrice) * 100)}%
                        </span>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-2.5 flex flex-col gap-1 flex-1">
                      <p className="text-[9px] text-gray-400 font-medium truncate">
                        {item.penyedia?.nama || 'TurahanSolo'}
                      </p>
                      <h3 className="text-xs font-bold text-gray-800 leading-tight line-clamp-2">
                        {item.nama}
                      </h3>

                      {/* Expiry */}
                      {(item.tglExpired || item.tgl_expired) && (
                        <p className="text-[9px] font-semibold flex items-center gap-0.5" style={{ color: '#EF4444' }}>
                          <span className="material-symbols-outlined text-[10px]">schedule</span>
                          {formatExpiry(item.tglExpired || item.tgl_expired)}
                        </p>
                      )}

                      {/* Price */}
                      <div className="mt-auto pt-2">
                        {hasDiscount && (
                          <p className="text-[9px] text-gray-400 line-through leading-none">
                            Rp {Number(origPrice).toLocaleString('id-ID')}
                          </p>
                        )}
                        <p
                          className="text-sm font-black leading-tight"
                          style={{ color: price === 0 ? '#1D9E75' : '#1A1A1A' }}
                        >
                          {formatPrice(price)}
                        </p>
                      </div>

                      {/* Action */}
                      <button
                        onClick={(e) => handleAddToCart(item, e)}
                        className="mt-2 w-full py-2 rounded-xl text-[10px] font-black text-white transition-all active:scale-95"
                        style={{ background: `linear-gradient(135deg, ${cfg.color}, ${cfg.color}CC)` }}
                      >
                        + Keranjang
                      </button>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-14 text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-3"
                style={{ background: jalurConfig[activeTab].bg }}
              >
                <span
                  className="material-symbols-outlined text-[32px]"
                  style={{ color: jalurConfig[activeTab].color, fontVariationSettings: "'FILL' 1" }}
                >
                  {jalurConfig[activeTab].icon}
                </span>
              </div>
              <h3 className="text-sm font-bold text-gray-700">Belum Ada Item</h3>
              <p className="text-[11px] text-gray-400 mt-1 max-w-[200px]">
                Belum ada makanan {jalurConfig[activeTab].sub} saat ini.
              </p>
              <Link
                to="/upload"
                className="mt-4 px-5 py-2.5 rounded-xl text-xs font-bold text-white shadow"
                style={{ background: '#1D9E75' }}
              >
                Bagikan Makanan
              </Link>
            </div>
          )}
        </div>

      </main>

      <MobileNav />

      <OnboardingFlowModal
        isOpen={showAddressModal || showTourModal}
        mode={showAddressModal ? 'address' : 'tour'}
        profile={profile}
        saving={onboardingSaving}
        error={onboardingError}
        onSaveAddress={handleSaveAddress}
        onSkipAddress={handleSkipAddress}
        onFinishTour={handleFinishTour}
      />
    </div>
  );
}
