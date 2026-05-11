import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { BookOpen, Camera, Eye, Search, FlaskConical, Keyboard, X } from 'lucide-react';
import ObjectHunt from '../components/MiniGames/ObjectHunt';
import VisionTest from '../components/MiniGames/VisionTest';
import TextDetective from '../components/MiniGames/TextDetective';
import PotionMaster from '../components/MiniGames/PotionMaster';
import SpellTyper from '../components/MiniGames/SpellTyper';

const MagicClassroom = () => {
    const { gameState } = useGame();
    const [activeGame, setActiveGame] = useState(null); // 'objectHunt, 'vision', 'text', 'potion', 'spell'

    const closeModal = () => setActiveGame(null);

    return (
        <div style={{
            padding: '2rem',
            minHeight: '80vh',
            backgroundImage: 'url(https://images.unsplash.com/photo-1585521550972-e1456d354b61?auto=format&fit=crop&q=80&w=2540)', // Fallback realistic classroom
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundColor: '#1a1a1a',
            position: 'relative'
        }}>
            {/* Overlay for readability */}
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.7)' }}></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
                <header style={{ textAlign: 'center', marginBottom: '3rem', textShadow: '0 4px 10px black' }}>
                    <h1 className="magic-text" style={{ fontSize: '3rem', marginBottom: '0.5rem', color: '#e0b0ff' }}>Aula de Magia</h1>
                    <p style={{ color: '#ccc', fontSize: '1.2rem' }}>Completa las tareas para ganar puntos para tu Casa.</p>
                </header>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '2rem'
                }}>
                    {/* Activities */}
                    <div onClick={() => setActiveGame('objectHunt')} className="card magic-border" style={{ textAlign: 'center', cursor: 'pointer', transition: 'transform 0.2s', background: 'rgba(20, 20, 20, 0.8)' }}>
                        <Camera size={48} color="#f1c40f" style={{ marginBottom: '1rem' }} />
                        <h3>Caza de Reliquias</h3>
                        <p style={{ fontSize: '0.9rem', color: '#888' }}>Encuentra objetos del mundo muggle (+10 pts).</p>
                    </div>

                    <div onClick={() => setActiveGame('vision')} className="card magic-border" style={{ textAlign: 'center', cursor: 'pointer', background: 'rgba(20, 20, 20, 0.8)' }}>
                        <Eye size={48} color="#9b59b6" style={{ marginBottom: '1rem' }} />
                        <h3>Visiones del Oráculo</h3>
                        <p style={{ fontSize: '0.9rem', color: '#888' }}>Interpreta las lecturas (+15 pts).</p>
                    </div>

                    <div onClick={() => setActiveGame('text')} className="card magic-border" style={{ textAlign: 'center', cursor: 'pointer', background: 'rgba(20, 20, 20, 0.8)' }}>
                        <Search size={48} color="#3498db" style={{ marginBottom: '1rem' }} />
                        <h3>Detector</h3>
                        <p style={{ fontSize: '0.9rem', color: '#888' }}>Encuentra palabras ocultas (+10 pts).</p>
                    </div>

                    <div onClick={() => setActiveGame('potion')} className="card magic-border" style={{ textAlign: 'center', cursor: 'pointer', background: 'rgba(20, 20, 20, 0.8)' }}>
                        <FlaskConical size={48} color="#2ecc71" style={{ marginBottom: '1rem' }} />
                        <h3>Maestro de Pociones</h3>
                        <p style={{ fontSize: '0.9rem', color: '#888' }}>Memoria de ingredientes (+30 pts).</p>
                    </div>

                    <div onClick={() => setActiveGame('spell')} className="card magic-border" style={{ textAlign: 'center', cursor: 'pointer', background: 'rgba(20, 20, 20, 0.8)' }}>
                        <Keyboard size={48} color="#e74c3c" style={{ marginBottom: '1rem' }} />
                        <h3>Duelo de Hechizos</h3>
                        <p style={{ fontSize: '0.9rem', color: '#888' }}>Velocidad de conjuro (+20 pts).</p>
                    </div>
                </div>
            </div>

            {/* Game Modal */}
            {activeGame && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    background: 'rgba(0,0,0,0.9)',
                    zIndex: 1000,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '1rem'
                }}>
                    <div className="magic-border" style={{
                        background: '#1a1a1a',
                        padding: '2rem',
                        borderRadius: '16px',
                        width: '100%',
                        maxWidth: '600px',
                        position: 'relative',
                        maxHeight: '90vh',
                        overflowY: 'auto'
                    }}>
                        <button
                            onClick={closeModal}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'none',
                                border: 'none',
                                color: '#ccc',
                                cursor: 'pointer'
                            }}
                        >
                            <X size={24} />
                        </button>

                        {activeGame === 'objectHunt' && <ObjectHunt onClose={closeModal} />}
                        {activeGame === 'vision' && <VisionTest onClose={closeModal} />}
                        {activeGame === 'text' && <TextDetective onClose={closeModal} />}
                        {activeGame === 'potion' && <PotionMaster onClose={closeModal} />}
                        {activeGame === 'spell' && <SpellTyper onClose={closeModal} />}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MagicClassroom;
