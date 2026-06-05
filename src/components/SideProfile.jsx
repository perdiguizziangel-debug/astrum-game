import React from 'react';
import { useGame } from '../context/GameContext';
import { Star, Wand2, Shield } from 'lucide-react';

const SideProfile = () => {
    const { gameState } = useGame();
    const user = gameState.currentUser;

    if (!user) return null;

    // Helper to get house styling
    const getHouseColor = (house) => {
        const colors = {
            phoenix: '#e74c3c',
            hipocampus: '#3498db',
            unicornius: '#f1c40f',
            vipera: '#2ecc71',
            default: '#999'
        };
        return colors[house] || colors.default;
    };

    const houseColor = getHouseColor(user.house);

    // Level progress calculation (Basic logic for now: XP / 1000)
    // Assuming next level is current level * 1000 or similar. 
    // Let's simpler: Level X, XP: Y / (Level * 100)
    const xpForNextLevel = user.level * 100;
    const progressPercent = Math.min((user.xp / xpForNextLevel) * 100, 100);

    return (
        <aside style={{
            width: '280px',
            background: '#121212',
            borderRight: '1px solid #333',
            display: 'flex',
            flexDirection: 'column',
            padding: '2rem 1.5rem',
            gap: '2rem',
            position: 'sticky',
            top: 0,
            height: '100vh',
            boxSizing: 'border-box'
        }}>

            {/* Avatar Section */}
            <div style={{ textAlign: 'center', position: 'relative' }}>
                <div style={{
                    position: 'relative',
                    width: '140px',
                    height: '140px',
                    margin: '0 auto 1rem',
                }}>
                    <img
                        src={user.avatar}
                        alt={user.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            borderRadius: '50%',
                            border: `4px solid ${houseColor}`,
                            objectFit: 'cover',
                            boxShadow: `0 0 20px ${houseColor}66`
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        bottom: 0,
                        right: 10,
                        background: houseColor,
                        color: '#000',
                        fontWeight: 'bold',
                        borderRadius: '12px',
                        padding: '2px 8px',
                        fontSize: '0.8rem',
                        border: '2px solid #121212'
                    }}>
                        Lvl {user.level}
                    </div>
                </div>

                <h2 style={{
                    fontFamily: 'var(--font-serif)',
                    color: houseColor,
                    margin: '0.5rem 0',
                    fontSize: '1.4rem'
                }}>
                    {user.name}
                </h2>
                <div style={{
                    textTransform: 'capitalize',
                    letterSpacing: '2px',
                    fontSize: '0.8rem',
                    color: 'var(--color-text-muted)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem'
                }}>
                    <Shield size={12} /> {user.house}
                </div>
            </div>

            {/* Stats Section */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* XP Progress */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
                        <span style={{ color: '#aaa' }}>Experiencia</span>
                        <span style={{ color: houseColor }}>{user.xp} / {xpForNextLevel}</span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: '#333', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{
                            width: `${progressPercent}%`,
                            height: '100%',
                            background: houseColor,
                            boxShadow: `0 0 10px ${houseColor}`
                        }} />
                    </div>
                </div>

                {/* Quick Stats Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '8px', textAlign: 'center', border: '1px solid #333' }}>
                        <Star size={20} color="var(--color-gold)" style={{ marginBottom: '0.5rem' }} />
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{user.points || 0}</div>
                        <div style={{ fontSize: '0.7rem', color: '#888' }}>PUNTOS TOTALES</div>
                    </div>
                    <div style={{ background: '#1a1a1a', padding: '1rem', borderRadius: '8px', textAlign: 'center', border: '1px solid #333' }}>
                        <Wand2 size={20} color="var(--color-purple)" style={{ marginBottom: '0.5rem' }} />
                        <div style={{ fontSize: '1.2rem', fontWeight: 'bold', textTransform: 'capitalize' }}>{user.wand?.wood || '?'}</div>
                        <div style={{ fontSize: '0.7rem', color: '#888' }}>VARITA</div>
                    </div>
                </div>

                {/* Achievements / Streaks Summary (Placeholder for now) */}
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '8px', border: '1px solid #222' }}>
                    <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem', color: '#ccc' }}>Rachas Actuales</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.8rem', color: '#888' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Participación</span>
                            <span style={{ color: 'var(--color-gold)' }}>{user.streakDirector || 0} dias</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span>Mascota</span>
                            <span style={{ color: 'var(--color-vipera)' }}>{user.streakAnimal || 0} dias</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer / Quote */}
            <div style={{ marginTop: 'auto', textAlign: 'center', fontStyle: 'italic', color: '#555', fontSize: '0.8rem' }}>
                "La magia florece solo en almas raras."
            </div>

        </aside>
    );
};

export default SideProfile;
