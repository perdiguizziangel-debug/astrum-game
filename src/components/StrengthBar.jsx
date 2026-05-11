import React from 'react';
import { Zap } from 'lucide-react';
import { useGame } from '../context/GameContext';

const StrengthBar = () => {
    const { gameState } = useGame();
    const student = gameState.currentUser;

    // Director doesn't need strength bar, and ensure student has strength data
    if (!student || student.role === 'director' || !student.strength) return null;

    const { current, max } = student.strength;
    const percentage = Math.min(100, Math.max(0, (current / max) * 100));
    const isFull = percentage === 100;

    return (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginRight: '1.5rem' }} title="Energía Mágica (Fuerza)">
            <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Zap
                    size={16}
                    color="#c084fc"
                    fill={isFull ? "#c084fc" : "none"}
                    className={isFull ? "animate-pulse" : ""}
                    style={{ filter: 'drop-shadow(0 0 5px #c084fc)', zIndex: 1 }}
                />
            </div>

            <div style={{
                position: 'relative',
                width: '140px',
                height: '14px',
                background: 'rgba(15, 15, 26, 0.8)',
                borderRadius: '10px',
                border: '1px solid rgba(168, 85, 247, 0.4)',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.05)',
                overflow: 'hidden',
                padding: '2px' // Inner gap for 3D effect
            }}>
                {/* Glossy Overlay */}
                <div style={{
                    position: 'absolute',
                    top: 0, left: 0, right: 0, height: '40%',
                    background: 'linear-gradient(to bottom, rgba(255,255,255,0.1), transparent)',
                    zIndex: 2,
                    pointerEvents: 'none'
                }} />

                <div style={{
                    width: `${percentage}%`,
                    height: '100%',
                    background: 'linear-gradient(180deg, #9333ea 0%, #7e22ce 50%, #6b21a8 100%)',
                    borderRadius: '8px',
                    boxShadow: '0 0 12px rgba(168, 85, 247, 0.6), inset 0 1px 2px rgba(255,255,255,0.3)',
                    transition: 'width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)',
                    position: 'relative',
                    animation: isFull ? 'pulse-bar 2s infinite' : 'none'
                }}>
                    {/* Animated Shine */}
                    <div style={{
                        position: 'absolute',
                        top: 0, left: 0, bottom: 0, width: '30px',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
                        transform: 'skewX(-25deg)',
                        animation: 'shine-slide 3s infinite linear'
                    }} />
                </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                <span style={{
                    fontSize: '0.65rem',
                    color: 'rgba(233, 213, 255, 0.6)',
                    fontWeight: 'bold',
                    letterSpacing: '0.5px',
                    marginBottom: '-2px'
                }}>
                    ENERGÍA
                </span>
                <span style={{
                    fontSize: '0.8rem',
                    color: '#fff',
                    fontFamily: 'monospace',
                    fontWeight: 'bold',
                    letterSpacing: '1px',
                    textShadow: '0 0 8px rgba(168, 85, 247, 0.8)'
                }}>
                    {current}<span style={{ opacity: 0.5, fontSize: '0.7rem' }}>/{max}</span>
                </span>
            </div>

            <style>{`
                @keyframes pulse-bar {
                    0% { filter: brightness(1); }
                    50% { filter: brightness(1.3); box-shadow: 0 0 20px #a855f7; }
                    100% { filter: brightness(1); }
                }
                @keyframes shine-slide {
                    0% { left: -50px; }
                    100% { left: 200px; }
                }
            `}</style>
        </div>
    );
};

export default StrengthBar;
