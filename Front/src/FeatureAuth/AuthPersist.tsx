import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import { fetchCurrentUser } from '../store/slice/authslice';
import LoadingSpinner from '../componenet/common/LoadingSpinner';

const AuthPersist = ({ children }: { children: React.ReactNode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { token, user, isLoading } = useSelector((state: RootState) => state.auth);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      if (token && !user) {
        await dispatch(fetchCurrentUser());
      }
      setIsInitializing(false);
    };

    initializeAuth();
  }, [dispatch, token, user]);

  if (isInitializing || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthPersist; 