import { create } from 'zustand';

const useAuthStore = create((set) => ({
  user: null,
  token: localStorage.getItem('token') || null,
  agencyId: null,
  userRole: null,
  setAuth: (user, token) => {
    localStorage.setItem('token', token);
    set({ user, token });
  },
  setAgency: (agencyId, userRole) => {
    set({ agencyId, userRole });
  },
  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, agencyId: null, userRole: null });
  },
}));

export default useAuthStore;
