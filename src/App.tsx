import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/LoginPage/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './routes/PrivateRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<PrivateRoute />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
        <Route path="*" element={<div>Страница не найдена 404</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
