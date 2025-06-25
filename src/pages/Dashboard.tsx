import { useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const Dashboard = () => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <div>
      <h1>Добро пожаловать! Вы вошли в систему.</h1>
      <button onClick={handleLogout}>Выйти</button>
    </div>
  );
};

export default Dashboard;
