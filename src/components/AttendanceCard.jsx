import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { UserCheck, CheckCircle, CalendarCheck, ShieldAlert } from 'lucide-react';

const AttendanceCard = () => {
    const { gameState, recordAttendance } = useGame();
    const { currentUser } = gameState;
    const [message, setMessage] = useState(null);

    if (!currentUser) return null;

    const today = new Date().toISOString().split('T')[0];
    const hasAttended = currentUser.lastAttendanceDate === today;

    // Using calculateMilestone from context logic conceptually
    const calculateMilestone = (streak) => {
        if (streak >= 50) return 50;
        if (streak >= 40) return 40;
        if (streak >= 30) return 30;
        if (streak >= 20) return 20;
        if (streak >= 10) return 10;
        return 0;
    };

    const currentStreak = currentUser.streakAttendance || 0;
    const lastMilestone = calculateMilestone(currentStreak);
    const nextMilestone = lastMilestone + 10; // Milestones are roughly every 10 steps
    const maxProgressDays = nextMilestone;
    // Calculate progress relatively against next milestone for UI purposes
    const progressPercent = Math.min((currentStreak / maxProgressDays) * 100, 100);

    const handleAttendance = () => {
        if (hasAttended) return;
        recordAttendance(currentUser.id);
        triggerMessage("+50 XP | +50 Puntos", "success");
    };

    const triggerMessage = (text, type) => {
        setMessage({ text, type });
        setTimeout(() => setMessage(null), 3000);
    };

    return (
        <div style={{
            background: '#1a1a2e',
            border: '2px solid #a855f7',
            borderRadius: '20px',
            padding: '2px', // Inner border spacing
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
                background: 'linear-gradient(180deg, rgba(20, 10, 40, 0.95) 0%, rgba(10, 5, 20, 0.98) 100%)',
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
                        border: '2px solid #c084fc', borderRadius: '50%',
                        boxShadow: '0 0 15px #c084fc, inset 0 0 10px #c084fc'
                    }} />
                    <div style={{
                        position: 'absolute', inset: -5,
                        border: '1px dashed #e9d5ff', borderRadius: '50%',
                        animation: 'spin 10s linear infinite'
                    }} />

                    {/* Content inside the Avatar Frame */}
                    <div style={{
                        width: '100%', height: '100%',
                        borderRadius: '50%',
                        background: '#1f1f3a',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        position: 'relative',
                        zIndex: 1
                    }}>
                        {hasAttended ? (
                            <CheckCircle size={80} color="#4ade80" />
                        ) : (
                            <CalendarCheck size={80} color="#c084fc" />
                        )}
                    </div>

                    {/* Title Badge overlapping bottom */}
                    <div style={{
                        position: 'absolute', bottom: -15, left: '50%', transform: 'translateX(-50%)',
                        background: '#0f0720', border: '1px solid #c084fc',
                        padding: '4px 12px', borderRadius: '10px',
                        color: '#d8b4fe', fontSize: '0.8rem', fontWeight: 'bold',
                        zIndex: 2, whiteSpace: 'nowrap',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.5)'
                    }}>
                        ASISTENCIA
                    </div>
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '1rem', width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
                    <ActionButton
                        icon={hasAttended ? <CheckCircle size={18} /> : <UserCheck size={18} />}
                        label={hasAttended ? "PRESENTE" : "DAR EL PRESENTE"}
                        active={!hasAttended}
                        onClick={handleAttendance}
                        color={hasAttended ? "#4ade80" : "#d8b4fe"}
                    />
                </div>

                {/* Progress Bar System */}
                <div style={{ width: '100%', padding: '0 0.5rem' }}>
                    <div style={{ height: '14px' }} />

                    {/* Bar Container */}
                    <div style={{
                        height: '14px', background: '#1f1f3a', borderRadius: '7px',
                        position: 'relative', border: '1px solid #4ade80',
                        boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
                    }}>
                        {/* Fill */}
                        <div style={{
                            width: `${progressPercent}%`, height: '100%',
                            background: 'linear-gradient(90deg, #22c55e, #4ade80)',
                            borderRadius: '7px',
                            boxShadow: '0 0 10px #4ade80',
                            transition: 'width 0.5s ease-out'
                        }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#4ade80', marginTop: '4px' }}>
                        <span>Nivel Activo</span>
                        <span>{currentStreak} / {maxProgressDays} ({Math.round(progressPercent)}%)</span>
                    </div>
                </div>

                {/* Stats Footer */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem', color: '#e5e7eb' }}>
                    <StatLine icon={<CalendarCheck size={14} color="#c084fc" />} label="Días Asistidos (Total)" value={currentUser.totalAttendance || 0} />
                    <StatLine icon={<ShieldAlert size={14} color="#f472b6" />} label="Racha Actual" value={`${currentStreak} días`} />
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
                @keyframes fadeIn {
                    from { opacity: 0; transform: translate(-50%, -40%); }
                    to { opacity: 1; transform: translate(-50%, -50%); }
                }
            `}</style>
        </div>
    );
};

// Sub-components for cleaner code
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

export default AttendanceCard;
