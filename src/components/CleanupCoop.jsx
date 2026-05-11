import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, Users, Hammer, Eraser, Star, Zap } from 'lucide-react';

const CleanupCoop = () => {
    const { gameState, contributeToEvent } = useGame();
    const { activeEvent, currentUser } = gameState;

    if (!activeEvent || activeEvent.type !== 'cleanup') return null;

    const progressPercent = ((activeEvent.maxHp - activeEvent.hp) / activeEvent.maxHp) * 100;
    const isVictory = activeEvent.status === 'victory';

    const [sparkle, setSparkle] = useState(false);

    const handleClean = () => {
        if (currentUser?.strength?.current < 10) {
            alert("¡No tienes suficiente energía! Recupérate en el Desayuno Mágico.");
            return;
        }

        setSparkle(true);
        setTimeout(() => setSparkle(false), 600);

        const cleanPower = 15 + Math.floor(Math.random() * 10);
        contributeToEvent(currentUser.id, cleanPower);
    };

    return (
        <div style={{
            margin: '2rem 0',
            padding: '2px',
            background: 'linear-gradient(135deg, #00f2fe 0%, #000 50%, #2ecc71 100%)',
            borderRadius: '24px',
            boxShadow: '0 0 50px rgba(46, 204, 113, 0.3)',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                background: '#0a0a0a',
                borderRadius: '22px',
                padding: '2rem',
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem',
                textAlign: 'center'
            }}>
                {/* Header */}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#2ecc71' }}>
                        <Sparkles size={24} />
                        <h2 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '1.5rem', fontWeight: '900' }}>
                            Restauración del Castillo
                        </h2>
                    </div>
                    <div style={{ background: 'rgba(46,204,113,0.1)', color: '#2ecc71', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', border: '1px solid #2ecc71' }}>
                        EVENTO COOPERATIVO
                    </div>
                </div>

                {/* Main Visualizer Area */}
                <div style={{
                    width: '100%',
                    height: '250px',
                    position: 'relative',
                    background: 'radial-gradient(circle, #0a1a1a 0%, #000 100%)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #333',
                    overflow: 'hidden'
                }}>
                    {/* Visual elements (broom/magic glow) */}
                    <div style={{
                        width: '150px',
                        height: '150px',
                        position: 'relative',
                        animation: sparkle ? 'pulse-green 0.5s ease-in-out' : 'float-gentle 3s ease-in-out infinite'
                    }}>
                        <Eraser size={100} color="#00f2fe" style={{ opacity: 0.8 }} />
                        {sparkle && (
                            <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Sparkles size={120} color="#fff" />
                            </div>
                        )}
                    </div>

                    {/* Progress Bar Overlay */}
                    <div style={{ position: 'absolute', bottom: '20px', width: '80%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: '0.8rem', marginBottom: '5px' }}>
                            <span>RESTAURACIÓN TOTAL</span>
                            <span>{Math.round(progressPercent)}%</span>
                        </div>
                        <div style={{ height: '15px', background: '#333', borderRadius: '10px', overflow: 'hidden', border: '1px solid #555' }}>
                            <div style={{
                                width: `${progressPercent}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, #00f2fe 0%, #2ecc71 100%)',
                                boxShadow: '0 0 15px #2ecc71',
                                transition: 'width 0.5s ease'
                            }} />
                        </div>
                    </div>
                </div>

                <p style={{ color: '#aaa', fontSize: '0.9rem', maxWidth: '80%' }}>
                    Une fuerzas con tus compañeros para limpiar los rastros de magia oscura del gran salón.
                </p>

                {/* Interaction Section */}
                <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
                    <div style={{ background: '#111', padding: '1.5rem', borderRadius: '16px', border: '1px solid #333' }}>
                        <div style={{ color: '#aaa', fontSize: '0.8rem', marginBottom: '1rem' }}>RECURSOS DISPONIBLES</div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ color: '#a855f7', fontWeight: 'bold', fontSize: '1.2rem' }}>{currentUser?.strength?.current}</div>
                                <div style={{ fontSize: '0.6rem', color: '#666' }}>STRENGTH</div>
                            </div>
                            <div style={{ height: '20px', width: '1px', background: '#333' }} />
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ color: '#3b82f6', fontWeight: 'bold', fontSize: '1.2rem' }}>{currentUser?.xp}</div>
                                <div style={{ fontSize: '0.6rem', color: '#666' }}>XP</div>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={handleClean}
                        disabled={isVictory}
                        style={{
                            background: isVictory ? '#2ecc71' : 'linear-gradient(to bottom, #00f2fe, #0097a7)',
                            border: 'none',
                            borderRadius: '16px',
                            color: isVictory ? 'white' : '#000',
                            fontWeight: 'bold',
                            fontSize: '1.1rem',
                            cursor: isVictory ? 'default' : 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            transition: 'all 0.2s',
                            boxShadow: isVictory ? '0 0 20px #2ecc71' : '0 4px 15px rgba(0,242,254,0.3)'
                        }}
                    >
                        {isVictory ? (
                            <><Trophy size={32} /> ¡BRillante!</>
                        ) : (
                            <><Hammer size={32} /> RESTAURAR (10 ST)</>
                        )}
                    </button>
                </div>

                {/* Team Status */}
                <div style={{ width: '100%', marginTop: '1rem', borderTop: '1px solid #222', paddingTop: '1rem' }}>
                    <div style={{ color: '#aaa', fontSize: '0.75rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
                        <Users size={14} /> EQUIPO DE MANTENIMIENTO
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                        {Object.entries(activeEvent.participants).length === 0 ? (
                            <span style={{ fontSize: '0.7rem', color: '#555' }}>Esperando voluntarios...</span>
                        ) : (
                            Object.entries(activeEvent.participants)
                                .sort(([, a], [, b]) => b - a)
                                .map(([id, amount]) => {
                                    const student = gameState.students.find(s => s.id === parseInt(id));
                                    return (
                                        <div key={id} style={{
                                            background: 'rgba(46,204,113,0.1)',
                                            padding: '0.2rem 0.5rem',
                                            borderRadius: '10px',
                                            fontSize: '0.65rem',
                                            border: '1px solid rgba(46,204,113,0.3)',
                                            color: '#fff'
                                        }}>
                                            {student?.name?.split(' ')[0]}: {amount}pt
                                        </div>
                                    );
                                })
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                @keyframes float-gentle {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes pulse-green {
                    0% { transform: scale(1); opacity: 1; filter: brightness(1); }
                    50% { transform: scale(1.1); filter: brightness(1.5); }
                    100% { transform: scale(1); opacity: 1; filter: brightness(1); }
                }
            `}</style>
        </div>
    );
};

export default CleanupCoop;
