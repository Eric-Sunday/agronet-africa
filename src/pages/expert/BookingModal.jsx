import { useState } from 'react';
import {
  X, ShieldCheck, Clock, MapPin, Star, Package, ChevronRight,
  AlertCircle, CheckCircle
} from 'lucide-react';
import { BOOKING_PACKAGES } from '../../data/mockData';

// ─────────────────────────────────────────────────────────────────────────────
// BookingModal — opens when user clicks "Book Consultation" on an expert card
// ─────────────────────────────────────────────────────────────────────────────
export default function BookingModal({ expert, onClose, onInitiateEscrow }) {
  const [selectedPkgId, setSelectedPkgId] = useState(BOOKING_PACKAGES[0].id);
  const [description, setDescription]     = useState('');
  const [descError, setDescError]         = useState(false);

  const selectedPkg = BOOKING_PACKAGES.find(p => p.id === selectedPkgId);
  const computedRate = () => {
    const base = expert[selectedPkg.rateKey];
    return selectedPkg.multiplier ? Math.round(base * selectedPkg.multiplier) : base;
  };

  const formatNaira = (n) =>
    '₦' + n.toLocaleString('en-NG');

  const handleSubmit = () => {
    if (!description.trim()) {
      setDescError(true);
      return;
    }
    setDescError(false);
    onInitiateEscrow({
      expert,
      pkg: selectedPkg,
      description: description.trim(),
      amount: computedRate(),
    });
    onClose();
  };

  // Trap clicks inside modal so backdrop click still works
  const stopProp = (e) => e.stopPropagation();

  return (
    /* ── Backdrop ── */
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      {/* ── Modal Panel ── */}
      <div
        className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden animate-scale-in"
        onClick={stopProp}
      >
        {/* Premium stripe at top */}
        <div className="h-1.5 w-full bg-gradient-to-r from-earth-400 via-earth-500 to-agro-600" />

        {/* Header */}
        <div className="flex items-start justify-between p-6 pb-4 border-b border-gray-100">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className={`w-14 h-14 bg-gradient-to-br ${expert.avatarColor} rounded-xl flex items-center justify-center shadow-lg flex-shrink-0`}>
              <span className="text-white font-bold font-display text-lg">{expert.initials}</span>
            </div>
            <div>
              <h2 className="font-display font-bold text-gray-900 text-lg leading-tight">{expert.name}</h2>
              <p className="text-sm text-agro-700 font-medium">{expert.specialty}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3 text-gray-400" />
                <span className="text-xs text-gray-500">{expert.location}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            id="booking-modal-close"
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-5 max-h-[65vh] overflow-y-auto custom-scrollbar">

          {/* ── Package Selector ── */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              <Package className="w-4 h-4 inline mr-1.5 text-agro-600" />
              Select a Package
            </label>
            <div className="space-y-2.5">
              {BOOKING_PACKAGES.map((pkg) => {
                const rate = pkg.multiplier
                  ? Math.round(expert[pkg.rateKey] * pkg.multiplier)
                  : expert[pkg.rateKey];
                const isSelected = selectedPkgId === pkg.id;
                return (
                  <button
                    key={pkg.id}
                    id={`pkg-${pkg.id}`}
                    onClick={() => setSelectedPkgId(pkg.id)}
                    className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? 'border-agro-500 bg-agro-50 shadow-sm'
                        : 'border-gray-200 hover:border-agro-300 hover:bg-agro-50/40'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                            isSelected ? 'border-agro-600 bg-agro-600' : 'border-gray-300'
                          }`}>
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </div>
                          <span className="font-semibold text-sm text-gray-900">{pkg.label}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1 ml-6">{pkg.description}</p>
                        <div className="flex items-center gap-1.5 mt-1.5 ml-6">
                          <Clock className="w-3 h-3 text-gray-400" />
                          <span className="text-xs text-gray-500">{pkg.durationLabel}</span>
                        </div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <span className="text-sm font-bold text-agro-700">{formatNaira(rate)}</span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Issue Description ── */}
          <div>
            <label htmlFor="farm-issue" className="block text-sm font-semibold text-gray-800 mb-2">
              Describe Your Farm Issue
              <span className="text-red-500 ml-1">*</span>
            </label>
            <textarea
              id="farm-issue"
              rows={4}
              value={description}
              onChange={(e) => { setDescription(e.target.value); setDescError(false); }}
              placeholder="e.g. My 50-hectare cassava farm in Ogun State is showing widespread yellowing and stunting. I suspect cassava mosaic disease but need expert confirmation and a treatment plan..."
              className={`input-field resize-none ${descError ? 'border-red-400 ring-red-100 ring-4' : ''}`}
            />
            {descError && (
              <div className="flex items-center gap-1.5 mt-1.5 text-red-500">
                <AlertCircle className="w-3.5 h-3.5" />
                <span className="text-xs">Please describe your farm issue before proceeding.</span>
              </div>
            )}
          </div>

          {/* ── Escrow Info Banner ── */}
          <div className="flex items-start gap-3 p-4 bg-sky-50 border border-sky-200 rounded-xl">
            <ShieldCheck className="w-5 h-5 text-sky-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-semibold text-sky-800">Protected by AgroNet Escrow</p>
              <p className="text-xs text-sky-700 mt-0.5">
                Funds are held securely in escrow and only released to the expert after you confirm
                milestone delivery. Zero risk to your payment.
              </p>
            </div>
          </div>
        </div>

        {/* Footer CTA */}
        <div className="p-6 pt-4 border-t border-gray-100 bg-gray-50/60">
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-gray-600">Total to Escrow:</span>
            <span className="text-xl font-bold font-display text-agro-700">
              {formatNaira(computedRate())}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={onClose}
              id="booking-cancel-btn"
              className="flex-1 btn-secondary !py-3"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              id="booking-escrow-btn"
              className="flex-1 btn-primary !py-3"
            >
              <ShieldCheck className="w-4 h-4" />
              Initiate Escrow Contract
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
