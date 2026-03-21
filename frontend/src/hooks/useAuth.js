import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import { authAPI } from '../services/api';

const useAuth = () => {
  const navigate = useNavigate();
  const { user, token, setAuth, logout } = useAuthStore();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    authAPI.me().catch(() => {
      logout();
      navigate('/login');
    });
  }, []);

  return { user, token, logout };
};

export default useAuth;
