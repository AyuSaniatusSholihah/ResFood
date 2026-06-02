import React, { useEffect, useMemo, useState } from 'react';

const SOLO_KECAMATAN = [
  'Banjarsari',
  'Jebres',
  'Laweyan',
  'Pasar Kliwon',
  'Serengan'
];

export default function OnboardingFlowModal({
  isOpen,
  mode,
  profile,
  saving,
  error,
  onSaveAddress,
  onSkipAddress,
  onFinishTour
}) {
  const [kecamatan, setKecamatan] = useState(profile?.kecamatan || '');
  const [alamatDetail, setAlamatDetail] = useState(profile?.alamat_detail || '');
  const [noTelp, setNoTelp] = useState(profile?.no_telp || '');
  const [tourStep, setTourStep] = useState(0);

  useEffect(() => {
    setKecamatan(profile?.kecamatan || '');
    setAlamatDetail(profile?.alamat_detail || '');
    setNoTelp(profile?.no_telp || '');
  }, [profile]);

  const steps = useMemo(() => ([
    {
      title: 'Temukan makanan surplus cepat',
      desc: 'Pilih Jalur A untuk makanan layak konsumsi. Pakai filter jalur agar pencarian lebih tepat.',
      icon: 'search'
    },
    {
      title: 'Pesan dan unggah bukti bayar',
      desc: 'Setelah checkout, upload bukti transfer agar penyedia bisa verifikasi pesanan Anda.',
      icon: 'payments'
    },
    {
      title: 'Pantau riwayat dan dampakmu',
      desc: 'Cek status pesanan di riwayat dan lihat dampak lingkungan dari makanan yang diselamatkan.',
      icon: 'eco'
    }
  ]), []);

  if (!isOpen) return null;

  const normalizedNoTelp = noTelp.replace(/\D/g, '');
  const displayPhone = normalizedNoTelp.startsWith('62')
    ? normalizedNoTelp.slice(2)
    : normalizedNoTelp.startsWith('0')
      ? normalizedNoTelp.slice(1)
      : normalizedNoTelp;

  return (
    <div className="fixed inset-0 z-[80] flex items-end justify-center bg-black/45 px-4 py-6 md:items-center">
      <div className="w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl">
        {mode === 'address' ? (
          <>
            <div className="bg-gradient-to-br from-[#1D9E75] to-[#0F7D5C] p-5 text-white">
              <h3 className="text-lg font-black leading-tight">Lengkapi Alamatmu Dulu</h3>
              <p className="mt-1 text-xs text-white/85">
                Biar sistem tahu area kamu di Solo untuk alur pickup dan rekomendasi terdekat.
              </p>
            </div>

            <div className="space-y-4 p-5">
              {error ? (
                <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                  {error}
                </div>
              ) : null}

              <div>
                <label className="text-xs font-bold text-gray-600">Kecamatan (Solo) *</label>
                <select
                  value={kecamatan}
                  onChange={(e) => setKecamatan(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-gray-300 px-3 py-3 text-sm outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20"
                >
                  <option value="">Pilih kecamatan</option>
                  {SOLO_KECAMATAN.map((item) => (
                    <option key={item} value={item}>{item}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600">Detail Alamat (opsional)</label>
                <textarea
                  rows={3}
                  value={alamatDetail}
                  onChange={(e) => setAlamatDetail(e.target.value)}
                  placeholder="Contoh: Jl. Slamet Riyadi No. 12"
                  className="mt-1 w-full resize-none rounded-xl border border-gray-300 px-3 py-3 text-sm outline-none focus:border-[#1D9E75] focus:ring-2 focus:ring-[#1D9E75]/20"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-600">No HP / WhatsApp (opsional)</label>
                <div className="mt-1 flex items-center rounded-xl border border-gray-300 px-3 focus-within:border-[#1D9E75] focus-within:ring-2 focus-within:ring-[#1D9E75]/20">
                  <span className="pr-2 text-sm text-gray-500">+62</span>
                  <input
                    type="text"
                    value={displayPhone}
                    onChange={(e) => setNoTelp(e.target.value.replace(/\D/g, ''))}
                    placeholder="8123456789"
                    className="w-full py-3 text-sm outline-none"
                  />
                </div>
                <p className="mt-1 text-[11px] text-gray-400">Nomor HP bisa diisi nanti sebelum transaksi.</p>
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-gray-100 p-5">
              <button
                type="button"
                onClick={onSkipAddress}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50"
              >
                Nanti Saja
              </button>

              <button
                type="button"
                disabled={saving || !kecamatan}
                onClick={() => onSaveAddress({ kecamatan, alamat_detail: alamatDetail, no_telp: noTelp })}
                className="rounded-xl bg-[#1D9E75] px-5 py-2.5 text-xs font-bold text-white transition-all hover:bg-[#147B5A] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? 'Menyimpan...' : 'Simpan Alamat'}
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="p-6">
              <div className="mb-4 inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#1D9E75]/15 text-[#1D9E75]">
                <span className="material-symbols-outlined text-[24px]" style={{ fontVariationSettings: "'FILL' 1" }}>
                  {steps[tourStep].icon}
                </span>
              </div>

              <h3 className="text-xl font-black text-gray-900">{steps[tourStep].title}</h3>
              <p className="mt-2 text-sm text-gray-600">{steps[tourStep].desc}</p>

              <div className="mt-4 flex items-center gap-2">
                {steps.map((_, i) => (
                  <span
                    key={i}
                    className={`h-2 rounded-full transition-all ${tourStep === i ? 'w-8 bg-[#1D9E75]' : 'w-2 bg-gray-300'}`}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 border-t border-gray-100 p-5">
              <button
                type="button"
                onClick={onFinishTour}
                className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-500 hover:bg-gray-50"
              >
                Lewati
              </button>

              <div className="flex items-center gap-2">
                {tourStep > 0 ? (
                  <button
                    type="button"
                    onClick={() => setTourStep((p) => p - 1)}
                    className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-bold text-gray-600 hover:bg-gray-50"
                  >
                    Kembali
                  </button>
                ) : null}

                <button
                  type="button"
                  onClick={() => {
                    if (tourStep === steps.length - 1) {
                      onFinishTour();
                    } else {
                      setTourStep((p) => p + 1);
                    }
                  }}
                  className="rounded-xl bg-[#1D9E75] px-5 py-2.5 text-xs font-bold text-white hover:bg-[#147B5A]"
                >
                  {tourStep === steps.length - 1 ? 'Selesai' : 'Lanjut'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
