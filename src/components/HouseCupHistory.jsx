import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Trophy, Trash2, PlusCircle } from 'lucide-react';

const HouseCupHistory = ({ isDirector = false }) => {
    const { gameState, addHouseCupRecord, deleteHouseCupRecord } = useGame();
    const history = gameState.houseCupHistory || [];

    const [newYear, setNewYear] = useState(new Date().getFullYear());
    const [newWinner, setNewWinner] = useState('phoenix');
    const [newPoints, setNewPoints] = useState(5000);

    const getHouseColor = (house) => {
        switch (house) {
            case 'phoenix': return 'var(--color-phoenix)';
            case 'hipocampus': return 'var(--color-hipocampus)';
            case 'unicornius': return 'var(--color-unicornius)';
            case 'vipera': return 'var(--color-vipera)';
            default: return '#fff';
        }
    };

    const getHouseName = (house) => {
        switch (house) {
            case 'phoenix': return 'Fénix';
            case 'hipocampus': return 'Hipocampo';
            case 'unicornius': return 'Unicornio';
            case 'vipera': return 'Víbora';
            default: return house;
        }
    };

    const getCupImage = (house) => {
        const capitalHouse = house.charAt(0).toUpperCase() + house.slice(1);
        return `/src/assets/Copa ${capitalHouse}.jpg`;
    };

    const handleAddRecord = () => {
        if (!newYear || !newWinner) return;
        addHouseCupRecord({ year: parseInt(newYear), winner: newWinner, points: parseInt(newPoints) || 0 });
    };

    return (
        <div className="card magic-border" style={{ textAlign: 'center', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--color-gold)' }}>
                <Trophy size={20} />
                <h3 style={{ textTransform: 'uppercase', letterSpacing: '2px', margin: 0 }}>Historial de Copas</h3>
            </div>

            {history.length === 0 ? (
                <p style={{ color: '#888', fontStyle: 'italic' }}>Sin registros aún.</p>
            ) : (
                <div style={{ overflowY: 'auto', maxHeight: '350px', display: 'flex', flexDirection: 'column', gap: '1rem', paddingRight: '0.5rem' }}>
                    {history.map((record, idx) => (
                        <div key={idx} style={{
                            background: `linear-gradient(90deg, rgba(0,0,0,0) 0%, ${getHouseColor(record.winner)}22 100%)`,
                            padding: '1rem',
                            borderRadius: '8px',
                            border: `1px solid ${getHouseColor(record.winner)}`,
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <div style={{ width: '60px', height: '60px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <img
                                    src={getCupImage(record.winner)}
                                    alt={`Copa ${record.winner}`}
                                    style={{
                                        height: '100%',
                                        maxWidth: '100%',
                                        objectFit: 'contain',
                                        filter: `drop-shadow(0 0 5px ${getHouseColor(record.winner)})`
                                    }}
                                />
                            </div>

                            <div style={{ flex: 1, textAlign: 'left' }}>
                                <h4 style={{ margin: '0 0 0.2rem', color: 'var(--color-gold)' }}>Año {record.year}</h4>
                                <div style={{
                                    color: getHouseColor(record.winner),
                                    textTransform: 'uppercase',
                                    fontWeight: 'bold',
                                    fontSize: '1.2rem',
                                    textShadow: `0 0 5px ${getHouseColor(record.winner)}`
                                }}>
                                    {getHouseName(record.winner)}
                                </div>
                            </div>

                            <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                                <div>
                                    <span style={{ fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>{record.points}</span>
                                    <div style={{ fontSize: '0.8rem', color: '#aaa' }}>pts</div>
                                </div>
                                {isDirector && deleteHouseCupRecord && (
                                    <button
                                        onClick={() => deleteHouseCupRecord(idx)}
                                        style={{
                                            background: 'rgba(231,76,60,0.2)',
                                            border: '1px solid rgba(231,76,60,0.5)',
                                            color: '#e74c3c',
                                            borderRadius: '4px',
                                            padding: '0.25rem 0.5rem',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.3rem',
                                            fontSize: '0.75rem'
                                        }}
                                    >
                                        <Trash2 size={12} /> Eliminar
                                    </button>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Director: Add new record */}
            {isDirector && addHouseCupRecord && (
                <div style={{
                    marginTop: '1.5rem',
                    padding: '1rem',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '8px',
                    border: '1px dashed rgba(255,255,255,0.2)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.75rem'
                }}>
                    <h4 style={{ margin: 0, color: 'var(--color-gold)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                        Agregar Registro Manual
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem' }}>
                        <div>
                            <label style={{ fontSize: '0.75rem', color: '#aaa', display: 'block', marginBottom: '0.25rem' }}>Año</label>
                            <input
                                type="number"
                                value={newYear}
                                onChange={e => setNewYear(e.target.value)}
                                style={{ width: '100%', padding: '0.4rem', background: '#111', border: '1px solid #444', borderRadius: '4px', color: '#fff', fontSize: '0.9rem' }}
                            />
                        </div>
                        <div>
                            <label style={{ fontSize: '0.75rem', color: '#aaa', display: 'block', marginBottom: '0.25rem' }}>Casa</label>
                            <select
                                value={newWinner}
                                onChange={e => setNewWinner(e.target.value)}
                                style={{ width: '100%', padding: '0.4rem', background: '#111', border: '1px solid #444', borderRadius: '4px', color: '#fff', fontSize: '0.9rem' }}
                            >
                                <option value="phoenix">Fénix</option>
                                <option value="hipocampus">Hipocampo</option>
                                <option value="unicornius">Unicornio</option>
                                <option value="vipera">Víbora</option>
                            </select>
                        </div>
                        <div>
                            <label style={{ fontSize: '0.75rem', color: '#aaa', display: 'block', marginBottom: '0.25rem' }}>Puntos</label>
                            <input
                                type="number"
                                value={newPoints}
                                onChange={e => setNewPoints(e.target.value)}
                                style={{ width: '100%', padding: '0.4rem', background: '#111', border: '1px solid #444', borderRadius: '4px', color: '#fff', fontSize: '0.9rem' }}
                            />
                        </div>
                    </div>
                    <button
                        onClick={handleAddRecord}
                        style={{
                            background: 'linear-gradient(135deg, var(--color-gold), #b8860b)',
                            color: '#000',
                            border: 'none',
                            borderRadius: '6px',
                            padding: '0.5rem 1rem',
                            cursor: 'pointer',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            fontSize: '0.9rem'
                        }}
                    >
                        <PlusCircle size={16} /> Agregar al Historial
                    </button>
                </div>
            )}
        </div>
    );
};

export default HouseCupHistory;
