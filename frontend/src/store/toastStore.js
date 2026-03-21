import { create } from 'zustand';

const useToastStore = create((set) => ({
  toasts: [],
  addToast: (message, variant = 'info') => {
    const id = Date.now();
    set(state => ({ toasts: [...state.toasts, { id, message, variant }] }));
    setTimeout(() => {
      set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }));
    }, 3200);
  },
  removeToast: (id) => set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),
}));

export default useToastStore;
