import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Scroll, CheckCircle, XCircle, Award, HelpCircle, Trophy } from 'lucide-react';

const DailyChallenge = () => {
    const { gameState, solveDailyChallenge } = useGame();
    const challenge = gameState.dailyChallenge;
    const currentUser = gameState.currentUser;

    const [userAnswer, setUserAnswer] = useState('');
    const [feedback, setFeedback] = useState(null); // 'correct' | 'incorrect' | null
    const [revealed, setRevealed] = useState(false);

    // Track total solved for the progress bar
    const totalSolved = currentUser?.challengesSolved || 0;
    const progress = Math.min((totalSolved / 50) * 100, 100);
    const milestones = [10, 20, 40, 50];

    // Helper to check if user already attempted this specific challenge ID
    const hasAttempted = currentUser?.challengeHistory?.[challenge?.id];

    if (!challenge || !challenge.active || (hasAttempted && !revealed && !feedback)) return null;

    const handleSubmit = () => {
        if (!userAnswer) return;
        const isCorrect = solveDailyChallenge(currentUser.id, userAnswer);
        setFeedback(isCorrect ? 'correct' : 'incorrect');
        setRevealed(true);
    };

    const isDirector = currentUser?.role === 'director';

    const containerStyle = {
        background: 'rgba(15, 12, 5, 0.95)',
        border: '2px solid rgba(212, 175, 55, 0.4)',
        borderRadius: '30px',
        padding: '2.5rem 2rem',
        maxWidth: '400px',
        margin: '0 auto',
        position: 'relative',
        boxShadow: '0 0 50px rgba(184, 134, 11, 0.15)',
        color: '#fff',
        fontFamily: '"Rajdhani", sans-serif',
        overflow: 'hidden'
    };

    const cornerAccent = (style) => (
        <div style={{
            position: 'absolute',
            width: '20px',
            height: '20px',
            border: '3px solid #d4af37',
            ...style
        }} />
    );

    return (
        <div style={containerStyle}>
            {/* Solo Leveling Corner Accents */}
            {cornerAccent({ top: 0, left: 0, borderRight: 'none', borderBottom: 'none', borderRadius: '20px 0 0 0' })}
            {cornerAccent({ top: 0, right: 0, borderLeft: 'none', borderBottom: 'none', borderRadius: '0 20px 0 0' })}
            {cornerAccent({ bottom: 0, left: 0, borderRight: 'none', borderTop: 'none', borderRadius: '0 0 0 20px' })}
            {cornerAccent({ bottom: 0, right: 0, borderLeft: 'none', borderTop: 'none', borderRadius: '0 0 20px 0' })}

            {/* Background Particle Decoration */}
            <div style={{
                position: 'absolute', top: '10%', right: '5%',
                width: '150px', height: '150px',
                background: 'radial-gradient(circle, rgba(212,175,55,0.08) 0%, transparent 70%)',
                filter: 'blur(20px)', zIndex: 0
            }} />

            <div style={{ position: 'relative', zIndex: 1 }}>
                <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 style={{
                        color: '#fbbf24',
                        fontSize: '1.8rem',
                        fontWeight: '800',
                        letterSpacing: '5px',
                        margin: 0,
                        textTransform: 'uppercase',
                        textShadow: '0 0 10px rgba(251, 191, 36, 0.5)'
                    }}>
                        Desafío del Director
                    </h2>
                    <div style={{
                        color: '#d97706',
                        fontSize: '0.9rem',
                        letterSpacing: '3px',
                        marginTop: '0.3rem',
                        fontWeight: 'bold'
                    }}>
                        MISIÓN DORADA
                    </div>
                </header>

                {/* Main Image Slot */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    marginBottom: '2.5rem',
                    position: 'relative'
                }}>
                    <div style={{
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        border: '5px solid #b45309',
                        padding: '8px',
                        background: 'rgba(0,0,0,0.4)',
                        boxShadow: '0 0 30px rgba(180, 83, 9, 0.4)',
                        position: 'relative'
                    }}>
                        {/* Decorative Outer Ring */}
                        <div style={{
                            position: 'absolute', top: '-15px', left: '-15px', right: '-15px', bottom: '-15px',
                            border: '1px solid rgba(251, 191, 36, 0.2)',
                            borderRadius: '50%', borderStyle: 'dashed'
                        }} />

                        <div style={{
                            width: '100%', height: '100%',
                            borderRadius: '50%',
                            overflow: 'hidden',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            background: '#0a0a05'
                        }}>
                            {challenge.image ? (
                                <img src={challenge.image} alt="Mystery" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <Trophy size={80} color="#78350f" />
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
                            position: 'absolute', bottom: 4, width: '100%', height: '14px',
                            background: 'rgba(217, 119, 6, 0.1)',
                            borderRadius: '10px',
                            border: '1px solid rgba(217, 119, 6, 0.3)',
                            overflow: 'hidden'
                        }}>
                            <div style={{
                                width: `${progress}%`,
                                height: '100%',
                                background: 'linear-gradient(90deg, #d97706, #fbbf24)',
                                boxShadow: '0 0 15px #f59e0b',
                                transition: 'width 1.5s ease-out'
                            }} />

                            {/* Ticks */}
                            {[20, 40, 60, 80].map(tick => (
                                <div key={tick} style={{
                                    position: 'absolute', top: 0, height: '100%', width: '1px',
                                    background: 'rgba(255,255,255,0.2)', left: `${tick}%`, zIndex: 2
                                }} />
                            ))}
                        </div>
                    </div>

                    <div style={{ textAlign: 'right', marginTop: '6px', color: '#888', fontSize: '0.85rem' }}>
                        <span style={{ color: '#fbbf24', fontWeight: 'bold' }}>{totalSolved}/50</span> ({progress.toFixed(0)}%)
                    </div>
                </div>

                {/* Question & Interactive Area */}
                <div style={{ textAlign: 'center', padding: '0 1rem' }}>
                    <p style={{ color: '#fbbf24', fontSize: '0.8rem', marginBottom: '1rem', letterSpacing: '2px' }}>
                        FALTAN PARA EL SIGUIENTE HITO: {milestones.find(m => m > totalSolved) - totalSolved || 0} DÍAS
                    </p>

                    <h3 style={{
                        fontSize: '1.5rem',
                        fontWeight: '700',
                        color: '#fff',
                        marginBottom: '2rem',
                        textTransform: 'uppercase',
                        letterSpacing: '1px'
                    }}>
                        {challenge.question}
                    </h3>

                    {!revealed && !hasAttempted ? (
                        <>
                            {challenge.type === 'choice' ? (
                                <div style={{
                                    display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem'
                                }}>
                                    {(challenge.options || []).map((opt, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setUserAnswer(opt)}
                                            style={{
                                                padding: '1rem',
                                                background: userAnswer === opt ? 'rgba(251, 191, 36, 0.1)' : 'transparent',
                                                border: userAnswer === opt ? '2px solid #fbbf24' : '1px solid rgba(251, 191, 36, 0.4)',
                                                borderRadius: '12px',
                                                color: '#fff',
                                                cursor: 'pointer',
                                                fontSize: '1rem',
                                                fontWeight: 'bold',
                                                display: 'flex', alignItems: 'center', gap: '1rem',
                                                transition: 'all 0.2s',
                                                textAlign: 'left'
                                            }}
                                        >
                                            <span style={{ color: '#fbbf24', fontWeight: '800' }}>{String.fromCharCode(65 + idx)}.</span> {opt}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <input
                                    type="text"
                                    value={userAnswer}
                                    onChange={(e) => setUserAnswer(e.target.value)}
                                    placeholder="INGRESA TU RESPUESTA AQUÍ..."
                                    style={{
                                        width: '100%', padding: '1.2rem',
                                        background: 'rgba(0,0,0,0.3)',
                                        border: '1px solid rgba(251, 191, 36, 0.4)',
                                        borderRadius: '12px', color: '#fbbf24',
                                        fontSize: '1.1rem', textAlign: 'center',
                                        outline: 'none', letterSpacing: '2px'
                                    }}
                                />
                            )}

                            <button
                                onClick={handleSubmit}
                                disabled={!userAnswer}
                                style={{
                                    width: '100%', marginTop: '2.5rem', padding: '1.2rem',
                                    background: !userAnswer ? '#222' : 'linear-gradient(90deg, #b45309, #f59e0b)',
                                    border: 'none', borderRadius: '15px',
                                    color: 'white', fontWeight: 'bold', fontSize: '1.2rem',
                                    textTransform: 'uppercase', letterSpacing: '3px',
                                    cursor: !userAnswer ? 'default' : 'pointer',
                                    opacity: !userAnswer ? 0.3 : 1, transition: 'all 0.3s'
                                }}
                            >
                                {isDirector ? 'Vista Previa (Enviar)' : 'Enviar Respuesta'}
                            </button>
                        </>
                    ) : (
                        <div style={{
                            marginTop: '2rem', padding: '2rem',
                            background: feedback === 'correct' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                            borderRadius: '20px', border: feedback === 'correct' ? '2px solid #10b981' : '2px solid #ef4444'
                        }}>
                            {feedback === 'correct' ? (
                                <CheckCircle size={50} color="#10b981" style={{ margin: '0 auto 1rem' }} />
                            ) : (
                                <XCircle size={50} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
                            )}
                            <h4 style={{ fontSize: '1.4rem', color: feedback === 'correct' ? '#10b981' : '#ef4444', margin: 0 }}>
                                {feedback === 'correct' ? '¡Respuesta Correcta!' : 'Respuesta Incorrecta'}
                            </h4>
                            <p style={{ color: '#888', marginTop: '0.5rem' }}>
                                {feedback === 'correct' ? '+20 Puntos ganados para tu casa.' : 'El conocimiento requiere paciencia. Inténtalo mañana.'}
                            </p>
                        </div>
                    )}
                </div>

                {isDirector && (
                    <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#d97706', fontSize: '0.8rem', opacity: 0.6 }}>
                        Modo Vista Previa (Director)
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyChallenge;

