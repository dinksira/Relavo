import { create } from 'zustand';

const useCommandStore = create((set) => ({
  isOpen: false,
  query: '',
  setOpen: (isOpen) => set({ isOpen, query: isOpen ? '' : '' }),
  toggle: () => set((state) => ({ isOpen: !state.isOpen, query: '' })),
  setQuery: (query) => set({ query }),
}));

export default useCommandStore;
