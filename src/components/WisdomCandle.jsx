import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Flame, Eye, Wind, Zap } from 'lucide-react';

const WisdomCandle = () => {
    const { gameState, interactWithCandle } = useGame();
    const { directorStats, currentUser } = gameState;
    const candleImage = directorStats?.wisdomCandle;
    const candleStory = directorStats?.wisdomCandleStory || "La llama sagrada ilumina el camino del conocimiento...";

    if (!candleImage) {
        return (
            <div className="card magic-border" style={{
                textAlign: 'center',
                background: 'linear-gradient(to bottom, #2e1065, #0f0720)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px'
            }}>
                <h3 style={{ marginBottom: '1rem', color: '#c084fc', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <Flame size={20} /> Vela de Sabiduría
                </h3>
                <div style={{ color: '#aaa', fontStyle: 'italic' }}>
                    <p>La sala está a oscuras...</p>
                    <p style={{ fontSize: '0.8rem' }}>El Director aún no ha colocado la vela sagrada.</p>
                </div>
            </div>
        );
    }

    const [message, setMessage] = useState(null);
    const [pressProgress, setPressProgress] = useState(0);
    const pressInterval = React.useRef(null);

    const today = new Date().toISOString().split('T')[0];
    const userHistory = currentUser?.candleHistory?.[today] || { lit: false, focused: false };

    // Stats
    const historyValues = Object.values(currentUser?.candleHistory || {});
    const daysLit = historyValues.filter(day => day.lit).length;
    const daysFocused = historyValues.filter(day => day.focused).length;
    const totalUses = historyValues.length; // Approximate total interactions

    // Calculate Progress
    const maxDays = 30;
    const currentProgress = Math.min(currentUser?.streakCandle || 0, maxDays);
    const progressPercent = (currentProgress / maxDays) * 100;

    const handleLight = () => {
        if (userHistory.lit) return;
        interactWithCandle(currentUser.id, 'light');
        triggerMessage("+10 Puntos", "success");
    };

    const handleFocus = () => {
        if (userHistory.focused) return;
        interactWithCandle(currentUser.id, 'focus');
        triggerMessage("+10 Puntos", "success");
    };

    const startPress = () => {
        if (userHistory.focused || userHistory.lit === false) {
            if (userHistory.lit === false) triggerMessage("Enciende la vela primero", "error");
            return;
        }

        setPressProgress(0);
        pressInterval.current = setInterval(() => {
            setPressProgress(prev => {
                const next = prev + 4; // Approx 2.5 seconds to fill
                if (next >= 100) {
                    clearInterval(pressInterval.current);
                    handleFocus();
                    return 100;
                }
                return next;
            });
        }, 100);
    };

    const stopPress = () => {
        if (pressInterval.current) {
            clearInterval(pressInterval.current);
            if (pressProgress < 100) setPressProgress(0);
        }
    };

    const triggerMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div style={{
            background: '#0f0720',
            border: '2px solid #a855f7',
            borderRadius: '20px',
            padding: '2px',
            position: 'relative',
            boxShadow: '0 0 20px rgba(168, 85, 247, 0.4)',
            maxWidth: '400px',
            margin: '0 auto',
            fontFamily: '"Orbitron", sans-serif',
            overflow: 'hidden'
        }}>
            {/* Corner Accents */}
            <div style={{ position: 'absolute', top: 0, left: 0, width: '20px', height: '20px', borderTop: '2px solid #d8b4fe', borderLeft: '2px solid #d8b4fe', borderTopLeftRadius: '15px' }} />
            <div style={{ position: 'absolute', top: 0, right: 0, width: '20px', height: '20px', borderTop: '2px solid #d8b4fe', borderRight: '2px solid #d8b4fe', borderTopRightRadius: '15px' }} />
            <div style={{ position: 'absolute', bottom: 0, left: 0, width: '20px', height: '20px', borderBottom: '2px solid #d8b4fe', borderLeft: '2px solid #d8b4fe', borderBottomLeftRadius: '15px' }} />
            <div style={{ position: 'absolute', bottom: 0, right: 0, width: '20px', height: '20px', borderBottom: '2px solid #d8b4fe', borderRight: '2px solid #d8b4fe', borderBottomRightRadius: '15px' }} />

            <div style={{
                background: 'linear-gradient(180deg, rgba(20, 10, 50, 0.95) 0%, rgba(10, 5, 25, 0.98) 100%)',
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
                        border: '2px solid #a855f7', borderRadius: '50%',
                        boxShadow: '0 0 15px #a855f7, inset 0 0 10px #a855f7'
                    }} />
                    <div style={{
                        position: 'absolute', inset: -5,
                        border: '1px dashed #e9d5ff', borderRadius: '50%',
                        animation: 'pulse 3s ease-in-out infinite'
                    }} />

                    <img
                        src={candleImage}
                        alt="Candle"
                        style={{
                            width: '100%', height: '100%',
                            borderRadius: '50%', objectFit: 'cover',
                            position: 'relative', zIndex: 1
                        }}
                    />

                    <div style={{
                        position: 'absolute', bottom: -15, left: '50%', transform: 'translateX(-50%)',
                        background: '#1e1b4b', border: '1px solid #a855f7',
                        padding: '4px 12px', borderRadius: '10px',
                        color: '#d8b4fe', fontSize: '0.8rem', fontWeight: 'bold',
                        zIndex: 2, whiteSpace: 'nowrap',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.5)'
                    }}>
                        VELA DE SABIDURÍA
                    </div>
                </div>

                <div style={{ textAlign: 'center', color: '#a78bfa', fontSize: '0.9rem', marginTop: '-0.5rem' }}>
                    ARTEFACTO DE ESTUDIO
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
                    <ActionButton
                        icon={<Flame size={18} />}
                        label={userHistory.lit ? "ENCENDIDA" : "ENCENDER"}
                        active={!userHistory.lit}
                        onClick={handleLight}
                        color="#a855f7" // Purple
                    />
                    <ActionButton
                        icon={<Eye size={18} />}
                        label={userHistory.focused ? "CONCENTRADO" : "CONCENTRAR"}
                        active={!userHistory.focused}
                        onMouseDown={startPress}
                        onMouseUp={stopPress}
                        onMouseLeave={stopPress}
                        onTouchStart={startPress}
                        onTouchEnd={stopPress}
                        color="#60a5fa" // Blue
                        progress={pressProgress}
                    />
                </div>

                {/* Progress Bar */}
                <div style={{ width: '100%', padding: '0 0.5rem' }}>
                    <div style={{ height: '35px', position: 'relative', width: '100%' }}>
                        {/* Milestones Labels removed for design cleanliness */}
                        <div style={{ height: '14px' }} />

                        {/* Bar Container */}
                        <div style={{
                            height: '14px', background: '#3b0764', borderRadius: '7px',
                            position: 'absolute', bottom: 4, width: '100%', border: '1px solid #a855f7',
                            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
                        }}>
                            <div style={{
                                width: `${progressPercent}%`, height: '100%',
                                background: 'linear-gradient(90deg, #9333ea, #c084fc)',
                                borderRadius: '7px',
                                boxShadow: '0 0 10px #c084fc'
                            }} />

                            {/* Milestone Markers */}
                            {[16.6, 50, 83.3].map(pos => (
                                <MilestoneTick key={pos} bottom="0" left={`${pos}%`} />
                            ))}
                        </div>
                    </div>

                    <div style={{ textAlign: 'right', fontSize: '0.7rem', color: '#a855f7', marginTop: '4px' }}>
                        {currentProgress}/{maxDays} ({Math.round(progressPercent)}%)
                    </div>
                </div>

                {/* Stats Footer */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#e5e7eb' }}>
                    <StatLine icon={<Flame size={14} color="#a855f7" />} label="DÍAS ENCENDIDA" value={`${daysLit}/30`} />
                    <StatLine icon={<Eye size={14} color="#60a5fa" />} label="DÍAS CONCENTRADO" value={`${daysFocused}/30`} />
                    <StatLine icon={<Zap size={14} color="#fbbf24" />} label="USOS TOTALES" value={`${totalUses} VECES`} />
                    <StatLine icon={<Wind size={14} color="#94a3b8" />} label="DÍAS OSCURIDAD" value={`${30 - daysLit} DÍAS`} />
                </div>

                {/* Director's Story */}
                <div style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.3)',
                    padding: '0.8rem',
                    borderRadius: '8px',
                    borderLeft: '3px solid #a855f7',
                    fontSize: '0.85rem',
                    fontStyle: 'italic',
                    color: '#d8b4fe',
                    lineHeight: '1.4'
                }}>
                    "{candleStory}"
                </div>

                {message && (
                    <div style={{
                        position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
                        background: 'rgba(0,0,0,0.9)', border: '1px solid #a855f7',
                        padding: '1rem', borderRadius: '10px', color: '#a855f7', fontWeight: 'bold',
                        animation: 'fadeIn 0.3s'
                    }}>
                        {message.text}
                    </div>
                )}

                {pressProgress > 0 && pressProgress < 100 && (
                    <div style={{
                        position: 'absolute',
                        bottom: '20px',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        color: '#60a5fa',
                        fontSize: '0.7rem',
                        fontWeight: 'bold',
                        textAlign: 'center'
                    }}>
                        MANTÉN PARA CONCENTRAR...
                    </div>
                )}
            </div>

            <style>{`
                @keyframes pulse { 0% { opacity: 0.6; } 50% { opacity: 1; } 100% { opacity: 0.6; } }
            `}</style>
        </div>
    );
};

// Sub-components
const ActionButton = ({ icon, label, active, onClick, onMouseDown, onMouseUp, onMouseLeave, onTouchStart, onTouchEnd, color, progress }) => (
    <button
        onClick={onClick}
        onMouseDown={onMouseDown}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseLeave}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
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
            transition: 'all 0.3s ease',
            position: 'relative',
            overflow: 'hidden'
        }}
    >
        {/* Progress Fill (only for concentrate) */}
        {progress > 0 && (
            <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                height: '4px',
                width: `${progress}%`,
                background: color,
                transition: 'width 0.1s linear'
            }} />
        )}
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

export default WisdomCandle;
