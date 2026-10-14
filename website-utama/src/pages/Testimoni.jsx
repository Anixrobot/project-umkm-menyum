import { useState } from 'react';
import { Star, MessageSquarePlus, CheckCircle2 } from 'lucide-react';

export default function Testimoni({ reviews = [], onAddReview }) {
  const [name, setName] = useState('');
  const [rating, setRating] = useState('5');
  const [comment, setComment] = useState('');
  const [submittedAlert, setSubmittedAlert] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    const newRev = {
      id: Date.now(),
      name: name.trim(),
      text: comment.trim(),
      rating: parseInt(rating) || 5,
      date: 'Baru saja',
    };

    if (onAddReview) {
      onAddReview(newRev);
    }

    setName('');
    setComment('');
    setRating('5');
    setSubmittedAlert(true);
    setTimeout(() => setSubmittedAlert(false), 4000);
  };

  return (
    <div className="py-8 md:py-14 text-left">
      <div className="max-w-[1040px] mx-auto px-5 space-y-10">
        {/* Header */}
        <div className="space-y-2">
          <div className="inline-block px-3.5 py-1 rounded-full bg-[#f7b32b]/20 border border-[#f7b32b]/40 text-[#3a1409] text-xs font-bold">
            Testimoni Nyata Pembeli
          </div>
          <h1 className="text-4xl md:text-[52px] font-extrabold text-[#3a1409] leading-tight">
            Kata pelanggan
          </h1>
          <p className="text-base md:text-lg text-[#7a5a4c]">
            Dari semua, untuk semua. Cerita jujur mereka yang sudah mencicipi MenYum.
          </p>
        </div>

        {/* Grid 3 Kolom Ulasan */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {reviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#fff8f2] border-l-[5px] border-l-[#f7b32b] rounded-tr-[18px] rounded-br-[18px] border-y border-r border-[#f1e4da]/60 p-[22px] flex flex-col justify-between min-h-[145px] shadow-xs hover:shadow-md transition-shadow relative"
            >
              <div className="space-y-2">
                {/* Star rating */}
                <div className="flex items-center gap-1 text-[#f7b32b]">
                  {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                    <Star key={i} size={15} className="fill-[#f7b32b]" />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-[#3a1409] text-[15px] font-medium leading-relaxed italic">
                  "{rev.text}"
                </p>
              </div>

              {/* Author & Date */}
              <div className="pt-3 border-t border-[#f1e4da]/60 flex items-center justify-between mt-3 text-xs">
                <span className="font-bold text-[#3a1409] capitalize">
                  — {rev.name}
                </span>
                <span className="text-[#7a5a4c]/80 text-[11px] font-medium">
                  {rev.date || 'Terbaru'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Form "Tulis ulasanmu" */}
        <div className="max-w-[540px] pt-4">
          <div className="rounded-[20px] bg-white border-2 border-[#f1e4da] p-6 md:p-8 shadow-xs space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#fff2e5] text-[#e46000] flex items-center justify-center border border-[#f1e4da]">
                <MessageSquarePlus size={20} />
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-[#3a1409]">
                Tulis ulasanmu
              </h2>
            </div>

            <p className="text-sm text-[#7a5a4c]">
              Punya kesan setelah makan MenYum? Bagikan ceritamu untuk membantu teman lainnya!
            </p>

            {submittedAlert && (
              <div className="p-3 bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-xl text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                <span>Terima kasih! Ulasan kamu berhasil ditambahkan.</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-3.5">
              <div>
                <label className="text-xs font-bold text-[#3a1409] block mb-1">
                  Nama Anda *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Reyfan / Mahasiswa Semester 5"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-[11px] rounded-xl bg-white border-2 border-[#f1e4da] text-[#3a1409] placeholder-[#757575] text-sm focus:border-[#e46000] outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-[#3a1409] block mb-1">
                  Rating Bintang
                </label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full px-[18px] py-[11px] rounded-xl bg-white border-2 border-[#f1e4da] text-[#3a1409] text-sm focus:border-[#e46000] outline-none cursor-pointer"
                >
                  <option value="5">★★★★★ (5 Bintang - Sangat Enak)</option>
                  <option value="4">★★★★☆ (4 Bintang - Enak)</option>
                  <option value="3">★★★☆☆ (3 Bintang - Cukup)</option>
                  <option value="2">★★☆☆☆ (2 Bintang - Perlu Peningkatan)</option>
                  <option value="1">★☆☆☆☆ (1 Bintang - Kurang)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-[#3a1409] block mb-1">
                  Ceritakan pengalamanmu *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Bagikan rasa saus mentai, kepraktisan pesanan, atau menu favoritmu..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full px-3.5 py-[11px] rounded-xl bg-white border-2 border-[#f1e4da] text-[#3a1409] placeholder-[#757575] text-sm focus:border-[#e46000] outline-none resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-full bg-[#e46000] hover:bg-[#c85300] text-white text-base font-bold shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer"
              >
                Kirim ulasan
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
