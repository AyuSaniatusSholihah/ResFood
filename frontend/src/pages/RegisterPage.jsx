import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function RegisterPage() {
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const validateEmail = (emailStr) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(emailStr);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    // Client-side validations
    if (!nama.trim()) {
      setErrorMsg('Nama Lengkap harus diisi!');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMsg('Format email tidak valid!');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Password minimal harus 8 karakter!');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nama, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Pendaftaran gagal');
      }

      // Setelah register, user tetap harus login manual.
      setSuccessMsg('Registrasi berhasil! Silakan login dulu.');

      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 px-6 py-12 font-sans md:bg-[#1D9E75]/5">
      {/* Card Wrapper */}
      <div className="mx-auto w-full max-w-md rounded-2xl bg-white p-8 shadow-md border border-gray-100">
        
        {/* Header/Brand logo */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-[#1D9E75]">TurahanSolo</h2>
          <p className="mt-2 text-sm text-gray-500">Mulai langkah Anda mengelola surplus pangan bermartabat.</p>
        </div>

        {/* Message Notifications */}
        {errorMsg && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600 transition-all">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-3 text-xs text-green-700 transition-all">
            {successMsg}
          </div>
        )}

        {/* Form */}
        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          {/* Nama Lengkap */}
          <div>
            <label className="text-xs font-semibold text-gray-600">Nama Lengkap</label>
            <input
              type="text"
              required
              value={nama}
              onChange={(e) => setNama(e.target.value)}
              placeholder="Masukkan nama lengkap"
              className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-[#1D9E75] focus:outline-none focus:ring-1 focus:ring-[#1D9E75]"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-gray-600">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nama@email.com"
              className="mt-1 w-full rounded-xl border border-gray-300 p-3 text-sm focus:border-[#1D9E75] focus:outline-none focus:ring-1 focus:ring-[#1D9E75]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-semibold text-gray-600">Password</label>
            <div className="relative mt-1">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimal 8 karakter"
                className="w-full rounded-xl border border-gray-300 p-3 pr-10 text-sm focus:border-[#1D9E75] focus:outline-none focus:ring-1 focus:ring-[#1D9E75]"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-[#1D9E75]"
              >
                {showPassword ? (
                  // Eye Slash SVG
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l18 18" />
                  </svg>
                ) : (
                  // Eye SVG
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-6 w-full rounded-xl bg-[#1D9E75] p-3 text-sm font-semibold text-white transition-all hover:bg-[#16805E] active:scale-[0.98] disabled:opacity-50"
          >
            {loading ? 'Mendaftarkan...' : 'Daftar Sekarang'}
          </button>
        </form>

        {/* Link back to login */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <span>Sudah punya akun? </span>
          <Link to="/login" className="font-semibold text-[#1D9E75] hover:underline">
            Masuk
          </Link>
        </div>

      </div>
    </div>
  );
}
