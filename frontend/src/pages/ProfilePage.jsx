import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import MobileNav from '../components/MobileNav';

export default function ProfilePage() {
  const [co2Score, setCo2Score] = useState(0);
  const [targetScore, setTargetScore] = useState(1240);

  const [profile, setProfile] = useState({
    nama: '',
    nama_toko: '',
    alamat: '',
    no_telp: '',
    foto: ''
  });
  const [contributions, setContributions] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Fetch profile
      fetch('/api/user/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setProfile({
            nama: data.nama || '',
            nama_toko: data.nama_toko || '',
            alamat: data.alamat || '',
            no_telp: data.no_telp || '',
            foto: data.foto || ''
          });
          if (data.carbon_score) {
            setTargetScore(data.carbon_score);
          }
        })
        .catch(err => console.error('Error fetching profile:', err));

      // Fetch contributions list
      fetch('/api/user/contributions', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setContributions(data);
        })
        .catch(err => console.error('Error fetching contributions:', err));

      // Fetch leaderboard list
      fetch('/api/leaderboard')
        .then(res => res.json())
        .then(data => {
          setLeaderboard(data);
        })
        .catch(err => console.error('Error fetching leaderboard:', err));
    }
  }, []);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = targetScore / (duration / 16);
    
    const updateCounter = () => {
      start += increment;
      if (start < targetScore) {
        setCo2Score(Math.floor(start));
        requestAnimationFrame(updateCounter);
      } else {
        setCo2Score(targetScore);
      }
    };
    
    const timer = setTimeout(updateCounter, 500);
    return () => clearTimeout(timer);
  }, [targetScore]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploadingPhoto(true);
    setSaveStatus({ type: '', message: '' });
    const formData = new FormData();
    formData.append('foto', file);

    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user/profile/photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData
      });

      const data = await res.json();
      if (res.ok) {
        setProfile(prev => ({ ...prev, foto: data.fotoUrl }));
        setSaveStatus({ type: 'success', message: 'Foto profil berhasil diperbarui!' });
        
        // Update user in localStorage
        const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
        storedUser.foto = data.fotoUrl;
        localStorage.setItem('user', JSON.stringify(storedUser));
        
        setTimeout(() => setSaveStatus({ type: '', message: '' }), 3000);
      } else {
        setSaveStatus({ type: 'error', message: data.message || 'Gagal mengunggah foto.' });
      }
    } catch (err) {
      console.error(err);
      setSaveStatus({ type: 'error', message: 'Terjadi kesalahan jaringan saat mengunggah foto.' });
    } finally {
      setIsUploadingPhoto(false);
    }
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus({ type: '', message: '' });
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profile)
      });
      const data = await res.json();
      if (res.ok) {
        setSaveStatus({ type: 'success', message: 'Profil berhasil disimpan!' });
        localStorage.setItem('user', JSON.stringify(data.user));
        setTimeout(() => setSaveStatus({ type: '', message: '' }), 3000);
      } else {
        setSaveStatus({ type: 'error', message: data.message || 'Gagal menyimpan profil.' });
      }
    } catch (err) {
      setSaveStatus({ type: 'error', message: 'Terjadi kesalahan jaringan.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-[#fbf9f8] text-on-surface min-h-screen pb-24 md:pb-0">
      {/* TopAppBar */}
      <Header />

      <main className="max-w-[1280px] mx-auto px-4 md:px-16 py-6 space-y-6">
        {/* Profile Header Section */}
        <section className="flex flex-col md:flex-row items-center md:items-start gap-6 bg-surface-container-low p-6 rounded-xl">
          <div className="relative group">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-white shadow-lg overflow-hidden relative">
              <img 
                alt={profile.nama || 'Foto Profil'} 
                className="w-full h-full object-cover" 
                src={profile.foto || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
              />
              {isUploadingPhoto && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white">
                  <span className="material-symbols-outlined animate-spin text-[24px]">refresh</span>
                </div>
              )}
              {/* Desktop Hover Overlay */}
              <label 
                htmlFor="profile-upload" 
                className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer text-white"
              >
                <span className="material-symbols-outlined text-[24px]">edit</span>
              </label>
            </div>
            
            {/* Pencil Button */}
            <button 
              type="button"
              onClick={() => document.getElementById('profile-upload').click()}
              className="absolute -bottom-1 -right-1 bg-primary text-white p-2 rounded-full border-2 border-white shadow-md hover:scale-110 active:scale-95 transition-all flex items-center justify-center"
              title="Ubah Foto Profil"
            >
              <span className="material-symbols-outlined text-[16px]">edit</span>
            </button>

            <input 
              type="file" 
              id="profile-upload" 
              accept="image/*" 
              onChange={handlePhotoChange} 
              className="hidden" 
            />
          </div>
          
          <div className="text-center md:text-left flex-1 space-y-1">
            <h1 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">{profile.nama || 'Penyedia Pangan'}</h1>
            <p className="font-body-md text-body-md text-on-surface-variant bg-secondary-container inline-block px-4 py-1 rounded-full">{profile.nama_toko || 'Mitra ResFood'}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
              <span className="flex items-center gap-1 font-label-lg text-label-lg text-primary">
                <span className="material-symbols-outlined text-[18px]">location_on</span> Solo, Jawa Tengah
              </span>
              <span className="flex items-center gap-1 font-label-lg text-label-lg text-tertiary">
                <span className="material-symbols-outlined text-[18px]">calendar_today</span> Bergabung: Jan 2024
              </span>
            </div>
            <div className="mt-4 flex justify-center md:justify-start">
              <Link to="/login" className="flex items-center gap-2 text-error hover:bg-error-container hover:text-on-error-container px-4 py-2 rounded-full transition-colors border border-error">
                <span className="material-symbols-outlined">logout</span>
                <span className="font-label-lg">Log Out</span>
              </Link>
            </div>
          </div>
          
          {/* Carbon Saving Score */}
          <div className="w-full md:w-auto bg-primary-container text-on-primary-container p-6 rounded-xl flex flex-col items-center justify-center text-center shadow-lg transform hover:scale-[1.02] transition-transform cursor-default">
            <span className="material-symbols-outlined text-[48px] mb-1" style={{fontVariationSettings: "'FILL' 1"}}>eco</span>
            <span className="font-display-lg text-display-lg">{co2Score.toLocaleString()}</span>
            <span className="font-headline-md text-headline-md">kg CO2 diselamatkan</span>
            <p className="font-label-sm text-label-sm mt-1 opacity-90 text-on-primary">Setara dengan menanam 21 pohon</p>
          </div>
        </section>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-[0px_4px_12px_rgba(46,125,50,0.08)] border-l-4 border-l-[#0d631b]">
            <p className="font-label-lg text-label-lg text-on-surface-variant">Makanan Diselamatkan</p>
            <div className="flex items-end gap-1 mt-2">
              <h3 className="font-headline-lg text-headline-lg text-primary">452</h3>
              <span className="font-body-md text-body-md text-on-surface-variant pb-1">porsi</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-[0px_4px_12px_rgba(46,125,50,0.08)] border-l-4 border-l-[#a55b00]">
            <p className="font-label-lg text-label-lg text-on-surface-variant">Total Transaksi</p>
            <div className="flex items-end gap-1 mt-2">
              <h3 className="font-headline-lg text-headline-lg text-tertiary">84</h3>
              <span className="font-body-md text-body-md text-on-surface-variant pb-1">kali</span>
            </div>
          </div>
          <div className="bg-surface-container-lowest p-4 rounded-xl shadow-[0px_4px_12px_rgba(46,125,50,0.08)] border-l-4 border-l-[#824600]">
            <p className="font-label-lg text-label-lg text-on-surface-variant">Tantangan Selesai</p>
            <div className="flex items-end gap-1 mt-2">
              <h3 className="font-headline-lg text-headline-lg text-tertiary-container">12</h3>
              <span className="font-body-md text-body-md text-on-surface-variant pb-1">badge</span>
            </div>
          </div>
        </div>

        {/* Main Layout Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Badge Collection (Left Column) */}
          <section className="lg:col-span-8 space-y-6">
            {/* Edit Profile Form Card */}
            <div className="bg-white rounded-2xl p-6 shadow-[0px_4px_20px_rgba(0,0,0,0.04)] border border-outline-variant">
              <h3 className="font-headline-md text-headline-md mb-2">Edit Informasi Toko & Profil</h3>
              <p className="font-body-md text-body-md text-on-surface-variant mb-6">
                Perbarui alamat, nama toko, dan nomor WhatsApp Anda agar pembeli dapat menghubungi Anda saat Anda mengunggah makanan ke katalog.
              </p>

              {saveStatus.message && (
                <div className={`p-4 rounded-xl mb-6 text-sm ${saveStatus.type === 'success' ? 'bg-secondary/10 text-secondary border border-secondary/20' : 'bg-error/10 text-error border border-error/20'}`}>
                  {saveStatus.message}
                </div>
              )}

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-label-md text-label-md text-on-surface-variant">Nama Lengkap</label>
                    <input 
                      type="text" 
                      name="nama" 
                      value={profile.nama} 
                      onChange={handleProfileChange} 
                      required 
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-body-md" 
                      placeholder="Nama Lengkap Anda"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="block font-label-md text-label-md text-on-surface-variant">Nama Toko / Warung</label>
                    <input 
                      type="text" 
                      name="nama_toko" 
                      value={profile.nama_toko} 
                      onChange={handleProfileChange} 
                      className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-body-md" 
                      placeholder="Contoh: Catering Berkah / Roti Solo"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block font-label-md text-label-md text-on-surface-variant">Nomor WhatsApp</label>
                    <div className="relative">
                      <span className="absolute left-4 top-1/2 -translate-y-1/2 font-body-md text-on-surface-variant">+62</span>
                      <input 
                        type="text" 
                        name="no_telp" 
                        value={profile.no_telp.startsWith('+62') ? profile.no_telp.slice(3) : profile.no_telp.startsWith('0') ? profile.no_telp.slice(1) : profile.no_telp} 
                        onChange={(e) => {
                          let val = e.target.value;
                          val = val.replace(/\D/g, '');
                          handleProfileChange({ target: { name: 'no_telp', value: val ? '+62' + val : '' } });
                        }} 
                        required 
                        className="w-full pl-14 pr-4 py-3 rounded-xl border border-outline-variant bg-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-body-md" 
                        placeholder="8123456789"
                      />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="block font-label-md text-label-md text-on-surface-variant font-bold text-primary flex items-center gap-1">
                      <span className="material-symbols-outlined text-[18px]">verified</span> Terverifikasi Resmi
                    </label>
                    <div className="px-4 py-3 rounded-xl bg-surface-container text-on-surface-variant text-sm font-body-md select-none border border-outline-variant">
                      Solo, Jawa Tengah
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-label-md text-label-md text-on-surface-variant">Alamat Lengkap</label>
                  <textarea 
                    name="alamat" 
                    value={profile.alamat} 
                    onChange={handleProfileChange} 
                    required 
                    rows="3" 
                    className="w-full px-4 py-3 rounded-xl border border-outline-variant bg-surface outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-all font-body-md resize-none" 
                    placeholder="Tulis alamat lengkap penjemputan makanan Anda..."
                  />
                </div>

                <div className="flex justify-end pt-2">
                  <button 
                    type="submit" 
                    disabled={isSaving} 
                    className="bg-primary text-on-primary px-8 py-3.5 rounded-xl font-label-lg text-label-lg font-bold shadow hover:bg-primary/95 transition-all flex items-center gap-2 active:scale-[0.98] disabled:opacity-50"
                  >
                    {isSaving ? 'Menyimpan...' : 'Simpan Profil'}
                  </button>
                </div>
              </form>
            </div>

            <div className="flex justify-between items-center mt-6">
              <h2 className="font-headline-md text-headline-md text-on-surface">Koleksi Badge</h2>
              <button className="text-primary font-label-lg hover:underline transition-all">Lihat Semua</button>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="bg-surface-container-lowest p-4 rounded-xl text-center border border-outline-variant hover:shadow-md transition-all group">
                <div className="w-16 h-16 mx-auto mb-2 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[32px] group-hover:[font-variation-settings:'FILL'1] transition-all">forest</span>
                </div>
                <p className="font-label-lg text-label-lg">Eco Hero</p>
                <p className="text-[10px] text-on-surface-variant mt-1">Level 4</p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl text-center border border-outline-variant hover:shadow-md transition-all group">
                <div className="w-16 h-16 mx-auto mb-2 bg-secondary-container text-on-secondary-container rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[32px] group-hover:[font-variation-settings:'FILL'1] transition-all">nutrition</span>
                </div>
                <p className="font-label-lg text-label-lg">Donor Jalur A</p>
                <p className="text-[10px] text-on-surface-variant mt-1">100+ Porsi</p>
              </div>
              <div className="bg-surface-container-lowest p-4 rounded-xl text-center border border-outline-variant hover:shadow-md transition-all group">
                <div className="w-16 h-16 mx-auto mb-2 bg-tertiary-fixed text-on-tertiary-fixed rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <span className="material-symbols-outlined text-[32px] group-hover:[font-variation-settings:'FILL'1] transition-all">emoji_events</span>
                </div>
                <p className="font-label-lg text-label-lg">Solo Lestari</p>
                <p className="text-[10px] text-on-surface-variant mt-1">Aktif 30 Hari</p>
              </div>
              <div className="bg-surface-container-low p-4 rounded-xl text-center border border-dashed border-outline-variant opacity-60">
                <div className="w-16 h-16 mx-auto mb-2 bg-surface-variant text-on-surface-variant rounded-full flex items-center justify-center grayscale">
                  <span className="material-symbols-outlined text-[32px]">lock</span>
                </div>
                <p className="font-label-lg text-label-lg">Master Kompos</p>
                <p className="text-[10px] text-on-surface-variant mt-1">Belum Terkunci</p>
              </div>
            </div>
            
            {/* Contribution Timeline */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-outline-variant mt-6">
              <h3 className="font-headline-md text-headline-md mb-6">Linimasa Kontribusi</h3>
              {contributions.length > 0 ? (
                <div className="space-y-6 relative before:content-[''] before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant">
                  {contributions.map((item) => {
                    const dateStr = new Date(item.created_at).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    });
                    const isJalurA = item.jalur === 'A';
                    return (
                      <div key={item.id} className="flex gap-4 relative animate-in fade-in duration-300">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center z-10 shrink-0 ${isJalurA ? 'bg-primary' : 'bg-tertiary'}`}>
                          <span className="material-symbols-outlined text-[14px] text-white">
                            {isJalurA ? 'check' : 'recycling'}
                          </span>
                        </div>
                        <div className="flex-1 pb-6">
                          <p className="font-label-lg text-label-lg text-on-surface-variant">{dateStr}</p>
                          {isJalurA ? (
                            <p className="font-body-lg text-body-lg mt-1">
                              Mendonasikan <strong>{item.stok} porsi</strong> makanan layak konsumsi <strong>{item.nama}</strong>.
                            </p>
                          ) : (
                            <p className="font-body-lg text-body-lg mt-1">
                              Mengirimkan <strong>{item.stok} porsi/kg</strong> sisa makanan/organik <strong>{item.nama}</strong> ke pusat pengolahan.
                            </p>
                          )}
                          <div className={`mt-2 inline-flex items-center gap-1 px-2 py-1 rounded text-[12px] font-bold ${
                            isJalurA ? 'bg-primary-fixed text-on-primary-fixed' : 'bg-tertiary-fixed text-on-tertiary-fixed'
                          }`}>
                            {isJalurA ? 'JALUR A' : 'JALUR B'}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-on-surface-variant text-body-md py-4">Belum ada aktivitas kontribusi terdaftar. Unggah makanan di katalog untuk melihat kontribusi Anda di sini!</p>
              )}
            </div>
          </section>
          
          {/* Leaderboard & Social (Right Column) */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="bg-surface-container-high p-6 rounded-xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-headline-md text-headline-md text-on-surface">Papan Peringkat</h3>
                <span className="text-[12px] font-bold text-primary bg-primary-container px-2 py-1 rounded">Minggu Ini</span>
              </div>
              
              <div className="space-y-4">
                {leaderboard.length > 0 ? (
                  leaderboard.map((item, index) => {
                    const isTop1 = index === 0;
                    const isCurrentUser = item.nama === profile.nama;
                    
                    let cardBg = "hover:bg-surface-container transition-colors";
                    let textScoreColor = "text-on-surface-variant";
                    if (isCurrentUser) {
                      cardBg = "bg-primary-fixed text-on-primary-fixed shadow-sm";
                      textScoreColor = "opacity-85";
                    } else if (isTop1) {
                      cardBg = "bg-surface-container-lowest shadow-sm border border-primary";
                    }
                    
                    return (
                      <div key={item.id} className={`flex items-center gap-4 p-2 rounded-lg ${cardBg}`}>
                        <span className={`font-headline-md w-6 text-center ${isCurrentUser ? 'text-on-primary-fixed' : isTop1 ? 'text-primary' : 'text-on-surface-variant'}`}>
                          {index + 1}
                        </span>
                        <div className={`w-10 h-10 rounded-full overflow-hidden ${isCurrentUser ? 'border-2 border-primary' : ''}`}>
                          <img 
                            alt={item.nama} 
                            className="w-full h-full object-cover" 
                            src={item.foto || (
                              index % 3 === 0 
                                ? "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                : index % 3 === 1 
                                  ? "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                  : "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            )}
                          />
                        </div>
                        <div className="flex-1">
                          <p className="font-label-lg text-label-lg font-bold line-clamp-1">
                            {item.nama_toko || item.nama} {isCurrentUser && "(Anda)"}
                          </p>
                          <p className={`text-[12px] ${textScoreColor}`}>
                            {(item.carbon_score || 0).toLocaleString()} kg CO2
                          </p>
                        </div>
                        {isTop1 && (
                          <span className="material-symbols-outlined text-tertiary" style={{fontVariationSettings: "'FILL' 1"}}>workspace_premium</span>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <p className="text-on-surface-variant text-label-sm p-4">Memuat papan peringkat...</p>
                )}
              </div>
            </div>
            
            {/* Call to Action Card */}
            <div className="bg-primary p-6 rounded-xl text-white space-y-4 shadow-lg relative overflow-hidden">
              <div className="absolute -right-4 -top-4 opacity-10 scale-150 pointer-events-none">
                <span className="material-symbols-outlined text-[120px]">psychiatry</span>
              </div>
              <h4 className="font-headline-md text-headline-md relative z-10">Mau Tingkatkan Dampakmu?</h4>
              <p className="font-body-md text-body-md opacity-90 relative z-10">Ambil tantangan mingguan dan dapatkan badge eksklusif!</p>
              <button className="w-full py-3 bg-white text-primary font-bold rounded-lg hover:bg-surface-container-low transition-all relative z-10">
                Lihat Tantangan
              </button>
            </div>
          </aside>
        </div>
      </main>

      {/* Contextual FAB (Desktop & Mobile) */}
      <div className="fixed bottom-24 right-6 md:bottom-12 md:right-12 z-40">
        <Link to="/upload" className="flex items-center gap-2 bg-primary text-white p-4 rounded-2xl shadow-lg hover:scale-105 active:scale-95 transition-all">
          <span className="material-symbols-outlined">add_circle</span>
          <span className="hidden md:inline font-bold">Donasi Makanan</span>
        </Link>
      </div>

      {/* Footer */}
      <Footer />

      {/* BottomNavBar (Mobile Only) */}
      <MobileNav />
    </div>
  );
}
