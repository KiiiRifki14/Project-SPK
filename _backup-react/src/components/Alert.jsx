import React, { useEffect } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export default function Alert({ alert, onClose }) {
  useEffect(() => {
    if (!alert) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [alert, onClose]);

  if (!alert) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />,
    error: <XCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-bps-blue flex-shrink-0" />
  };

  const bgs = {
    success: 'bg-emerald-50 border-emerald-200 text-emerald-900',
    warning: 'bg-amber-50 border-amber-200 text-amber-900',
    error: 'bg-rose-50 border-rose-200 text-rose-900',
    info: 'bg-blue-50 border-blue-200 text-blue-900'
  };

  const type = alert.type || 'info';

  return (
    <div 
      role="status" 
      aria-live="polite" 
      className="fixed top-5 right-5 z-50 max-w-md w-full animate-bounce-in shadow-xl rounded-xl border p-4 backdrop-blur-sm transition-all duration-300 no-print"
    >
      <div className={`flex items-start gap-3 p-3 rounded-lg border ${bgs[type] || bgs.info}`}>
        {icons[type] || icons.info}
        <div className="flex-1 text-sm font-medium pr-2">
          {alert.message}
        </div>
        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors p-1 focus:outline-none focus-visible:ring-2 focus-visible:ring-bps-blue rounded"
          aria-label="Tutup notifikasi"
        >
          <X className="w-4 h-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
