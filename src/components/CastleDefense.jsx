import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { Sword, Shield, Flame, Trophy, Users, Zap } from 'lucide-react';

const CastleDefense = () => {
    const { gameState, contributeToEvent } = useGame();
    const { activeEvent, currentUser } = gameState;

    if (!activeEvent || activeEvent.type !== 'dragon') return null;

    const hpPercent = (activeEvent.hp / activeEvent.maxHp) * 100;
    const isVictory = activeEvent.status === 'victory';

    // Animation states
    const [shake, setShake] = useState(false);
    const [damageParticles, setDamageParticles] = useState([]);

    const handleAttack = () => {
        if (currentUser?.strength?.current < 10) {
            alert("¡No tienes suficiente energía! Come algo en el Desayuno Mágico.");
            return;
        }

        // Trigger shake
        setShake(true);
        setTimeout(() => setShake(false), 500);

        // Add particles
        const newParticle = { id: Date.now(), x: Math.random() * 80 + 10, y: Math.random() * 80 + 10 };
        setDamageParticles(prev => [...prev, newParticle]);
        setTimeout(() => {
            setDamageParticles(prev => prev.filter(p => p.id !== newParticle.id));
        }, 1000);

        // Contribute!
        const attackPower = 20 + Math.floor(Math.random() * 10);
        contributeToEvent(currentUser.id, attackPower);
    };

    return (
        <div style={{
            margin: '2rem 0',
            padding: '2px',
            background: 'linear-gradient(135deg, #ff0000 0%, #000000 50%, #581c87 100%)',
            borderRadius: '24px',
            boxShadow: '0 0 50px rgba(231, 76, 60, 0.4)',
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
                {/* Boss Header */}
                <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e74c3c' }}>
                        <Flame fill="#e74c3c" size={24} />
                        <h2 style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '2px', fontSize: '1.5rem', fontWeight: '900' }}>
                            Dragon de Cristal
                        </h2>
                    </div>
                    <div style={{ background: 'rgba(231,76,60,0.1)', color: '#e74c3c', padding: '0.4rem 1rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', border: '1px solid #e74c3c' }}>
                        RAID ACTIVA
                    </div>
                </div>

                {/* Main Visualizer Area */}
                <div style={{
                    width: '100%',
                    height: '300px',
                    position: 'relative',
                    background: 'radial-gradient(circle, #1a0a0a 0%, #000 100%)',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid #333'
                }}>
                    {/* Dragon Placeholder/Sprite */}
                    <div style={{
                        width: '200px',
                        height: '200px',
                        position: 'relative',
                        transform: shake ? 'translate(5px, 5px) rotate(2deg)' : 'none',
                        transition: 'transform 0.05s linear'
                    }}>
                        <img
                            src="https://img.freepik.com/premium-photo/black-dragon-with-red-eyes-is-standing-black-background_853558-1544.jpg"
                            alt="Boss"
                            style={{ width: '100%', height: '100%', objectFit: 'contain', filter: hpPercent < 50 ? 'drop-shadow(0 0 10px #ff0000)' : 'none' }}
                        />
                        {/* Damage Number Overlay */}
                        {damageParticles.map(p => (
                            <div key={p.id} style={{
                                position: 'absolute',
                                left: `${p.x}%`,
                                top: `${p.y}%`,
                                color: '#ffeb3b',
                                fontWeight: 'bold',
                                fontSize: '1.5rem',
                                animation: 'float-up 1s ease-out forwards',
                                pointerEvents: 'none',
                                textShadow: '0 0 10px #000'
                            }}>
                                -{20 + Math.floor(Math.random() * 10)}
                            </div>
                        ))}
                    </div>

                    {/* Boss Health Bar Overlay */}
                    <div style={{ position: 'absolute', bottom: '20px', width: '80%' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fff', fontSize: '0.8rem', marginBottom: '5px', textShadow: '1px 1px 2px #000' }}>
                            <span>HP BOSS</span>
                            <span>{activeEvent.hp} / {activeEvent.maxHp}</span>
                        </div>
                        <div style={{ height: '15px', background: '#333', borderRadius: '10px', overflow: 'hidden', border: '1px solid #555' }}>
                            <div style={{
                                width: `${hpPercent}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, #e74c3c 0%, #ff5e62 100%)',
                                boxShadow: '0 0 15px #e74c3c',
                                transition: 'width 0.3s cubic-bezier(0.1, 0.7, 1.0, 0.1)'
                            }} />
                        </div>
                    </div>
                </div>

                {/* Interaction Section */}
                <div style={{ width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1.5rem' }}>
                    <div style={{ background: '#111', padding: '1.5rem', borderRadius: '16px', border: '1px solid #333' }}>
                        <div style={{ color: '#aaa', fontSize: '0.8rem', marginBottom: '1rem' }}>TUS RECURSOS</div>
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

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                        <button
                            onClick={handleAttack}
                            disabled={isVictory}
                            style={{
                                height: '100%',
                                background: isVictory ? '#27ae60' : 'linear-gradient(to bottom, #e74c3c, #c0392b)',
                                border: 'none',
                                borderRadius: '16px',
                                color: 'white',
                                fontWeight: 'bold',
                                fontSize: '1.1rem',
                                cursor: isVictory ? 'default' : 'pointer',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem',
                                transition: 'transform 0.1s',
                                boxShadow: isVictory ? '0 0 20px #27ae60' : '0 4px 15px rgba(231,76,60,0.3)'
                            }}
                            onMouseDown={(e) => !isVictory && (e.currentTarget.style.transform = 'scale(0.95)')}
                            onMouseUp={(e) => !isVictory && (e.currentTarget.style.transform = 'scale(1)')}
                        >
                            {isVictory ? (
                                <><Trophy size={32} /> ¡VICTORIA!</>
                            ) : (
                                <><Sword size={32} /> MEGA-ATAQUE (10 ST)</>
                            )}
                        </button>
                    </div>
                </div>

                {/* Participants Ranking */}
                {Object.keys(activeEvent.participants).length > 0 && (
                    <div style={{ width: '100%', marginTop: '1rem' }}>
                        <div style={{ color: '#aaa', fontSize: '0.75rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'center' }}>
                            <Users size={14} /> VALIENTES CONTRIBUYENTES
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center' }}>
                            {Object.entries(activeEvent.participants)
                                .sort(([, a], [, b]) => b - a)
                                .slice(0, 5)
                                .map(([id, amount], idx) => {
                                    const student = gameState.students.find(s => s.id === parseInt(id));
                                    return (
                                        <div key={id} style={{
                                            background: '#1a1a1a',
                                            padding: '0.3rem 0.6rem',
                                            borderRadius: '20px',
                                            fontSize: '0.7rem',
                                            border: '1px solid #333',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.4rem'
                                        }}>
                                            <span style={{ color: 'var(--color-gold)' }}>#{idx + 1}</span>
                                            <span style={{ color: '#fff' }}>{student?.name?.split(' ')[0]}</span>
                                            <span style={{ color: '#93c5fd' }}>{amount} DMG</span>
                                        </div>
                                    );
                                })}
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes float-up {
                    0% { transform: translateY(0); opacity: 1; }
                    100% { transform: translateY(-50px); opacity: 0; }
                }
                @keyframes pulse-red {
                    0% { box-shadow: 0 0 10px #e74c3c; }
                    50% { box-shadow: 0 0 25px #e74c3c; }
                    100% { box-shadow: 0 0 10px #e74c3c; }
                }
            `}</style>
        </div>
    );
};

export default CastleDefense;
