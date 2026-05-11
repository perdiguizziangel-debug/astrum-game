import React from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, Crown, Medal } from 'lucide-react';

const HouseCupHistory = () => {
    const { gameState } = useGame();
    const history = gameState.houseCupHistory;

    if (!history) return null;

    const winner = history.standings[0];
    const runnersUp = history.standings.slice(1);

    const getHouseColor = (house) => {
        switch (house) {
            case 'phoenix': return 'var(--color-phoenix)';
            case 'hipocampus': return 'var(--color-hipocampus)';
            case 'unicornius': return 'var(--color-unicornius)';
            case 'vipera': return 'var(--color-vipera)';
            default: return '#fff';
        }
    };

    const getCupImage = (house) => {
        // Map house names to capitalized filenames
        const capitalHouse = house.charAt(0).toUpperCase() + house.slice(1);
        return `/src/assets/Copa ${capitalHouse}.jpg`;
    };

    return (
        <div className="card magic-border" style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-gold)' }}>
                <Trophy size={20} />
                <h3 style={{ textTransform: 'uppercase', letterSpacing: '2px' }}>Copa de las Casas {history.year}</h3>
            </div>

            {/* Winner Section */}
            <div style={{
                background: `linear-gradient(180deg, rgba(0,0,0,0) 0%, ${getHouseColor(winner.house)}22 100%)`,
                padding: '1.5rem',
                borderRadius: '8px',
                marginBottom: '1.5rem',
                border: `1px solid ${getHouseColor(winner.house)}`,
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{ position: 'relative', marginBottom: '1rem', height: '180px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img
                        src={getCupImage(winner.house)}
                        alt={`Copa ${winner.house}`}
                        style={{
                            height: '100%',
                            maxWidth: '100%',
                            objectFit: 'contain',
                            filter: `drop-shadow(0 0 15px ${getHouseColor(winner.house)})`
                        }}
                    />
                </div>

                <h2 style={{
                    color: getHouseColor(winner.house),
                    fontFamily: 'var(--font-serif)',
                    textTransform: 'uppercase',
                    fontSize: '2rem',
                    textShadow: `0 0 10px ${getHouseColor(winner.house)}`,
                    marginTop: '0.5rem'
                }}>
                    Copa {winner.house}
                </h2>
                <p style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 'bold' }}>{winner.points} Puntos</p>
            </div>

            {/* Runners Up */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginTop: '1rem', borderTop: '1px solid #333', paddingTop: '1rem' }}>
                {runnersUp.map((h, index) => (
                    <div key={h.house} style={{ opacity: 0.7 }}>
                        <div style={{ fontSize: '0.8rem', color: '#888', marginBottom: '0.2rem' }}>
                            {index === 0 ? '2º Lugar' : index === 1 ? '3º Lugar' : '4º Lugar'}
                        </div>
                        <strong style={{ color: getHouseColor(h.house), textTransform: 'capitalize' }}>
                            {h.house}
                        </strong>
                        <div style={{ fontSize: '0.8rem' }}>{h.points}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default HouseCupHistory;
