import React, { useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, User, Lock, LogOut, MessageCircle, BookOpen } from 'lucide-react';
import { useGame } from '../context/GameContext';
import StrengthBar from './StrengthBar';

const Layout = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { gameState, logout, isViewingAsUser, toggleViewAsUser } = useGame();

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
                    padding: '0.75rem 1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    backdropFilter: 'blur(10px)',
                    position: 'sticky',
                    top: 0,
                    zIndex: 100,
                    flexWrap: 'wrap',
                    gap: '1rem'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                        <h1 style={{ margin: 0, fontSize: 'clamp(1.2rem, 4vw, 1.5rem)', color: 'var(--color-gold)', fontFamily: 'var(--font-serif)' }}>ASTRUM</h1>
                    </div>

                    <nav style={{ 
                        display: 'flex', 
                        gap: 'clamp(0.5rem, 2vw, 1.5rem)', 
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        justifyContent: 'center'
                    }}>
                        {gameState.currentUser && <StrengthBar />}
                        <NavLink to="/hall" icon={<Home size={18} />} label="Hall" active={isActive('/hall')} />
                        <NavLink to="/hall/aula" icon={<BookOpen size={18} />} label="Aula" active={isActive('/hall/aula')} />

                        {gameState.currentUser && (
                            <>
                                <NavLink to="/hall/perfil" icon={<User size={18} />} label="Perfil" active={isActive('/hall/perfil')} />
                                <NavLink to="/hall/sala-comun" icon={<MessageCircle size={18} />} label="Sala" active={isActive('/hall/sala-comun')} />
                                {gameState.currentUser.role === 'director' && !isViewingAsUser && (
                                    <NavLink to="/hall/admin" icon={<Lock size={18} />} label="Panel" active={isActive('/hall/admin')} />
                                )}
                                {gameState.currentUser.role === 'director' && (
                                    <button 
                                        onClick={toggleViewAsUser} 
                                        style={{ 
                                            background: 'transparent', 
                                            border: '1px solid var(--color-gold)', 
                                            color: 'var(--color-gold)', 
                                            padding: '0.2rem 0.5rem', 
                                            borderRadius: '4px', 
                                            cursor: 'pointer', 
                                            fontSize: '0.8rem',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.25rem'
                                        }}
                                        title={isViewingAsUser ? "Volver a Vista de Director" : "Ver como Usuario"}
                                    >
                                        {isViewingAsUser ? '👁️ Director' : '👁️ Usuario'}
                                    </button>
                                )}
                            </>
                        )}

                        {gameState.currentUser ? (
                            <button onClick={logout} style={{ background: 'none', border: 'none', color: '#e74c3c', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem', fontWeight: 'bold', fontSize: '0.8rem' }}>
                                <LogOut size={16} /> SALIR
                            </button>
                        ) : (
                            <Link to="/login" style={{
                                textDecoration: 'none',
                                background: 'var(--color-gold)',
                                color: 'black',
                                padding: '0.4rem 0.8rem',
                                borderRadius: '4px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem',
                                fontWeight: 'bold',
                                fontSize: '0.8rem'
                            }}>
                                <User size={16} /> ENTRAR
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
