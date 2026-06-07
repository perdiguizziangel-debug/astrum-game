import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GameProvider } from './context/GameContext';
import Layout from './components/Layout';
import Hall from './pages/Hall';
import Profile from './pages/Profile';
import MagicClassroom from './pages/MagicClassroom';
import HouseChat from './pages/HouseChat';
import Admin from './pages/Admin';
import Messages from './pages/Messages';
import Login from './pages/Login';

import Landing from './pages/Landing';

function App() {
  return (
    <GameProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/hall" element={<Layout />}>
            <Route index element={<Hall />} />
            <Route path="aula" element={<MagicClassroom />} />
            <Route path="perfil" element={<Profile />} />
            <Route path="sala-comun" element={<HouseChat />} />
            <Route path="mensajes" element={<Messages />} />
            <Route path="admin" element={<Admin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </GameProvider>
  );
}

export default App;
