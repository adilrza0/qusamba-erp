import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export const ToastContainer = () => {
  const { toasts } = useApp();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isDanger = toast.type === 'danger';
        const isWarning = toast.type === 'warning';

        return (
          <div 
            key={toast.id} 
            className="toast"
            style={{
              borderColor: isSuccess ? 'var(--emerald)' : isDanger ? 'var(--ruby)' : isWarning ? 'var(--amber)' : 'var(--border-gold)'
            }}
          >
            {isSuccess && <CheckCircle2 size={18} color="var(--emerald)" />}
            {isDanger && <AlertCircle size={18} color="var(--ruby)" />}
            {isWarning && <AlertTriangle size={18} color="var(--amber)" />}
            {!isSuccess && !isDanger && !isWarning && <Info size={18} color="var(--gold-primary)" />}

            <span style={{ fontWeight: 600 }}>{toast.message}</span>
          </div>
        );
      })}
    </div>
  );
};
