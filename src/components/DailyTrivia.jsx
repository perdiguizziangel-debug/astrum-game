import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';
import { HelpCircle, CheckCircle, XCircle, Coins, Sparkles } from 'lucide-react';

const DailyTrivia = () => {
    const { gameState, submitTriviaAnswer } = useGame();
    const { dailyTrivia, currentUser } = gameState;
    const [revealed, setRevealed] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    // Reset state when trivia changes
    useEffect(() => {
        setRevealed(false);
        setSelectedOption(null);
    }, [dailyTrivia?.question, dailyTrivia?.id]);

    if (!dailyTrivia || !currentUser) return null;

    const alreadySolved = dailyTrivia.solvedBy?.includes(currentUser.id);
    const isCorrect = selectedOption === dailyTrivia.correctAnswer;
    const totalSolved = currentUser.triviaSolved || 0;
    const progressPercent = Math.min((totalSolved / 50) * 100, 100);

    const handleSelect = (idx) => {
        if (revealed || alreadySolved) return;
        setSelectedOption(idx);
    };

    const handleSubmit = () => {
        if (selectedOption === null || revealed || alreadySolved) return;
        submitTriviaAnswer(currentUser.id, selectedOption);
        setRevealed(true);
    };

    const milestones = [10, 20, 30, 40];
    const nextMilestone = milestones.find(m => m > totalSolved) || 50;
    const daysToNext = nextMilestone - totalSolved;

    const getOptionStyle = (idx) => {
        const isSelected = selectedOption === idx;
        const isCorrectFinal = idx === dailyTrivia.correctAnswer;
        const isWrongFinal = isSelected && !isCorrectFinal;

        let borderColor = 'rgba(0, 242, 254, 0.3)';
        let background = 'rgba(0, 0, 0, 0.4)';
        let color = '#ccc';
        let boxShadow = 'none';

        if (revealed || alreadySolved) {
            if (isCorrectFinal) {
                borderColor = '#00f2fe';
                background = 'rgba(0, 242, 254, 0.1)';
                color = '#fff';
                boxShadow = '0 0 15px rgba(0, 242, 254, 0.4)';
            } else if (isWrongFinal) {
                borderColor = '#f43f5e';
                background = 'rgba(244, 63, 94, 0.1)';
                color = '#fecaca';
            } else {
                borderColor = 'rgba(255, 255, 255, 0.1)';
                color = '#444';
            }
        } else if (isSelected) {
            borderColor = '#00f2fe';
            background = 'rgba(0, 242, 254, 0.05)';
            color = '#fff';
            boxShadow = '0 0 10px rgba(0, 242, 254, 0.2)';
        }

        return {
            flex: 1,
            padding: '0.75rem 1rem',
            borderRadius: '12px',
            border: `2px solid ${borderColor}`,
            background,
            color,
            cursor: (revealed || alreadySolved) ? 'default' : 'pointer',
            fontFamily: '"Rajdhani", sans-serif',
            fontSize: '1rem',
            fontWeight: '600',
            textAlign: 'center',
            textTransform: 'uppercase',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow,
            letterSpacing: '1px'
        };
    };

    return (
        <div style={{
            background: 'rgba(15, 15, 25, 0.9)',
            border: '2px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '30px',
            padding: '2.5rem 2rem',
            position: 'relative',
            maxWidth: '400px',
            margin: '0 auto',
            color: 'white',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 0 40px rgba(0,0,0,0.5)',
            overflow: 'hidden'
        }}>
            {/* Background Particles Decoration */}
            <div style={{ position: 'absolute', inset: 0, opacity: 0.1, pointerEvents: 'none' }}>
                {[...Array(20)].map((_, i) => (
                    <div key={i} style={{
                        position: 'absolute',
                        width: '4px', height: '4px',
                        background: '#00f2fe',
                        borderRadius: '50%',
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animation: `pulse-slow ${2 + Math.random() * 3}s infinite`
                    }} />
                ))}
            </div>

            {/* Frame Corner Accents */}
            <div style={{ position: 'absolute', top: '20px', left: '20px', width: '30px', height: '30px', borderLeft: '2px solid #a855f7', borderTop: '2px solid #a855f7', borderRadius: '4px 0 0 0' }} />
            <div style={{ position: 'absolute', top: '20px', right: '20px', width: '30px', height: '30px', borderRight: '2px solid #a855f7', borderTop: '2px solid #a855f7', borderRadius: '0 4px 0 0' }} />
            <div style={{ position: 'absolute', bottom: '20px', left: '20px', width: '30px', height: '30px', borderLeft: '2px solid #a855f7', borderBottom: '2px solid #a855f7', borderRadius: '0 0 0 4px' }} />
            <div style={{ position: 'absolute', bottom: '20px', right: '20px', width: '30px', height: '30px', borderRight: '2px solid #a855f7', borderBottom: '2px solid #a855f7', borderRadius: '0 0 4px 0' }} />

            {/* Title Section */}
            <div style={{ textAlign: 'center', marginBottom: '2rem', position: 'relative' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '900', letterSpacing: '4px', margin: 0, color: '#e2e8f0', fontFamily: '"Bebas Neue", sans-serif' }}>
                    INCÓGNITA DIARIA
                </h1>
                <p style={{ fontSize: '1.1rem', color: '#94a3b8', letterSpacing: '2px', fontWeight: '500', margin: '0.2rem 0 0 0' }}>DESAFÍO MENTAL</p>
            </div>

            {/* Image Slot Section with Neon Tech Frame */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem', position: 'relative' }}>
                <div style={{ position: 'relative', width: '200px', height: '200px' }}>
                    {/* Glowing Outer Ring */}
                    <div style={{
                        position: 'absolute', inset: -12,
                        border: '2px solid rgba(0, 242, 254, 0.6)',
                        borderRadius: '50%',
                        boxShadow: '0 0 20px rgba(0, 242, 254, 0.4), inset 0 0 15px rgba(0, 242, 254, 0.3)',
                        zIndex: 0
                    }} />

                    {/* Animated Inner Ring */}
                    <div style={{
                        position: 'absolute', inset: -6,
                        border: '2px dashed rgba(168, 85, 247, 0.6)',
                        borderRadius: '50%',
                        animation: 'spin 15s linear infinite',
                        zIndex: 0
                    }} />

                    {/* Image Container */}
                    <div style={{
                        width: '100%', height: '100%',
                        borderRadius: '50%',
                        background: '#0a0a0f',
                        border: '3px solid #1e293b',
                        overflow: 'hidden',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        position: 'relative',
                        zIndex: 2,
                        boxShadow: '0 0 30px rgba(0, 0, 0, 0.8)'
                    }}>
                        {dailyTrivia.image ? (
                            <img
                                src={dailyTrivia.image}
                                alt="Trivia"
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                            />
                        ) : (
                            <div style={{ textAlign: 'center' }}>
                                <HelpCircle size={80} color="gold" style={{ filter: 'drop-shadow(0 0 10px rgba(255, 215, 0, 0.5))' }} />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Progress Bar Section */}
            <div style={{ width: '100%', padding: '0 0.5rem', marginBottom: '2.5rem' }}>
                <div style={{ height: '35px', position: 'relative', width: '100%' }}>
                    {/* Milestones Labels removed for design cleanliness */}
                    <div style={{ height: '14px' }} />

                    {/* Bar Container */}
                    <div style={{
                        position: 'absolute', bottom: 4, width: '100%', height: '18px',
                        background: 'rgba(30, 41, 59, 0.8)',
                        borderRadius: '15px',
                        border: '1px solid #334155',
                        overflow: 'hidden'
                        // Removed clipPath to ensure alignment with standard bars
                    }}>
                        <div style={{
                            width: `${progressPercent}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #00f2fe 0%, #3b82f6 100%)',
                            borderRadius: '15px',
                            boxShadow: '0 0 20px rgba(0, 242, 254, 0.4)',
                            transition: 'width 1s ease'
                        }} />

                        {/* Ticks */}
                        {[20, 40, 60, 80].map(tick => (
                            <div key={tick} style={{
                                position: 'absolute', top: 0, height: '100%', width: '1px',
                                background: 'rgba(255,255,255,0.3)', left: `${tick}%`, zIndex: 2
                            }} />
                        ))}
                    </div>
                </div>

                <div style={{ textAlign: 'right', fontSize: '0.85rem', color: '#94a3b8', marginTop: '6px' }}>
                    {totalSolved}/50 ({Math.round(progressPercent)}%)
                </div>

                <div style={{ textAlign: 'center', textTransform: 'uppercase', color: '#94a3b8', fontSize: '0.9rem', letterSpacing: '2px', marginTop: '0.5rem' }}>
                    FALTAN PARA EL SIGUIENTE HITO: <span style={{ color: '#3b82f6', fontWeight: 'bold' }}>{daysToNext} DÍAS</span>
                </div>
            </div>

            {/* Question Section */}
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.8rem', color: '#fff', margin: 0, textTransform: 'uppercase' }}>
                    {dailyTrivia.question}
                </h2>
            </div>

            {/* Options Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                gap: '1rem',
                marginBottom: revealed ? '0' : '1rem'
            }}>
                {dailyTrivia.options.map((option, idx) => (
                    <button
                        key={idx}
                        style={getOptionStyle(idx)}
                        onClick={() => handleSelect(idx)}
                    >
                        {option}
                    </button>
                ))}
            </div>

            {/* Confirm Button */}
            {!alreadySolved && !revealed && (
                <button
                    onClick={handleSubmit}
                    disabled={selectedOption === null}
                    style={{
                        width: '100%',
                        marginTop: '2rem',
                        padding: '1rem',
                        background: selectedOption === null ? '#1e293b' : 'linear-gradient(90deg, #6d28d9, #00f2fe)',
                        border: 'none',
                        borderRadius: '12px',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        textTransform: 'uppercase',
                        letterSpacing: '3px',
                        cursor: selectedOption === null ? 'default' : 'pointer',
                        opacity: selectedOption === null ? 0.5 : 1,
                        transition: 'all 0.3s'
                    }}
                >
                    ENVIAR RESPUESTA
                </button>
            )}

            {/* Feedback Message */}
            {(alreadySolved || revealed) && (
                <div style={{
                    marginTop: '2rem',
                    textAlign: 'center',
                    padding: '1.5rem',
                    background: 'rgba(0,0,0,0.4)',
                    borderRadius: '15px',
                    border: '1px solid rgba(0, 242, 254, 0.2)',
                    animation: 'fade-in 0.5s ease'
                }}>
                    {isCorrect || alreadySolved ? (
                        <div style={{ color: '#00f2fe', fontWeight: 'bold' }}>
                            <CheckCircle size={24} style={{ display: 'block', margin: '0 auto 0.5rem' }} />
                            ¡MISION CUMPLIDA! +10 XP EXPANDIDOS
                        </div>
                    ) : (
                        <div style={{ color: '#f43f5e', fontWeight: 'bold' }}>
                            <XCircle size={24} style={{ display: 'block', margin: '0 auto 0.5rem' }} />
                            FALLO EN EL SISTEMA. VUELVE MAÑANA.
                        </div>
                    )}
                </div>
            )}

            <style>{`
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.1; }
                    50% { opacity: 0.4; }
                }
                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default DailyTrivia;
