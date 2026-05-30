import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nama, setNama] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
    
    // Siapkan body request
    const bodyData = { email, password };
    if (!isLogin) {
      bodyData.nama = nama;
    }

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bodyData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Terjadi kesalahan');
      }

      if (isLogin) {
        setSuccessMsg('Login berhasil! Mengarahkan...');
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setTimeout(() => {
          if (data.user && data.user.role === 'admin') {
            navigate('/admin');
          } else {
            navigate('/dashboard');
          }
        }, 1000);
      } else {
        setSuccessMsg('Registrasi berhasil! Silakan login.');
        setNama('');
        setPassword('');
        setIsLogin(true);
      }
    } catch (err) {
      setErrorMsg(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4 font-sans">
      {/* Container Utama */}
      <div className="flex w-full max-w-4xl overflow-hidden rounded-3xl bg-white shadow-xl flex-col md:flex-row">
        
        {/* Sisi Kiri: Informasi & Gambar */}
        <div className="relative flex flex-col justify-between bg-[#2d6a4f] p-8 text-white md:w-1/2 lg:p-12">
          <div className="absolute inset-0 bg-gradient-to-b from-green-800/20 to-black/20 pointer-events-none" />
          
          <div className="relative z-10">
            <h1 className="text-3xl font-bold tracking-wide lg:text-4xl">ResFood</h1>
            <p className="mt-4 text-sm leading-relaxed text-emerald-100 lg:text-base">
              Memberdayakan Ekonomi Sirkular melalui pengelolaan surplus makanan yang bermartabat.
            </p>
          </div>

          <div className="relative z-10 my-8 flex justify-center">
            <img 
              src="https://images.unsplash.com/photo-1540420773420-3366772f4999?auto=format&fit=crop&w=600&q=80" 
              alt="Fresh vegetables in wooden crate" 
              className="h-48 w-full rounded-2xl object-cover shadow-md md:h-64"
            />
          </div>

          <div className="relative z-10 text-xs text-emerald-200">
            <div className="flex items-center gap-2 mb-2 font-medium">
              <svg className="h-4 w-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              100% Resource Regeneration
            </div>
            <p>© 2024 ResFood Solo. Dignified Circularity.</p>
          </div>
        </div>

        {/* Sisi Kanan: Form Input */}
        <div className="flex flex-col justify-between bg-white p-8 md:w-1/2 lg:p-12">
          
          <div className="flex border-b border-gray-200 text-sm font-medium">
            <button 
              onClick={() => { setIsLogin(true); setErrorMsg(''); setSuccessMsg(''); }}
              className={`w-1/2 pb-3 text-center transition-colors ${isLogin ? 'border-b-2 border-emerald-800 text-emerald-800 font-semibold' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Login
            </button>
            <button 
              onClick={() => { setIsLogin(false); setErrorMsg(''); setSuccessMsg(''); }}
              className={`w-1/2 pb-3 text-center transition-colors ${!isLogin ? 'border-b-2 border-emerald-800 text-emerald-800 font-semibold' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Register
            </button>
          </div>

          <div className="mt-8 flex-grow">
            <h2 className="text-2xl font-bold text-gray-800">Selamat Datang</h2>
            <p className="mt-1 text-xs text-gray-500">
              {isLogin ? 'Silakan masuk ke akun Anda untuk melanjutkan.' : 'Silakan daftarkan akun baru Anda.'}
            </p>

            {errorMsg && (
              <div className="mt-4 p-3 text-sm text-red-600 bg-red-50 rounded-xl border border-red-200">
                {errorMsg}
              </div>
            )}
            {successMsg && (
              <div className="mt-4 p-3 text-sm text-emerald-700 bg-emerald-50 rounded-xl border border-emerald-200">
                {successMsg}
              </div>
            )}

            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              {/* Input Nama untuk Register */}
              {!isLogin && (
                <div>
                  <label className="text-xs font-semibold text-gray-600">Nama Lengkap</label>
                  <input 
                    type="text" 
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    required={!isLogin}
                    placeholder="Nama Lengkap" 
                    className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                  />
                </div>
              )}

              {/* Input Email */}
              <div>
                <label className="text-xs font-semibold text-gray-600">Email</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="nama@email.com" 
                  className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              {/* Input Password */}
              <div>
                <div className="flex justify-between items-center">
                  <label className="text-xs font-semibold text-gray-600">Password</label>
                  {isLogin && (
                    <a href="#forgot" className="text-xs font-semibold text-emerald-700 hover:underline">
                      Lupa Password?
                    </a>
                  )}
                </div>
                <input 
                  type="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••" 
                  className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-emerald-600 focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
              </div>

              <button 
                type="submit" 
                className="mt-4 w-full rounded-xl bg-emerald-800 p-3 text-sm font-semibold text-white transition-colors hover:bg-emerald-900"
              >
                {isLogin ? 'Masuk Sekarang' : 'Daftar Sekarang'}
              </button>
            </form>

            <div className="relative my-6 flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <span className="relative bg-white px-3 text-xs text-gray-400">Atau lanjut dengan</span>
            </div>

            <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-gray-300 p-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.97 1 12 1 7.35 1 3.41 3.67 1.48 7.57l3.77 2.92C6.16 7.37 8.85 5.04 12 5.04z"/>
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.34H12v4.43h6.44c-.28 1.47-1.11 2.71-2.36 3.55l3.66 2.84c2.14-1.97 3.39-4.88 3.39-8.48z"/>
                <path fill="#FBBC05" d="M5.25 14.75c-.25-.75-.39-1.55-.39-2.38s.14-1.63.39-2.38L1.48 7.07C.54 8.95 0 11.05 0 12.32s.54 3.37 1.48 5.25l3.77-2.82z"/>
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.66-2.84c-1.01.68-2.31 1.09-3.9 1.09-3.15 0-5.84-2.33-6.79-5.46L1.84 15.8C3.77 19.67 7.7 23 12 23z"/>
              </svg>
              Google Account
            </button>
          </div>

          <div className="mt-8 flex justify-center gap-6 text-xs text-gray-500">
            <a href="#bantuan" className="hover:underline">Bantuan</a>
            <a href="#privasi" className="hover:underline">Privasi</a>
            <a href="#ketentuan" className="hover:underline">Ketentuan</a>
          </div>

        </div>
      </div>
    </div>
  );
}
