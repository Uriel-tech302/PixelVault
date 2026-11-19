import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';
import Register from './pages/Register';
import Inventory from './pages/Inventory'; // <-- IMPORTA ESTO

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar" element={<ForgotPassword />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/inventario" element={<Inventory />} /> {/* <-- NUEVA RUTA */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;