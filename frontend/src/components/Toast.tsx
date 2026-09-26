import React, { useEffect, useState } from 'react';

interface ToastMessage {
  id: number;
  text: string;
}

/**
 * Global toast component listening for `realm-notify` custom events.
 * Usage: elsewhere in the app call
 *   window.dispatchEvent(new CustomEvent('realm-notify', { detail: 'Your message' }));
 */
const Toast: React.FC = () => {
  const [queue, setQueue] = useState<ToastMessage[]>([]);
  const [current, setCurrent] = useState<ToastMessage | null>(null);

  useEffect(() => {
    const handler = (e: CustomEvent) => {
      const msg = (e.detail || '').toString();
      if (!msg) return;
      const id = Date.now() + Math.random();
      setQueue(q => [...q, { id, text: msg }]);
    };
    window.addEventListener('realm-notify', handler as EventListener);
    return () => window.removeEventListener('realm-notify', handler as EventListener);
  }, []);

  useEffect(() => {
    if (!current && queue.length > 0) {
      const [next, ...rest] = queue;
      setCurrent(next);
      setQueue(rest);
      // hide after 3 seconds
      const timer = setTimeout(() => setCurrent(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [queue, current]);

  if (!current) return null;

  return (
    <div className="fixed bottom-6 right-6 max-w-xs bg-[#1e1e1e] text-[#e0cdad] p-4 rounded-lg shadow-xl border-2 border-[#7a5e3f] animate-fade-in">
      {current.text}
    </div>
  );
};

export default Toast;
