import { Heart, Target, Compass, CheckCircle2, Award, ShieldCheck, Wallet } from 'lucide-react';

export default function Profil({ onNavigate }) {
  const values = [
    {
      metric: '100%',
      desc: 'Dimasak saat dipesan',
      detail: 'Setiap porsi nasi mentai dibakar seketika agar selalu hangat dan gurih.',
      icon: Award,
    },
    {
      metric: 'Halal',
      desc: 'Menjamin bahan makanan halal semua',
      detail: 'Bahan baku berkualitas, higienis, dan terjamin kehalalannya.',
      icon: ShieldCheck,
    },
    {
      metric: 'Kantong Pelajar',
      desc: 'Harga yang murah dan terjangkau',
      detail: 'Porsi kenyang pas untuk kantong mahasiswa dan pekerja tanpa kompromi rasa.',
      icon: Wallet,
    },
  ];

  return (
    <div className="py-6 sm:py-8 md:py-14 text-left">
      <div className="max-w-[1040px] mx-auto px-4 sm:px-5 space-y-8 sm:space-y-12">
        {/* Header Profil */}
        <div className="space-y-2 sm:space-y-3">
          <div className="inline-block px-3.5 py-1 rounded-full bg-[#f7b32b]/20 border border-[#f7b32b]/40 text-[#3a1409] text-xs font-bold">
            Tentang Usaha Kami
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-[66px] font-extrabold text-[#3a1409] leading-tight tracking-tight">
            Profil MenYum
          </h1>
          <p className="text-sm sm:text-base md:text-lg text-[#7a5a4c] max-w-2xl leading-relaxed">
            MenYum singkatan dari <strong className="text-[#e46000]">Mentai Yummy</strong>. Kami mulai dari satu ide sederhana: mentai enak tidak harus mahal.
          </p>
        </div>

        {/* 2-Column: "Kami" & "Visi" */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Card Kami */}
          <div className="rounded-[18px] bg-white border-2 border-[#f1e4da] p-5 sm:p-6 md:p-[26px] shadow-xs hover:border-[#f7b32b] transition-colors relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#fff2e5] text-[#e46000] flex items-center justify-center mb-3 sm:mb-4 border border-[#f1e4da]">
                <Heart size={20} />
              </div>
              <h2 className="text-[19px] sm:text-[20px] md:text-[22px] font-bold text-[#3a1409] mb-2 sm:mb-3">
                Kami
              </h2>
              <p className="text-sm sm:text-base text-[#7a5a4c] leading-relaxed">
                Bisnis ini lahir dari sebuah tugas perkuliahan. Dari sekadar ide kreatif mahasiswa, kami berkomitmen untuk mengembangannya menjadi usaha kuliner yang berkelanjutan dan dicintai banyak orang.
              </p>
            </div>
          </div>

          {/* Card Visi */}
          <div className="rounded-[18px] bg-white border-2 border-[#f1e4da] p-5 sm:p-6 md:p-[26px] shadow-xs hover:border-[#f7b32b] transition-colors relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="w-10 h-10 rounded-xl bg-[#fff8f2] text-[#f7b32b] flex items-center justify-center mb-3 sm:mb-4 border border-[#f1e4da]">
                <Target size={20} />
              </div>
              <h2 className="text-[19px] sm:text-[20px] md:text-[22px] font-bold text-[#3a1409] mb-2 sm:mb-3">
                Visi
              </h2>
              <p className="text-sm sm:text-base text-[#7a5a4c] leading-relaxed">
                Menjadi UMKM yang menyediakan makanan dan minuman praktis, nikmat, dan higienis untuk menemani aktivitas perkuliahan dan kerja sehari-hari.
              </p>
            </div>
          </div>
        </div>

        {/* Card Full-Width: "Misi" */}
        <div className="rounded-[18px] bg-white border-2 border-[#f1e4da] p-5 sm:p-6 md:p-[28px] shadow-xs hover:border-[#f7b32b] transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-[#fff2e5] text-[#e46000] flex items-center justify-center border border-[#f1e4da]">
              <Compass size={20} />
            </div>
            <h2 className="text-[19px] sm:text-[20px] md:text-[22px] font-bold text-[#3a1409]">
              Misi Kami
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 pt-1">
            <div className="flex items-start gap-2.5 sm:gap-3 p-3 rounded-xl bg-[#fff8f2] border border-[#f1e4da]/60">
              <CheckCircle2 size={18} className="text-[#e46000] shrink-0 mt-0.5" />
              <p className="text-sm md:text-base text-[#3a1409] font-medium leading-snug">
                Menyediakan nasi mentai dan dalgona coffee yang enak dan berkualitas tinggi.
              </p>
            </div>

            <div className="flex items-start gap-2.5 sm:gap-3 p-3 rounded-xl bg-[#fff8f2] border border-[#f1e4da]/60">
              <CheckCircle2 size={18} className="text-[#e46000] shrink-0 mt-0.5" />
              <p className="text-sm md:text-base text-[#3a1409] font-medium leading-snug">
                Menjadi pilihan utama santapan lezat untuk sarapan dan makan siang praktis.
              </p>
            </div>

            <div className="flex items-start gap-2.5 sm:gap-3 p-3 rounded-xl bg-[#fff8f2] border border-[#f1e4da]/60">
              <CheckCircle2 size={18} className="text-[#e46000] shrink-0 mt-0.5" />
              <p className="text-sm md:text-base text-[#3a1409] font-medium leading-snug">
                Menawarkan seluruh produk dengan harga ramah kantong bagi mahasiswa & pekerja.
              </p>
            </div>

            <div className="flex items-start gap-2.5 sm:gap-3 p-3 rounded-xl bg-[#fff8f2] border border-[#f1e4da]/60">
              <CheckCircle2 size={18} className="text-[#e46000] shrink-0 mt-0.5" />
              <p className="text-sm md:text-base text-[#3a1409] font-medium leading-snug">
                Memberikan pelayanan yang ramah, cepat, dan selalu memuaskan setiap pelanggan.
              </p>
            </div>
          </div>
        </div>

        {/* Seksi: "Yang Kami Pegang" */}
        <div className="pt-2 sm:pt-4">
          <div className="text-left mb-5 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl md:text-[40px] font-bold text-[#3a1409]">
              Yang Kami Pegang
            </h2>
            <p className="text-sm sm:text-base text-[#7a5a4c] mt-1">
              Komitmen utama di balik setiap porsi yang kami hidangkan untuk Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
            {values.map((val, idx) => {
              const Icon = val.icon;
              return (
                <div
                  key={idx}
                  className="rounded-[18px] bg-gradient-to-br from-[#fff8f2] to-white border-2 border-[#f1e4da] p-5 sm:p-6 text-left space-y-2 hover:shadow-md hover:border-[#f7b32b] transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[32px] sm:text-[36px] md:text-[42px] font-black text-[#e46000] tracking-tight">
                      {val.metric}
                    </span>
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white border border-[#f1e4da] flex items-center justify-center text-[#f7b32b] shadow-xs">
                      <Icon size={18} className="sm:w-5 sm:h-5" />
                    </div>
                  </div>
                  <h3 className="text-base sm:text-lg font-bold text-[#3a1409] leading-snug">
                    {val.desc}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#7a5a4c] leading-relaxed pt-1">
                    {val.detail}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Banner CTA */}
        <div className="p-6 sm:p-8 rounded-[20px] sm:rounded-[24px] bg-[#54180c] text-white flex flex-col md:flex-row items-center justify-between gap-5 sm:gap-6">
          <div className="space-y-1 text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-[#f7b32b]">
              Siap Menikmati Gurihnya Mentai MenYum?
            </h3>
            <p className="text-xs sm:text-sm text-[#fff3ea]/80">
              Pesan sekarang secara online atau kunjungi booth kami di Jatiwaringin!
            </p>
          </div>
          <button
            onClick={() => onNavigate('menu')}
            className="w-full sm:w-auto px-8 py-3 rounded-full bg-[#e46000] hover:bg-[#c85300] text-white font-bold text-sm sm:text-base shadow-lg transition-transform active:scale-95 cursor-pointer whitespace-nowrap text-center"
          >
            Buka Katalog Menu
          </button>
        </div>
      </div>
    </div>
  );
}

