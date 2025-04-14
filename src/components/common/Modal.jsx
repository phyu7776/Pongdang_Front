import React from 'react';

const Modal = ({ isOpen, onClose, title, children, actions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[9999]">
      <div className="absolute inset-0 bg-black bg-opacity-30" onClick={onClose} />
      <div className="bg-white dark:bg-zinc-800 rounded-xl shadow-xl p-6 max-w-md w-full mx-4 relative z-10">
        {title && (
          <p className="text-lg font-semibold text-gray-900 dark:text-white mb-3">{title}</p>
        )}
        <div className="flex-1">
          {children}
        </div>
        {actions && (
          <div className="flex justify-end gap-2 mt-6">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
};

export default Modal; 