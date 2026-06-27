import { motion, AnimatePresence } from 'framer-motion';
import { FiCheck, FiX, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import useToastStore from '@/store/useToastStore';

const icons = {
  success: <FiCheck className="w-5 h-5 text-green-400" />,
  error: <FiX className="w-5 h-5 text-red-400" />,
  info: <FiInfo className="w-5 h-5 text-blue-400" />,
  warning: <FiAlertTriangle className="w-5 h-5 text-yellow-400" />,
};

const borders = {
  success: 'border-green-500/30',
  error: 'border-red-500/30',
  info: 'border-blue-500/30',
  warning: 'border-yellow-500/30',
};

export default function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className={`glass-strong flex items-center gap-3 px-4 py-3 ${borders[toast.type]}`}
          >
            {icons[toast.type]}
            <p className="text-sm text-white/90 flex-1">{toast.message}</p>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-white/40 hover:text-white/80 transition-colors"
            >
              <FiX className="w-4 h-4" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
