import { toast, Toaster } from 'react-hot-toast';
import { Check, XCircle } from 'lucide-react';

export const showSuccessToast = (message) => {
  toast.custom((t) => (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center mb-4">
      <div className="bg-green-500 text-white px-8 py-4 rounded-lg shadow-lg flex items-center gap-3">
        <Check className="w-5 h-5" />
        <p className="text-base font-medium">{message}</p>
      </div>
    </div>
  ), {
    duration: 2000,
    position: 'bottom-center'
  });
};

export const showErrorToast = (message) => {
  toast.custom((t) => (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center mb-4">
      <div className="bg-red-500 text-white px-8 py-4 rounded-lg shadow-lg flex items-center gap-3">
        <XCircle className="w-5 h-5" />
        <p className="text-base font-medium">{message}</p>
      </div>
    </div>
  ), {
    duration: 3000,
    position: 'bottom-center'
  });
};

export const ToasterConfig = () => (
  <Toaster
    position="bottom-center"
    containerClassName="!transform-none"
    toastOptions={{
      className: '!transform-none',
      style: {
        background: 'transparent',
        boxShadow: 'none',
        padding: 0,
        maxWidth: 'none',
        width: 'auto'
      }
    }}
  />
); 