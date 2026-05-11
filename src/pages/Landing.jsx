import React from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/Landing/HeroSection';
import HouseSelector from '../components/Landing/HouseSelector';

const Landing = () => {
    const navigate = useNavigate();

    const handleEnter = () => {
        // Logic to check if user is logged in could go here
        navigate('/hall');
    };

    return (
        <div style={{ background: '#050514', minHeight: '100vh' }}>
            <HeroSection onEnter={handleEnter} />
            <HouseSelector />

            <footer style={{
                textAlign: 'center',
                padding: '2rem',
                color: '#64748b',
                fontFamily: 'var(--font-sans)',
                fontSize: '0.8rem',
                borderTop: '1px solid #1e293b',
                background: '#0f0f1a'
            }}>
                &copy; {new Date().getFullYear()} Astrum Castillo Mágico. Todos los derechos reservados.
            </footer>
        </div>
    );
};

export default Landing;
