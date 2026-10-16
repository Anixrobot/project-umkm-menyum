import { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';

const DEFAULT_TOPPINGS = [
  { id: 'sosis', name: 'Sosis' },
  { id: 'bakso', name: 'Bakso' },
  { id: 'chili_oil', name: 'Chili oil' },
];

export default function ToppingModal({
  isOpen,
  product,
  onClose,
  onAddToCartWithToppings,
  toppingsList = DEFAULT_TOPPINGS,
}) {
  const [selectedToppings, setSelectedToppings] = useState([]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const toggleTopping = (topping) => {
    if (selectedToppings.some((t) => t.id === topping.id)) {
      setSelectedToppings(selectedToppings.filter((t) => t.id !== topping.id));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const formatRupiah = (num) => 'Rp' + Number(num || 0).toLocaleString('id-ID');

  const handleConfirm = () => {
    if (onAddToCartWithToppings) {
      onAddToCartWithToppings(product, selectedToppings);
    }
    onClose();
  };

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
    >
      <div className="relative w-full max-w-[520px] bg-white text-[#3a1409] rounded-[24px] sm:rounded-[28px] p-5 sm:p-7 md:p-9 border-2 border-[#f1e4da] shadow-2xl shadow-black/15 animate-in zoom-in-95 duration-200 select-none">
        {/* Tombol Tutup X di Kanan Atas */}
        <button
          onClick={onClose}
          aria-label="Tutup popup"
          className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#fff8f2] hover:bg-[#f1e4da] text-[#7a5a4c] hover:text-[#3a1409] border border-[#f1e4da] flex items-center justify-center transition-colors cursor-pointer"
        >
          <X size={17} />
        </button>

        {/* Header: Nama Produk & Deskripsi */}
        <div className="pr-8 sm:pr-10 text-left">
          <h3 className="text-xl sm:text-2xl md:text-[28px] font-extrabold text-[#3a1409] leading-tight tracking-tight">
            {product.name}
          </h3>
          <p className="text-xs sm:text-sm md:text-base text-[#7a5a4c] mt-1.5 leading-snug">
            {product.description || 'Pilihan kuliner khas MenYum'} ·{' '}
            <span className="font-bold text-[#e46000]">{formatRupiah(product.price)}</span>
          </p>
        </div>

        {/* Section Heading: Pilih Topping */}
        <div className="text-left">
          <h4 className="text-sm sm:text-base md:text-lg font-bold text-[#3a1409] mt-5 sm:mt-6 mb-2.5 sm:mb-3">
            Pilih topping
          </h4>
        </div>

        {/* Daftar Checkbox Topping (Sosis, Bakso, Chili oil tanpa harga) */}
        <div className="space-y-1 text-left">
          {toppingsList.map((topping) => {
            const isSelected = selectedToppings.some((t) => t.id === topping.id);
            return (
              <div
                key={topping.id}
                onClick={() => toggleTopping(topping)}
                className="flex items-center justify-between py-2.5 sm:py-3.5 border-b border-dashed border-[#f1e4da] cursor-pointer group select-none transition-colors px-2 hover:bg-[#fff8f2]/60 rounded-xl"
              >
                <div className="flex items-center gap-3 sm:gap-3.5">
                  <div
                    className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#e46000] border-[#e46000] text-white shadow-xs'
                        : 'border-[#d6c4b8] bg-[#fff8f2] group-hover:border-[#e46000]'
                    }`}
                  >
                    {isSelected && (
                      <Check size={14} strokeWidth={3} className="text-white" />
                    )}
                  </div>
                  <span
                    className={`text-sm sm:text-base font-semibold transition-colors ${
                      isSelected
                        ? 'text-[#3a1409] font-bold'
                        : 'text-[#5a3a2d] group-hover:text-[#e46000]'
                    }`}
                  >
                    {topping.name}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Bar: Total Harga di Kiri, Tombol Batal & Tambah di Kanan */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 sm:pt-6 mt-4 border-t border-[#f1e4da]">
          <div className="flex items-center justify-between sm:justify-start">
            <span className="text-xs text-[#7a5a4c] font-medium sm:hidden">Harga:</span>
            <span className="text-xl sm:text-2xl md:text-[28px] font-black text-[#e46000]">
              {formatRupiah(product.price)}
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-none px-4 sm:px-6 py-2.5 rounded-full bg-white hover:bg-[#fff8f2] text-[#7a5a4c] hover:text-[#3a1409] font-bold text-xs sm:text-sm border-2 border-[#f1e4da] transition-all active:scale-95 cursor-pointer text-center"
            >
              Batal
            </button>

            <button
              type="button"
              onClick={handleConfirm}
              className="flex-1 sm:flex-none px-5 sm:px-7 py-2.5 rounded-full bg-[#e46000] hover:bg-[#c85300] text-white font-bold text-xs sm:text-sm shadow-md hover:shadow-lg shadow-[#e46000]/20 transition-all active:scale-95 cursor-pointer text-center whitespace-nowrap"
            >
              Tambah ke keranjang
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
