import React, { useState, useEffect } from 'react';
import { Parallax } from 'react-parallax';
import { ChevronDown } from 'lucide-react';

const HeroSection = ({ onEnter }) => {
    const [text, setText] = useState('');
    const fullText = "Un reino nacido de la convergencia de estrellas y magia antigua...";

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setText(fullText.substring(0, index));
            index++;
            if (index > fullText.length) clearInterval(interval);
        }, 50);
        return () => clearInterval(interval);
    }, []);

    return (
        <Parallax
            blur={0}
            bgImage="https://images.unsplash.com/photo-1599707367072-cd6ad6cb3d50?q=80&w=2070&auto=format&fit=crop" // Placeholder: Hogwarts/Castle style
            bgImageAlt="Castillo de Astrum"
            strength={200}
        >
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', position: 'relative' }}>
                {/* Dark Overlay */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                    background: 'rgba(5, 5, 20, 0.6)',
                    zIndex: 0
                }}></div>

                {/* Content */}
                <div style={{ zIndex: 1, padding: '2rem', maxWidth: '800px' }}>
                    <h1 style={{
                        fontFamily: 'var(--font-serif)',
                        fontSize: '4rem',
                        background: 'linear-gradient(to right, #c084fc, #6366f1)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        textShadow: '0 0 30px rgba(192, 132, 252, 0.5)',
                        marginBottom: '1rem'
                    }}>
                        Bienvenido al Castillo de Astrum
                    </h1>

                    <p style={{
                        fontFamily: 'var(--font-sans)',
                        fontSize: '1.5rem',
                        color: '#e0e7ff',
                        minHeight: '3rem',
                        textShadow: '0 2px 4px rgba(0,0,0,0.8)'
                    }}>
                        {text}<span className="animate-pulse">|</span>
                    </p>

                    <button
                        onClick={onEnter}
                        className="button-primary"
                        style={{
                            marginTop: '3rem',
                            padding: '1rem 3rem',
                            fontSize: '1.2rem',
                            background: 'transparent',
                            border: '2px solid #8b5cf6',
                            boxShadow: '0 0 15px #8b5cf6, inset 0 0 15px #8b5cf6',
                            color: '#fff',
                            textTransform: 'uppercase',
                            letterSpacing: '2px',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.target.style.background = '#8b5cf6';
                            e.target.style.boxShadow = '0 0 30px #8b5cf6';
                        }}
                        onMouseLeave={(e) => {
                            e.target.style.background = 'transparent';
                            e.target.style.boxShadow = '0 0 15px #8b5cf6, inset 0 0 15px #8b5cf6';
                        }}
                    >
                        Entrar al Castillo
                    </button>
                </div>

                <div style={{ position: 'absolute', bottom: '2rem', zIndex: 1, animation: 'bounce 2s infinite' }}>
                    <ChevronDown size={40} color="#a78bfa" />
                </div>
            </div>
            <style>{`
                @keyframes bounce {
                    0%, 20%, 50%, 80%, 100% {transform: translateY(0);}
                    40% {transform: translateY(-10px);}
                    60% {transform: translateY(-5px);}
                }
            `}</style>
        </Parallax>
    );
};

export default HeroSection;
