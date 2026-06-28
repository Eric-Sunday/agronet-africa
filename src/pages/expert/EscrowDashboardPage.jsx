import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ShieldCheck, ChevronRight, Zap, ArrowRight, CheckCircle,
  Clock, AlertCircle, Trophy, Users, FileText, Unlock,
  ChevronDown, Leaf, Plus, RotateCcw
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { CONTRACT_STATES } from '../../data/mockData';

// ─────────────────────────────────────────────────────────────────────────────
// EscrowDashboardPage — /expert/escrow-dashboard
// Shows active escrow contracts with interactive state machine UI
// ─────────────────────────────────────────────────────────────────────────────
export default function EscrowDashboardPage({ currentUser, onLogout, contracts, setContracts }) {
  // Track which contracts have completed "Release Funds"
  const [releasedIds, setReleasedIds] = useState(new Set());
  // Track success flash per contract
  const [flashId, setFlashId]         = useState(null);

  const formatNaira = (n) => '₦' + Number(n).toLocaleString('en-NG');

  const advanceStage = (contractId) => {
    setContracts((prev) =>
      prev.map((c) =>
        c.id === contractId && c.stateIndex < CONTRACT_STATES.length - 1
          ? { ...c, stateIndex: c.stateIndex + 1 }
          : c
      )
    );
  };

  const releaseFunds = (contractId) => {
    // Move to released state
    setContracts((prev) =>
      prev.map((c) =>
        c.id === contractId ? { ...c, stateIndex: CONTRACT_STATES.length - 1 } : c
      )
    );
    setReleasedIds((prev) => new Set([...prev, contractId]));
    setFlashId(contractId);
    setTimeout(() => setFlashId(null), 4000);
  };

  const totalHeld = contracts
    .filter((c) => c.stateIndex < CONTRACT_STATES.length - 1)
    .reduce((sum, c) => sum + Number(c.amount), 0);

  const totalReleased = contracts
    .filter((c) => c.stateIndex === CONTRACT_STATES.length - 1)
    .reduce((sum, c) => sum + Number(c.amount), 0);

  return (
    <div className="min-h-screen bg-gray-50/60 biophilic-overlay">
      <Navbar currentUser={currentUser} onLogout={onLogout} />

      {/* ── Page Hero ── */}
      <section className="pt-28 pb-8 bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-4">
            <span className="badge-earth">
              <Zap className="w-3 h-3" />
              Agrilencer Premium
            </span>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <Link to="/expert" className="text-sm text-agro-600 hover:text-agro-800 transition-colors">Expert Directory</Link>
            <ChevronRight className="w-3.5 h-3.5 text-gray-400" />
            <span className="text-sm text-gray-500">My Escrow Contracts</span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <h1 className="text-3xl font-display font-bold text-gray-900">My Escrow Contracts</h1>
              <p className="mt-2 text-gray-600">
                Track your active consultations and release payments on milestone delivery.
              </p>
            </div>
            <Link to="/expert" id="hire-another-expert-btn" className="btn-primary text-sm !px-5 !py-2.5 flex-shrink-0">
              <Plus className="w-4 h-4" />
              Hire Another Expert
            </Link>
          </div>

          {/* ── Escrow Summary Banner ── */}
          <div className="mt-6 p-5 rounded-2xl border border-sky-200 bg-gradient-to-r from-sky-50 to-agro-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-sky-600 rounded-xl flex items-center justify-center shadow-md">
                <ShieldCheck className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-700">AgroNet Escrow Protection</p>
                <p className="text-2xl font-display font-bold text-sky-700">{formatNaira(totalHeld)}</p>
                <p className="text-xs text-gray-500">currently held in escrow across {contracts.filter(c => c.stateIndex < CONTRACT_STATES.length - 1).length} active contract{contracts.filter(c => c.stateIndex < CONTRACT_STATES.length - 1).length !== 1 ? 's' : ''}</p>
              </div>
            </div>
            <div className="flex items-center gap-6 sm:border-l sm:border-sky-200 sm:pl-6">
              <div className="text-center">
                <p className="text-lg font-display font-bold text-emerald-700">{formatNaira(totalReleased)}</p>
                <p className="text-xs text-gray-500">Total Released</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-display font-bold text-agro-700">{contracts.length}</p>
                <p className="text-xs text-gray-500">Total Contracts</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Contract List ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {contracts.length === 0 ? (
          /* Empty State */
          <div className="glass-card p-16 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-agro-50 rounded-full flex items-center justify-center mb-5">
              <Leaf className="w-10 h-10 text-agro-400" />
            </div>
            <h3 className="font-display font-bold text-gray-800 text-xl">No Active Contracts Yet</h3>
            <p className="text-gray-500 mt-2 max-w-sm">
              Head to the Expert Directory to book your first on-demand agricultural consultant.
            </p>
            <Link to="/expert" className="btn-primary mt-6">
              Browse Experts
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {contracts.map((contract) => (
              <ContractCard
                key={contract.id}
                contract={contract}
                onAdvance={() => advanceStage(contract.id)}
                onRelease={() => releaseFunds(contract.id)}
                isFlashing={flashId === contract.id}
                isReleased={releasedIds.has(contract.id)}
                formatNaira={formatNaira}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ContractCard — individual escrow contract with pipeline UI
// ─────────────────────────────────────────────────────────────────────────────
function ContractCard({ contract, onAdvance, onRelease, isFlashing, isReleased, formatNaira }) {
  const currentState = CONTRACT_STATES[contract.stateIndex];
  const isFullyReleased = contract.stateIndex === CONTRACT_STATES.length - 1;

  return (
    <div className={`glass-card overflow-hidden transition-all duration-500 ${isFlashing ? 'ring-2 ring-emerald-400 shadow-xl' : ''}`}>
      {/* Success Flash Banner */}
      {isFlashing && (
        <div className="bg-emerald-500 text-white px-6 py-3 flex items-center gap-2 animate-fade-in-down">
          <Trophy className="w-5 h-5" />
          <span className="font-semibold text-sm">
            Funds released successfully! {formatNaira(contract.amount)} sent to {contract.expertName}.
          </span>
        </div>
      )}

      {/* ── Contract Header ── */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Expert Avatar */}
            <div className={`w-14 h-14 bg-gradient-to-br ${contract.expertAvatarColor} rounded-xl flex items-center justify-center shadow-md flex-shrink-0`}>
              <span className="text-white font-bold font-display text-lg">{contract.expertInitials}</span>
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-display font-bold text-gray-900">{contract.expertName}</h3>
                <span className="badge-green text-xs">
                  <ShieldCheck className="w-2.5 h-2.5" />
                  Verified
                </span>
              </div>
              <p className="text-agro-700 font-medium text-sm">{contract.specialty}</p>
              <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                <FileText className="w-3 h-3" />
                {contract.package}
              </p>
            </div>
          </div>

          {/* State Badge + Amount */}
          <div className="text-right">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${currentState.color} ${currentState.bg} ${currentState.border}`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
              {currentState.label}
            </span>
            <p className="text-xl font-display font-bold text-gray-900 mt-2">{formatNaira(contract.amount)}</p>
            <p className="text-xs text-gray-500">Escrow Amount</p>
          </div>
        </div>
      </div>

      {/* ── Escrow Banner (inline) ── */}
      <div className="mx-6 my-4 px-4 py-3 bg-sky-50 border border-sky-200 rounded-xl flex items-center gap-3">
        <ShieldCheck className="w-4 h-4 text-sky-600 flex-shrink-0" />
        <p className="text-sm text-sky-800">
          <span className="font-semibold">{formatNaira(contract.amount)}</span>
          {' '}held safely in AgroNet Escrow for{' '}
          <span className="font-semibold">{contract.expertName.split(' ').slice(0, 2).join(' ')}'s {contract.specialty} Service</span>.
        </p>
      </div>

      {/* ── Description ── */}
      <div className="px-6 mb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Farm Issue Brief</p>
        <p className="text-sm text-gray-700 leading-relaxed bg-gray-50 rounded-xl p-3 border border-gray-100">
          "{contract.description}"
        </p>
      </div>

      {/* ── Pipeline Progress ── */}
      <div className="px-6 pb-4">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Contract Pipeline</p>
        <div className="flex items-center gap-0">
          {CONTRACT_STATES.map((state, idx) => {
            const isCompleted = idx < contract.stateIndex;
            const isCurrent  = idx === contract.stateIndex;
            const isUpcoming = idx > contract.stateIndex;
            const isLast = idx === CONTRACT_STATES.length - 1;

            return (
              <div key={state.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCompleted ? 'bg-agro-600 border-agro-600'
                    : isCurrent ? 'bg-white border-agro-500 shadow-sm shadow-agro-200'
                    : 'bg-gray-100 border-gray-200'
                  }`}>
                    {isCompleted ? (
                      <CheckCircle className="w-4 h-4 text-white fill-white" />
                    ) : isCurrent ? (
                      <span className="w-3 h-3 rounded-full bg-agro-500 animate-pulse" />
                    ) : (
                      <span className="w-2.5 h-2.5 rounded-full bg-gray-300" />
                    )}
                  </div>
                  <p className={`text-[10px] mt-1 text-center leading-tight max-w-[70px] ${
                    isCurrent ? 'text-agro-700 font-semibold'
                    : isCompleted ? 'text-gray-600'
                    : 'text-gray-400'
                  }`}>
                    {state.label}
                  </p>
                </div>
                {!isLast && (
                  <div className={`flex-1 h-0.5 mx-1 transition-colors duration-300 ${
                    isCompleted ? 'bg-agro-500' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Action Footer ── */}
      <div className="px-6 pb-6">
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 border-t border-gray-100">
          {!isFullyReleased ? (
            <>
              {/* Advance Stage (demo) */}
              {contract.stateIndex < CONTRACT_STATES.length - 1 && (
                <button
                  id={`advance-btn-${contract.id}`}
                  onClick={onAdvance}
                  className="btn-secondary !py-2.5 text-sm flex-1"
                >
                  <RotateCcw className="w-4 h-4" />
                  Simulate Next Stage
                </button>
              )}

              {/* Release Funds — only visible at Milestone Completed stage */}
              {contract.stateIndex === 2 && (
                <button
                  id={`release-funds-btn-${contract.id}`}
                  onClick={onRelease}
                  className="btn-primary !py-2.5 text-sm flex-1 !from-emerald-600 !to-emerald-500 hover:!from-emerald-500 hover:!to-emerald-400"
                >
                  <Unlock className="w-4 h-4" />
                  Release Funds to Expert
                </button>
              )}

              {/* Milestone info */}
              <div className="sm:ml-auto flex items-center gap-1.5 text-xs text-gray-500">
                <Clock className="w-3.5 h-3.5" />
                <span>Milestone: <span className="font-medium text-gray-700">{contract.milestoneLabel}</span></span>
              </div>
            </>
          ) : (
            /* Released State */
            <div className="w-full flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-700">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold">Payment Released</p>
                  <p className="text-xs text-gray-500">Contract completed on {contract.createdAt}</p>
                </div>
              </div>
              <span className="text-lg font-display font-bold text-emerald-700">{formatNaira(contract.amount)}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
