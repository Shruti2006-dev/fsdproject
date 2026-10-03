import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onClose();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onClose]);

  if (!toast) return null;

  const { type = 'success', message = '' } = toast;

  const bgStyles = {
    success: 'bg-emerald-600 text-white shadow-emerald-200/50',
    error: 'bg-rose-600 text-white shadow-rose-200/50',
    info: 'bg-teal-700 text-white shadow-teal-200/50',
  };

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 flex-shrink-0" />,
    info: <Info className="w-5 h-5 flex-shrink-0" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-in">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border border-white/10 ${bgStyles[type] || bgStyles.info}`}>
        {icons[type]}
        <p className="text-sm font-medium pr-2">{message}</p>
        <button
          onClick={onClose}
          className="text-white/80 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
