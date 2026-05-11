import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Droplets, Sun, Sprout } from 'lucide-react';

const PlantInteraction = () => {
    const { gameState, interactWithPlant } = useGame();
    const { directorStats, currentUser } = gameState;
    const plantImage = directorStats?.plant;

    if (!plantImage) {
        return (
            <div className="card magic-border" style={{
                textAlign: 'center',
                background: 'linear-gradient(to bottom, #0d2818, #0a1a0f)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px'
            }}>
                <h3 style={{ marginBottom: '1rem', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Sprout size={20} /> Planta del Mes
                </h3>
                <div style={{ color: '#555', fontStyle: 'italic' }}>
                    <p>El invernadero está vacío...</p>
                    <p style={{ fontSize: '0.8rem' }}>El Director aún no ha traído la planta de este mes.</p>
                </div>
            </div>
        );
    }

    const [message, setMessage] = useState(null);

    const today = new Date().toISOString().split('T')[0];
    const userHistory = currentUser?.plantHistory?.[today] || { watered: false, illuminated: false };

    // Calculate Stats
    const historyValues = Object.values(currentUser?.plantHistory || {});
    const daysWatered = historyValues.filter(day => day.watered).length;
    const daysIlluminated = historyValues.filter(day => day.illuminated).length;

    // Calculate Progress
    const maxDays = 30;
    const currentProgress = Math.min(currentUser?.streakPlant || 0, maxDays);
    const progressPercent = (currentProgress / maxDays) * 100;

    const handleWater = () => {
        if (userHistory.watered) return;
        interactWithPlant(currentUser.id, 'water');
        triggerMessage("+10 Puntos", "success");
    };

    const handleIlluminate = () => {
        if (userHistory.illuminated) return;
        interactWithPlant(currentUser.id, 'illuminate');
        triggerMessage("+10 Puntos", "success");
    };

    const triggerMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div style={{
            background: '#051b11', // Darker green/black bg
            border: '2px solid #4ade80',
            borderRadius: '20px',
            padding: '2px',
            position: 'relative',
            boxShadow: '0 0 20px rgba(74, 222, 128, 0.3)',
            maxWidth: '400px',
            margin: '0 auto',
            fontFamily: '"Orbitron", sans-serif',
            overflow: 'hidden'
        }}>
            {/* Corner Accents */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '20px', height: '20px', borderTop: '2px solid #86efac', borderLeft: '2px solid #86efac', borderTopLeftRadius: '15px' }} />
            <div style={{ position: 'absolute', top: 0, right: 0, width: '20px', height: '20px', borderTop: '2px solid #86efac', borderRight: '2px solid #86efac', borderTopRightRadius: '15px' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '20px', height: '20px', borderBottom: '2px solid #86efac', borderLeft: '2px solid #86efac', borderBottomLeftRadius: '15px' }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '20px', height: '20px', borderBottom: '2px solid #86efac', borderRight: '2px solid #86efac', borderBottomRightRadius: '15px' }} />

            <div style={{
                background: 'linear-gradient(180deg, rgba(5, 20, 10, 0.95) 0%, rgba(2, 10, 5, 0.98) 100%)',
                borderRadius: '18px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem'
            }}>
                {/* Header / Avatar Frame */}
                <div style={{ position: 'relative', width: '160px', height: '160px' }}>
                    {/* Hexagon/Circle Tech Frame */}
                    <div style={{
                        position: 'absolute', inset: -10,
                        border: '2px solid #4ade80', borderRadius: '50%',
                        boxShadow: '0 0 15px #4ade80, inset 0 0 10px #4ade80'
                    }} />
                    <div style={{
                        position: 'absolute', inset: -5,
                        border: '1px dashed #bbf7d0', borderRadius: '50%',
                        animation: 'spin 12s linear infinite reverse'
                    }} />

                    <img
                        src={plantImage}
                        alt="Plant"
                        style={{
                            width: '100%', height: '100%',
                            borderRadius: '50%', objectFit: 'cover',
                            position: 'relative', zIndex: 1
                        }}
                    />

                    {/* Title Badge */}
                    <div style={{
                        position: 'absolute', bottom: -15, left: '50%', transform: 'translateX(-50%)',
                        background: '#021005', border: '1px solid #4ade80',
                        padding: '4px 12px', borderRadius: '10px',
                        color: '#86efac', fontSize: '0.8rem', fontWeight: 'bold',
                        zIndex: 2, whiteSpace: 'nowrap',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.5)'
                    }}>
                        PLANTA: {directorStats.plantName || "MISTERIOSA"}
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                    <ActionButton
                        icon={<Droplets size={18} />}
                        label={userHistory.watered ? "REGADO" : "REGAR"}
                        active={!userHistory.watered}
                        onClick={handleWater}
                        color="#60a5fa" // Blue for water
                    />
                    <ActionButton
                        icon={<Sun size={18} />}
                        label={userHistory.illuminated ? "ILUMINADO" : "ILUMINAR"}
                        active={!userHistory.illuminated}
                        onClick={handleIlluminate}
                        color="#fbbf24" // Yellow for sun
                    />
                </div>

                {/* Progress Bar System */}
                <div style={{ width: '100%', padding: '0 0.5rem' }}>
                    {/* Milestones Container */}
                    <div style={{ height: '35px', position: 'relative', width: '100%' }}>
                        {/* Milestones Labels removed for design cleanliness */}
                        <div style={{ height: '14px' }} />

                        {/* Bar Container */}
                        <div style={{
                            height: '14px', background: '#0f291e', borderRadius: '7px',
                            position: 'absolute', bottom: 4, width: '100%', border: '1px solid #4ade80',
                            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
                        }}>
                            {/* Fill */}
                            <div style={{
                                width: `${progressPercent}%`, height: '100%',
                                background: 'linear-gradient(90deg, #10b981, #34d399)',
                                borderRadius: '7px',
                                boxShadow: '0 0 10px #34d399'
                            }} />

                            {/* Milestone Markers */}
                            {[16.6, 50, 83.3].map(pos => (
                                <MilestoneTick key={pos} bottom="0" left={`${pos}%`} />
                            ))}
                        </div>
                    </div>

                    <div style={{ textAlign: 'right', fontSize: '0.7rem', color: '#4ade80', marginTop: '4px' }}>
                        {currentProgress}/{maxDays} ({Math.round(progressPercent)}%)
                    </div>
                </div>

                {/* Stats Footer */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#e5e7eb' }}>
                    <StatLine icon={<Droplets size={14} color="#60a5fa" />} label="DÍAS REGADO" value={`${daysWatered}/30`} />
                    <StatLine icon={<Sun size={14} color="#fbbf24" />} label="DÍAS ILUMINADA" value={`${daysIlluminated}/30`} />
                </div>

                {/* Director Story */}
                <div style={{
                    marginTop: '0.5rem',
                    padding: '0.8rem',
                    background: 'rgba(0,0,0,0.4)',
                    borderLeft: '2px solid #4ade80',
                    color: '#9ca3af',
                    fontSize: '0.8rem',
                    fontStyle: 'italic',
                    width: '100%'
                }}>
                    "{directorStats.plantStory || '...'}"
                </div>

                {message && (
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        background: 'rgba(0,0,0,0.9)', border: '1px solid #4ade80',
                        padding: '1rem', borderRadius: '10px', color: '#4ade80', fontWeight: 'bold',
                        animation: 'fadeIn 0.3s'
                    }}>
                        {message.text}
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

// Sub-components
const ActionButton = ({ icon, label, active, onClick, color }) => (
    <button
        onClick={onClick}
        disabled={!active}
        style={{
            flex: 1,
            background: active ? `rgba(${hexToRgb(color)}, 0.1)` : 'transparent',
            border: `1px solid ${active ? color : '#4b5563'}`,
            color: active ? '#fff' : '#6b7280',
            padding: '0.8rem',
            borderRadius: '8px',
            cursor: active ? 'pointer' : 'default',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            fontWeight: 'bold', fontSize: '0.9rem',
            boxShadow: active ? `0 0 10px ${color}` : 'none',
            transition: 'all 0.3s ease'
        }}
    >
        {icon} {label}
    </button>
);

const MilestoneTick = ({ bottom, left }) => (
    <div style={{
        position: 'absolute', bottom: bottom, left: left,
        width: '2px', height: '100%',
        background: 'rgba(255,255,255,0.3)',
        zIndex: 2
    }} />
);

const StatLine = ({ icon, label, value }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #374151', paddingBottom: '4px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {icon} <span style={{ opacity: 0.8 }}>{label}:</span>
        </div>
        <span style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{value}</span>
    </div>
);

// Helper
function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
}

export default PlantInteraction;
