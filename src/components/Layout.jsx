import React, { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, User, Lock, LogOut, MessageCircle, BookOpen } from 'lucide-react';
import { useGame } from '../context/GameContext';
import StrengthBar from './StrengthBar';

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { gameState, logout } = useGame();

    const isActive = (path) => location.pathname === path;

    useEffect(() => {
        if (location.pathname === '/') {
            navigate('/hall');
        }
    }, [location, navigate]);

    return (
        <div className="min-h-screen flex flex-col" style={{ background: '#0a0a0a', color: 'white' }}>

            {/* Main Content Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', overflowY: 'auto' }}>

                {/* Top Navigation Header */}
                <header style={{
                    backgroundColor: 'rgba(18, 18, 18, 0.95)',
                    borderBottom: '1px solid #333',
                    padding: '1rem 2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backdropFilter: 'blur(10px)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <h1 style={{ margin: 0, fontSize: '1.5rem', color: 'var(--color-gold)', fontFamily: 'var(--font-serif)' }}>ASTRUM</h1>
                    </div>

                    <nav style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                        <NavLink to="/hall" icon={<Home size={18} />} label="Hall Central" active={isActive('/hall')} />
                        <NavLink to="/hall/aula" icon={<BookOpen size={18} />} label="Aula" active={isActive('/hall/aula')} />

                        {gameState.currentUser && (
                            <>
                                <StrengthBar />
                                <NavLink to="/hall/perfil" icon={<User size={18} />} label="Mi Perfil" active={isActive('/hall/perfil')} />
                                <NavLink to="/hall/sala-comun" icon={<MessageCircle size={18} />} label="Sala Común" active={isActive('/hall/sala-comun')} />
                                <NavLink to="/hall/admin" icon={<Lock size={18} />} label="Dirección" active={isActive('/hall/admin')} />
                            </>
                        )}

                        {gameState.currentUser ? (
                            <button onClick={logout} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}>
                                <LogOut size={18} /> SALIR
                            </button>
                        ) : (
                            <Link to="/login" style={{
                                textDecoration: 'none',
                                background: 'var(--color-gold)',
                                color: 'black',
                                padding: '0.5rem 1rem',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontWeight: 'bold'
                            }}>
                                <User size={18} /> INICIAR SESIÓN
                            </Link>
                        )}
                    </nav>
                </header>

                <main style={{ flex: 1, padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
                    <Outlet />
                </main>

                <footer style={{
                    textAlign: 'center',
                    padding: '1rem',
                    color: '#444',
                    fontSize: '0.8rem',
                    borderTop: '1px solid #222'
                }}>
                    <p>ASTRUM &copy; {new Date().getFullYear()} - Magister Ludi</p>
                </footer>
            </div>
        </div>
    );
};

const NavLink = ({ to, icon, label, active }) => (
    <Link to={to} style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        textDecoration: 'none',
        color: active ? 'var(--color-gold)' : 'var(--color-text-muted)',
        transition: 'color 0.3s',
        fontWeight: active ? 'bold' : 'normal'
    }}>
        {icon}
        <span>{label}</span>
    </Link>
);

export default Layout;
