import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { loginSuccess } from './authSlice';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      const parsedUser = JSON.parse(user);
      if (parsedUser.role === 'admin') {
        dispatch(loginSuccess({ token, user: parsedUser }));
      } else {
        // If not admin, clear storage and redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
      }
    }
  }, [dispatch, navigate]);
};