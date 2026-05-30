import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import MobileNav from '../components/MobileNav';

export default function PickupPage() {
  const navigate = useNavigate();
  const [activePurpose, setActivePurpose] = useState('Pupuk Kompos');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const purposes = ['Research', 'Pupuk Kompos', 'Pakan Ternak', 'Biogas'];

  const handleSubmit = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      alert('Permintaan pengambilan berhasil dikirim!');
      setIsSubmitting(false);
      navigate('/dashboard'); // go back to dashboard or another appropriate page
    }, 1500);
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen pb-32">
      {/* Top Navigation */}
      <Header />

      <main className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-xl">
        <div className="flex flex-col gap-lg">
          {/* Header Section */}
          <div className="flex flex-col gap-xs">
            <h2 className="font-headline-lg-mobile md:font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">Konfirmasi Pengambilan</h2>
            <p className="font-body-md text-body-md text-on-surface-variant">Pastikan rincian berikut sesuai untuk memproses permintaan bahan sisa organik.</p>
          </div>

          {/* Main Layout: Bento Grid Style */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-lg">
            {/* Left Column: Summary Card */}
            <div className="md:col-span-5 flex flex-col gap-md">
              <section className="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30 flex flex-col gap-md">
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-surface-container-high">
                  <img alt="Limbah Organik" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1590432244458-18e38d721bb8?auto=format&fit=crop&w=800&q=80"/>
                  <div className="absolute top-md right-md bg-[#D7CCC8] text-[#795548] px-md py-xs rounded-full font-label-lg text-label-lg flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[18px]">recycling</span>
                    Tidak Layak Konsumsi
                  </div>
                </div>
                <div className="flex flex-col gap-sm">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-headline-sm text-headline-sm text-on-surface">Limbah Sayuran Organik</h3>
                      <p className="font-body-md text-body-md text-on-surface-variant flex items-center gap-xs">
                        <span className="material-symbols-outlined text-[18px]">person</span>
                        Diupload oleh: <span className="font-semibold text-on-surface">Pasar Gede Solo</span>
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-headline-sm text-headline-sm text-primary">25 kg</p>
                      <p className="font-label-sm text-label-sm text-on-surface-variant">Estimasi Berat</p>
                    </div>
                  </div>

                  <div className="pt-md border-t border-outline-variant/30">
                    <p className="font-label-lg text-label-lg text-on-surface-variant mb-sm">Tujuan Penggunaan (Pilih Salah Satu):</p>
                    <div className="flex flex-wrap gap-sm">
                      {purposes.map((purpose) => (
                        <button 
                          key={purpose}
                          onClick={() => setActivePurpose(purpose)}
                          className={`px-md py-sm rounded-full transition-all font-label-lg text-label-lg flex items-center gap-xs ${
                            activePurpose === purpose 
                              ? 'bg-[#D7CCC8] text-[#795548] border-2 border-[#795548] ring-2 ring-[#D7CCC8]' 
                              : 'bg-[#D7CCC8] text-[#795548] border-2 border-transparent hover:border-[#795548]'
                          }`}
                        >
                          {activePurpose === purpose && <span className="material-symbols-outlined text-[18px]" style={{fontVariationSettings: "'FILL' 1"}}>check_circle</span>}
                          {purpose}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              <div className="bg-secondary-container/30 border border-secondary/20 p-md rounded-xl flex items-start gap-md">
                <span className="material-symbols-outlined text-secondary">info</span>
                <p className="font-body-md text-body-md text-on-secondary-container leading-relaxed">
                  Bahan ini dikategorikan sebagai <strong>Bahan Sisa Organik</strong>. Harap pastikan Anda memiliki wadah pengangkut yang sesuai.
                </p>
              </div>
            </div>

            {/* Right Column: Pickup Form */}
            <div className="md:col-span-7">
              <section className="bg-surface-container-lowest rounded-xl p-lg shadow-[0px_4px_20px_rgba(0,0,0,0.05)] border border-outline-variant/30 h-full">
                <div className="flex flex-col gap-lg h-full">
                  <h3 className="font-headline-sm text-headline-sm text-on-surface">Jadwal & Detail Pengambilan</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div className="flex flex-col gap-xs">
                      <label className="font-label-lg text-label-lg text-on-surface-variant">Tanggal Pengambilan</label>
                      <div className="relative">
                        <input className="w-full bg-surface border border-outline rounded-xl px-md py-md font-body-md text-body-md focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" type="date"/>
                        <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">calendar_today</span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-xs">
                      <label className="font-label-lg text-label-lg text-on-surface-variant">Waktu Pengambilan</label>
                      <div className="relative">
                        <input className="w-full bg-surface border border-outline rounded-xl px-md py-md font-body-md text-body-md focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" type="time"/>
                        <span className="material-symbols-outlined absolute right-md top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none">schedule</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-xs">
                    <label className="font-label-lg text-label-lg text-on-surface-variant">Catatan untuk Donatur</label>
                    <textarea className="w-full bg-surface border border-outline rounded-xl px-md py-md font-body-md text-body-md min-h-[120px] focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none" placeholder="Contoh: Saya akan membawa armada bak terbuka untuk mengangkut limbah ini pada jam 10 pagi."></textarea>
                  </div>

                  <div className="p-md bg-surface-container-low rounded-xl border border-outline-variant/50">
                    <div className="flex items-center gap-md">
                      <div className="bg-primary/10 p-sm rounded-full">
                        <span className="material-symbols-outlined text-primary">location_on</span>
                      </div>
                      <div>
                        <p className="font-label-lg text-label-lg text-on-surface">Titik Temu: Pintu Utara Pasar Gede</p>
                        <p className="font-label-sm text-label-sm text-on-surface-variant">Jl. Jend. Urip Sumoharjo, Jebres, Solo</p>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={handleSubmit} 
                    disabled={isSubmitting}
                    className="w-full bg-primary text-on-primary py-lg rounded-xl font-headline-sm text-headline-sm hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-md shadow-lg shadow-primary/20 mt-auto disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Memproses Permintaan...
                      </>
                    ) : (
                      <>
                        Kirim Permintaan Pengambilan
                        <span className="material-symbols-outlined">send</span>
                      </>
                    )}
                  </button>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      {/* Fixed Bottom Progress Tracker */}
      <div className="fixed bottom-0 left-0 w-full z-50 bg-surface border-t border-outline-variant shadow-[0px_-4px_12px_rgba(0,0,0,0.05)]">
        <div className="max-w-container-max mx-auto px-margin-mobile md:px-margin-desktop py-lg">
          <div className="flex items-center justify-between relative max-w-2xl mx-auto">
            {/* Connector Line */}
            <div className="absolute top-1/2 left-0 w-full h-[2px] bg-outline-variant -translate-y-1/2 z-0"></div>
            
            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center gap-xs">
              <div className="w-10 h-10 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center shadow-md active-tracker border-2 border-primary" style={{boxShadow: '0 0 15px rgba(46, 125, 50, 0.2)'}}>
                <span className="material-symbols-outlined" style={{fontVariationSettings: "'FILL' 1"}}>pending_actions</span>
              </div>
              <span className="font-label-lg text-label-lg text-primary font-bold">Diajukan</span>
            </div>
            
            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center gap-xs">
              <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center border-2 border-outline-variant">
                <span className="material-symbols-outlined">verified</span>
              </div>
              <span className="font-label-lg text-label-lg text-on-surface-variant">Dikonfirmasi</span>
            </div>
            
            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center gap-xs">
              <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center border-2 border-outline-variant">
                <span className="material-symbols-outlined">task_alt</span>
              </div>
              <span className="font-label-lg text-label-lg text-on-surface-variant">Selesai</span>
            </div>
          </div>
        </div>
      </div>

      <footer className="w-full py-xl px-margin-mobile md:px-margin-desktop flex flex-col md:flex-row justify-between items-center gap-md bg-surface-container-highest border-t border-outline-variant mb-24">
        <div className="flex flex-col gap-xs items-center md:items-start">
          <span className="text-headline-md font-headline-md text-on-surface">ResFood Solo</span>
          <p className="font-body-md text-body-md text-on-surface-variant text-center md:text-left">© 2024 ResFood Solo. Memberdayakan Ekonomi Sirkular.</p>
        </div>
        <div className="flex gap-lg flex-wrap justify-center">
          <Link to="#" className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-all">Tentang Kami</Link>
          <Link to="#" className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-all">Kebijakan Privasi</Link>
          <Link to="#" className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-all">Hubungi Kami</Link>
          <Link to="#" className="font-label-lg text-label-lg text-on-surface-variant hover:text-primary transition-all">Syarat & Ketentuan</Link>
        </div>
      </footer>
    </div>
  );
}
