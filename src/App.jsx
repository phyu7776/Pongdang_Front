// src/App.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

function App() {
  const isLoggedIn = !!localStorage.getItem('token');

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      {/* 나중에 Register랑 Dashboard 추가할게 */}
      <Route
        path="/dashboard"
        element={isLoggedIn ? <div>Dashboard</div> : <Navigate to="/login" />}
      />
    </Routes>
  );
}

export default App;
