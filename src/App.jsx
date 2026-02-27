import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Pokedex from './pages/Pokedex.jsx';
import PokeboxPage from './pages/PokeboxPage.jsx';
import Dashboard from './pages/dashboard.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pokedex" element={<Pokedex />} />
        <Route path="/pokebox" element={<PokeboxPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
