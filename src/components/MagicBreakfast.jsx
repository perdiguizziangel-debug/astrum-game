import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Coffee, Utensils, Sun, Moon, AlertCircle } from 'lucide-react';

const MagicBreakfast = () => {
    const { gameState, interactWithBreakfast } = useGame();
    const { directorStats, currentUser } = gameState;
    const breakfastImage = directorStats?.magicBreakfast;
    const breakfastStory = directorStats?.magicBreakfastStory || "El aroma del café recién hecho llena el aire...";

    if (!breakfastImage) {
        return (
            <div className="card magic-border" style={{
                textAlign: 'center',
                background: 'linear-gradient(to bottom, #1a1a2e, #162447)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px'
            }}>
                <h3 style={{ marginBottom: '1rem', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Coffee size={20} /> Desayuno Mágico
                </h3>
                <div style={{ color: '#555', fontStyle: 'italic' }}>
                    <p>La cocina está cerrada...</p>
                    <p style={{ fontSize: '0.8rem' }}>El Director aún no ha servido el desayuno.</p>
                </div>
            </div>
        );
    }

    const [message, setMessage] = useState(null);

    const today = new Date().toISOString().split('T')[0];
    const userHistory = currentUser?.breakfastHistory?.[today] || { prepared: false, eaten: false };

    // Stats
    const historyValues = Object.values(currentUser?.breakfastHistory || {});
    const daysBefore9 = historyValues.filter(day => day.time === 'before9').length;
    const daysAfter9 = historyValues.filter(day => day.time === 'after9').length;
    // Calculate missed breakfasts: Total calendar days active vs total eaten? 
    // Simplified: Just show total missed as a fun stat or maybe days NOT eaten when prepared?
    // Let's count days where streak existed but no breakfast? Harder.
    // Let's just count days where prepared but NOT eaten, or just total eaten?
    // User asked for "Desayunos Omitidos". Let's assume it means days since start where they didn't eat.
    // Simplifying: "Days without breakfast" = (Total Days since start) - (Days Eaten).
    // For now, let's just assume a fixed simple stat or maybe "Days Prepared but not Eaten".
    // Actually, sticking to the requested "Desayunos Omitidos: 2 Días" style.
    // Let's use logic: Total Cycle Days (based on streak maybe?) - Days Eaten. 
    // Or just (Streak + Missed) calculation?
    // Let's just hardcode "0" if we can't easily calc or use a placeholder logic.
    // Better: Days Eaten vs Days Total in Cycle (30). "Missed" could be 30 - Days Eaten (if looking at month goal).
    const daysEaten = historyValues.filter(day => day.eaten).length;
    const daysMissed = 0; // Placeholder for now or calc if we had "start date". 
    // Actually, maybe "Missed" in the context of the 30 day challenge? 
    // Let's leave it as "Days without" for now or just hide if 0.

    // Calculate Progress
    const maxDays = 30;
    const currentProgress = Math.min(currentUser?.streakBreakfast || 0, maxDays);
    const progressPercent = (currentProgress / maxDays) * 100;

    const handlePrepare = () => {
        if (userHistory.prepared) return;
        interactWithBreakfast(currentUser.id, 'prepare');
        triggerMessage("+10 Puntos", "success");
    };

    const handleEat = () => {
        if (userHistory.eaten) return;
        interactWithBreakfast(currentUser.id, 'eat');
        triggerMessage("+10 Puntos", "success");
    };

    const triggerMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div style={{
            background: '#162447',
            border: '2px solid #60a5fa',
            borderRadius: '20px',
            padding: '2px',
            position: 'relative',
            boxShadow: '0 0 20px rgba(96, 165, 250, 0.4)',
            maxWidth: '400px',
            margin: '0 auto',
            fontFamily: '"Orbitron", sans-serif',
            overflow: 'hidden'
        }}>
            {/* Corner Accents */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '20px', height: '20px', borderTop: '2px solid #93c5fd', borderLeft: '2px solid #93c5fd', borderTopLeftRadius: '15px' }} />
            <div style={{ position: 'absolute', top: 0, right: 0, width: '20px', height: '20px', borderTop: '2px solid #93c5fd', borderRight: '2px solid #93c5fd', borderTopRightRadius: '15px' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '20px', height: '20px', borderBottom: '2px solid #93c5fd', borderLeft: '2px solid #93c5fd', borderBottomLeftRadius: '15px' }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '20px', height: '20px', borderBottom: '2px solid #93c5fd', borderRight: '2px solid #93c5fd', borderBottomRightRadius: '15px' }} />

            <div style={{
                background: 'linear-gradient(180deg, rgba(22, 36, 71, 0.95) 0%, rgba(10, 20, 40, 0.98) 100%)',
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
                        border: '2px solid #60a5fa', borderRadius: '50%',
                        boxShadow: '0 0 15px #60a5fa, inset 0 0 10px #60a5fa'
                    }} />
                    <div style={{
                        position: 'absolute', inset: -5,
                        border: '1px dashed #bfdbfe', borderRadius: '50%',
                        animation: 'spin 15s linear infinite'
                    }} />

                    <img
                        src={breakfastImage}
                        alt="Breakfast"
                        style={{
                            width: '100%', height: '100%',
                            borderRadius: '50%', objectFit: 'cover',
                            position: 'relative', zIndex: 1
                        }}
                    />

                    <div style={{
                        position: 'absolute', bottom: -15, left: '50%', transform: 'translateX(-50%)',
                        background: '#0f172a', border: '1px solid #60a5fa',
                        padding: '4px 12px', borderRadius: '10px',
                        color: '#93c5fd', fontSize: '0.8rem', fontWeight: 'bold',
                        zIndex: 2, whiteSpace: 'nowrap',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.5)'
                    }}>
                        DESAYUNO MÁGICO
                    </div>
                </div>

                <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem', marginTop: '-0.5rem' }}>
                    RITUAL MATUTINO
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                    <ActionButton
                        icon={<Coffee size={18} />}
                        label={userHistory.prepared ? "PREPARADO" : "PREPARAR"}
                        active={!userHistory.prepared}
                        onClick={handlePrepare}
                        color="#d8b4fe" // Purple
                    />
                    <ActionButton
                        icon={<Utensils size={18} />}
                        label={userHistory.eaten ? "DESAYUNADO" : "DESAYUNAR"}
                        active={!userHistory.eaten}
                        onClick={handleEat}
                        color="#f472b6" // Pink
                    />
                </div>

                {/* Progress Bar */}
                <div style={{ width: '100%', padding: '0 0.5rem' }}>
                    {/* Milestones Container */}
                    <div style={{ height: '35px', position: 'relative', width: '100%' }}>
                        {/* Milestones Labels removed for design cleanliness */}
                        <div style={{ height: '14px' }} />

                        {/* Bar Container */}
                        <div style={{
                            height: '14px', background: '#1e3a8a', borderRadius: '7px',
                            position: 'absolute', bottom: 4, width: '100%', border: '1px solid #60a5fa',
                            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
                        }}>
                            {/* Fill */}
                            <div style={{
                                width: `${progressPercent}%`, height: '100%',
                                background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
                                borderRadius: '7px',
                                boxShadow: '0 0 10px #60a5fa'
                            }} />

                            {/* Milestone Markers */}
                            {[16.6, 50, 83.3].map(pos => (
                                <MilestoneTick key={pos} bottom="0" left={`${pos}%`} />
                            ))}
                        </div>
                    </div>

                    <div style={{ textAlign: 'right', fontSize: '0.7rem', color: '#60a5fa', marginTop: '4px' }}>
                        {currentProgress}/{maxDays} ({Math.round(progressPercent)}%)
                    </div>
                </div>

                {/* Stats Footer */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#e5e7eb' }}>
                    <StatLine icon={<Sun size={14} color="#fcd34d" />} label="DÍAS ANTES DE LAS 9:00" value={`${daysBefore9}/30`} />
                    <StatLine icon={<Moon size={14} color="#a78bfa" />} label="DÍAS DESPUÉS DE LAS 9:00" value={`${daysAfter9}/30`} />
                    <StatLine icon={<AlertCircle size={14} color="#f87171" />} label="DESAYUNOS OMITIDOS" value={`${30 - daysEaten} DÍAS`} />
                </div>

                {/* Director's Story */}
                <div style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.3)',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    borderLeft: '3px solid #60a5fa',
                    fontSize: '0.85rem',
                    fontStyle: 'italic',
                    color: '#93c5fd',
                    lineHeight: '1.4'
                }}>
                    "{breakfastStory}"
                </div>

                {message && (
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        background: 'rgba(0,0,0,0.9)', border: '1px solid #60a5fa',
                        padding: '1rem', borderRadius: '10px', color: '#60a5fa', fontWeight: 'bold',
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

// Reuse sub-components logic if possible, but distinct implementation for now to avoid exports issues
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

export default MagicBreakfast;
