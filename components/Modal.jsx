'use client';

// Single shared modal shell, reused for both venue info and camera detail —
// same pattern as the prototype, which used one #venue-modal element for
// both purposes rather than building two separate popups.
export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div className="modal-backdrop open" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="modal-card">
        <button className="modal-close" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  );
}
