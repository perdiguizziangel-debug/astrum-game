import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Palette, Music, XCircle, Sparkles } from 'lucide-react';

const ArtisticMoment = () => {
    const { gameState, interactWithArt } = useGame();
    const { directorStats, currentUser } = gameState;
    const artImage = directorStats?.artisticMoment;
    const artStory = directorStats?.artisticMomentStory || "La inspiración llega en formas inesperadas hoy...";

    if (!artImage) {
        return (
            <div className="card magic-border" style={{
                textAlign: 'center',
                background: 'linear-gradient(to bottom, #300a24, #1a0513)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px'
            }}>
                <h3 style={{ marginBottom: '1rem', color: '#f472b6', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Palette size={20} /> Momento Artístico
                </h3>
                <div style={{ color: '#aaa', fontStyle: 'italic' }}>
                    <p>El estudio está vacío...</p>
                    <p style={{ fontSize: '0.8rem' }}>El Director aún no ha traído inspiración.</p>
                </div>
            </div>
        );
    }

    const [message, setMessage] = useState(null);

    const today = new Date().toISOString().split('T')[0];
    const userHistory = currentUser?.artHistory?.[today] || { paint: false, music: false };

    // Stats
    const historyValues = Object.values(currentUser?.artHistory || {});
    // Assuming "Days of Art" means days where at least one art action was done? Or count distinct actions? The prompt image shows "Dias de arte: 20/30". 
    // And "Dias sin arte: 10 Dias".
    // I'll count days where ANY interaction happened as "Days of Art".
    // Or, prompt shows individual stats but sums them up?
    // Let's count days active in this category.
    const daysArt = historyValues.filter(day => day.paint || day.music).length;

    // Calculate Progress
    const maxDays = 30;
    const currentProgress = Math.min(currentUser?.streakArt || 0, maxDays);
    const progressPercent = (currentProgress / maxDays) * 100;

    const handlePaint = () => {
        if (userHistory.paint) return;
        interactWithArt(currentUser.id, 'paint');
        triggerMessage("+10 Puntos", "success");
    };

    const handleMusic = () => {
        if (userHistory.music) return;
        interactWithArt(currentUser.id, 'music');
        triggerMessage("+10 Puntos", "success");
    };

    const triggerMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div style={{
            background: '#1a0513',
            border: '2px solid #f472b6',
            borderRadius: '20px',
            padding: '2px',
            position: 'relative',
            boxShadow: '0 0 20px rgba(244, 114, 182, 0.4)',
            maxWidth: '400px',
            margin: '0 auto',
            fontFamily: '"Orbitron", sans-serif',
            overflow: 'hidden'
        }}>
            {/* Corner Accents */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '20px', height: '20px', borderTop: '2px solid #fbcfe8', borderLeft: '2px solid #fbcfe8', borderTopLeftRadius: '15px' }} />
            <div style={{ position: 'absolute', top: 0, right: 0, width: '20px', height: '20px', borderTop: '2px solid #fbcfe8', borderRight: '2px solid #fbcfe8', borderTopRightRadius: '15px' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '20px', height: '20px', borderBottom: '2px solid #fbcfe8', borderLeft: '2px solid #fbcfe8', borderBottomLeftRadius: '15px' }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '20px', height: '20px', borderBottom: '2px solid #fbcfe8', borderRight: '2px solid #fbcfe8', borderBottomRightRadius: '15px' }} />

            <div style={{
                background: 'linear-gradient(180deg, rgba(60, 10, 40, 0.95) 0%, rgba(30, 5, 20, 0.98) 100%)',
                borderRadius: '18px',
                padding: '1.5rem',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '1.5rem'
            }}>
                {/* Header */}
                <div style={{ position: 'relative', width: '160px', height: '160px' }}>
                    {/* Tech Frame */}
                    <div style={{
                        position: 'absolute', inset: -10,
                        border: '2px solid #f472b6', borderRadius: '50%',
                        boxShadow: '0 0 15px #f472b6, inset 0 0 10px #f472b6'
                    }} />
                    <div style={{
                        position: 'absolute', inset: -5,
                        border: '1px dashed #fbcfe8', borderRadius: '50%',
                        animation: 'spin 20s linear infinite'
                    }} />

                    <img
                        src={artImage}
                        alt="Art"
                        style={{
                            width: '100%', height: '100%',
                            borderRadius: '50%', objectFit: 'cover',
                            position: 'relative', zIndex: 1
                        }}
                    />

                    <div style={{
                        position: 'absolute', bottom: -15, left: '50%', transform: 'translateX(-50%)',
                        background: '#300a24', border: '1px solid #f472b6',
                        padding: '4px 12px', borderRadius: '10px',
                        color: '#fbcfe8', fontSize: '0.8rem', fontWeight: 'bold',
                        zIndex: 2, whiteSpace: 'nowrap',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.5)'
                    }}>
                        MOMENTO ARTÍSTICO
                    </div>
                </div>

                <div style={{ textAlign: 'center', color: '#fda4af', fontSize: '0.9rem', marginTop: '-0.5rem' }}>
                    EXPRESIÓN CREATIVA
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                    <ActionButton
                        icon={<Palette size={18} />}
                        label={userHistory.paint ? "PINTURA" : "PINTAR"}
                        active={!userHistory.paint}
                        onClick={handlePaint}
                        color="#f472b6" // Pink
                    />
                    <ActionButton
                        icon={<Music size={18} />}
                        label={userHistory.music ? "MÚSICA" : "TOCAR"}
                        active={!userHistory.music}
                        onClick={handleMusic}
                        color="#a78bfa" // Purple
                    />
                </div>

                {/* Progress Bar */}
                <div style={{ width: '100%', padding: '0 0.5rem' }}>
                    <div style={{ height: '35px', position: 'relative', width: '100%' }}>
                        {/* Milestones Labels removed for design cleanliness */}
                        <div style={{ height: '14px' }} />

                        {/* Bar Container */}
                        <div style={{
                            height: '14px', background: '#500724', borderRadius: '7px',
                            position: 'absolute', bottom: 4, width: '100%', border: '1px solid #f472b6',
                            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
                        }}>
                            <div style={{
                                width: `${progressPercent}%`, height: '100%',
                                background: 'linear-gradient(90deg, #ec4899, #f472b6)',
                                borderRadius: '7px',
                                boxShadow: '0 0 10px #f472b6'
                            }} />

                            {/* Milestone Markers */}
                            {[16.6, 50, 83.3].map(pos => (
                                <MilestoneTick key={pos} bottom="0" left={`${pos}%`} />
                            ))}
                        </div>
                    </div>

                    <div style={{ textAlign: 'right', fontSize: '0.7rem', color: '#f472b6', marginTop: '4px' }}>
                        {currentProgress}/{maxDays} ({Math.round(progressPercent)}%)
                    </div>
                </div>

                {/* Stats Footer */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#e5e7eb' }}>
                    <StatLine icon={<Sparkles size={14} color="#f472b6" />} label="DÍAS DE ARTE" value={`${daysArt}/30`} />
                    <StatLine icon={<XCircle size={14} color="#9ca3af" />} label="DÍAS SIN ARTE" value={`${30 - daysArt} DÍAS`} />
                </div>

                {/* Director's Story */}
                <div style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.3)',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    borderLeft: '3px solid #f472b6',
                    fontSize: '0.85rem',
                    fontStyle: 'italic',
                    color: '#fbcfe8',
                    lineHeight: '1.4'
                }}>
                    "{artStory}"
                </div>

                {message && (
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        background: 'rgba(0,0,0,0.9)', border: '1px solid #f472b6',
                        padding: '1rem', borderRadius: '10px', color: '#f472b6', fontWeight: 'bold',
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

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
}

export default ArtisticMoment;
