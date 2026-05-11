import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { Sparkles, Zap, Smile, BookOpen, Brain, Shirt, Droplets, Trophy, Star } from 'lucide-react';
import purpleHourglassImg from '../assets/hourglass_director.jpg';

const StatRow = ({ icon: Icon, label, value, onChange, disabled }) => {
    return (
        <div style={{ marginBottom: '1.2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.7)', marginBottom: '0.6rem' }}>
                <div style={{
                    background: 'rgba(212, 175, 55, 0.1)',
                    padding: '4px',
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid rgba(212, 175, 55, 0.2)'
                }}>
                    <Icon size={14} color="#d4af37" />
                </div>
                <span style={{ fontSize: '0.85rem', fontWeight: 'bold', letterSpacing: '1px', textTransform: 'uppercase' }}>{label}</span>
                <span style={{ marginLeft: 'auto', fontWeight: 'bold', color: '#d4af37', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    {disabled && <span style={{ fontSize: '0.6rem', color: 'rgba(212, 175, 55, 0.5)', letterSpacing: '0' }}>PROMEDIO</span>}
                    {value}{disabled ? '/10' : ''}
                </span>
            </div>

            <div style={{
                display: 'flex',
                gap: '4px',
                height: '24px',
                background: 'rgba(0,0,0,0.5)',
                borderRadius: '4px',
                padding: '3px',
                border: '1px solid rgba(212, 175, 55, 0.1)'
            }}>
                {disabled ? (
                    <div style={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '2px',
                        overflow: 'hidden',
                        position: 'relative',
                        background: 'rgba(212,175,55,0.05)'
                    }}>
                        <div style={{
                            width: `${(value / 10) * 100}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #78350f, #d4af37)',
                            boxShadow: '0 0 10px rgba(212, 175, 55, 0.3)'
                        }} />
                    </div>
                ) : (
                    Array.from({ length: 10 }, (_, i) => i + 1).map(num => (
                        <button
                            key={num}
                            onClick={() => onChange(num)}
                            style={{
                                flex: 1,
                                border: 'none',
                                background: num <= value ? 'linear-gradient(180deg, #d4af37, #b4941f)' : 'transparent',
                                color: num <= value ? '#000' : 'rgba(255,255,255,0.3)',
                                fontSize: '0.65rem',
                                fontWeight: '900',
                                cursor: 'pointer',
                                borderRadius: '2px',
                                transition: 'all 0.2s',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}
                            title={`Votar ${num}`}
                        >
                            {num}
                        </button>
                    ))
                )}
            </div>
        </div>
    );
};

const DirectorStats = () => {
    const { gameState, voteDirectorStats } = useGame();
    const stats = gameState.directorStats;
    const currentUser = gameState.currentUser;

    const today = new Date().toISOString().split('T')[0];
    const userVote = currentUser && stats.votes && stats.votes[currentUser.id];
    const hasVoted = userVote && userVote.lastVoteDate === today;

    const [votes, setVotes] = useState({
        intelligence: 5,
        energy: 5,
        joy: 5,
        teachingEnthusiasm: 5,
        knowledge: 5,
        perfumeRating: 5,
        outfitRating: 5
    });
    const [showSuccess, setShowSuccess] = useState(false);

    const handleVoteChange = (key, value) => {
        if (!hasVoted) {
            setVotes(prev => ({ ...prev, [key]: value }));
        }
    };

    const handleSubmitVote = () => {
        if (currentUser) {
            voteDirectorStats(currentUser.id, votes);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } else {
            alert("Debes iniciar sesión para votar.");
        }
    };

    return (
        <div style={{
            background: 'rgba(15, 12, 5, 0.95)',
            border: '2px solid rgba(212, 175, 55, 0.4)',
            borderRadius: '30px',
            padding: '2px',
            position: 'relative',
            boxShadow: '0 0 30px rgba(212, 175, 55, 0.15)',
            maxWidth: '400px',
            margin: '0 auto',
            fontFamily: '"Cinzel", serif',
            overflow: 'hidden',
            color: '#fff'
        }}>
            {/* Background Texture Effect */}
            <div style={{
                position: 'absolute', inset: 0,
                opacity: 0.05,
                background: 'radial-gradient(circle at center, #d4af37 0%, transparent 70%)',
                pointerEvents: 'none'
            }} />

            <div style={{
                background: 'linear-gradient(180deg, rgba(20, 15, 5, 0.95) 0%, rgba(10, 8, 3, 0.98) 100%)',
                borderRadius: '28px',
                padding: '1.5rem',
                zIndex: 1,
                position: 'relative'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <h2 style={{
                        fontSize: '1.4rem',
                        margin: 0,
                        color: '#d4af37',
                        letterSpacing: '3px',
                        textShadow: '0 0 10px rgba(212, 175, 55, 0.5)'
                    }}>EVALÚA AL DIRECTOR</h2>
                    <div style={{
                        height: '1px',
                        width: '60px',
                        background: '#d4af37',
                        margin: '8px auto',
                        boxShadow: '0 0 5px #d4af37'
                    }} />
                    <p style={{ fontSize: '0.7rem', color: 'rgba(212, 175, 55, 0.6)', fontWeight: 'bold' }}>
                        {hasVoted ? "VALORACIÓN DE LA ACADEMIA" : "MISIÓN DE RECONOCIMIENTO DIARIO"}
                    </p>
                </div>

                {/* Avatar Section with Orbiting Star and Hourglass */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '2.5rem',
                    marginBottom: '2rem',
                    padding: '0 1rem'
                }}>
                    {/* Left: Hourglass and Total Score */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.5rem',
                        minWidth: '80px'
                    }}>
                        <div style={{ position: 'relative' }}>
                            <img src={purpleHourglassImg} alt="Score" style={{ width: '40px', height: '55px', objectFit: 'contain', filter: 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.4))' }} />
                            {/* Small glow pulse under hourglass */}
                            <div style={{
                                position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)',
                                width: '20px', height: '4px', borderRadius: '50%',
                                background: 'rgba(168, 85, 247, 0.3)', filter: 'blur(3px)',
                                animation: 'pulse-slow 2s infinite'
                            }} />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '0.55rem', color: 'rgba(212, 175, 55, 0.5)', fontWeight: 'bold', letterSpacing: '1px' }}>LOGROS TOTALES</div>
                            <div style={{ fontSize: '1.2rem', color: '#d4af37', fontWeight: '900', textShadow: '0 0 10px rgba(212,175,55,0.3)' }}>{stats.directorScore || 0}</div>
                        </div>
                    </div>

                    {/* Right: Avatar Section */}
                    <div style={{
                        position: 'relative',
                        width: '130px',
                        height: '130px',
                    }}>
                        {/* Orbiting Magic Star */}
                        <div style={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            width: '100%',
                            height: '100%',
                            transform: 'translate(-50%, -50%)',
                            animation: 'orbit 8s linear infinite',
                            zIndex: 4,
                            pointerEvents: 'none',
                        }}>
                            <Star
                                size={14}
                                fill="#d4af37"
                                color="#fff"
                                style={{
                                    position: 'absolute',
                                    top: '-15px', // Radius + small offset
                                    left: '50%',
                                    transform: 'translateX(-50%)',
                                    filter: 'drop-shadow(0 0 5px #d4af37)',
                                }}
                            />
                        </div>

                        {/* Outer Glow Ring */}
                        <div style={{
                            position: 'absolute', inset: -12,
                            border: '2px solid rgba(212, 175, 55, 0.2)',
                            boxShadow: '0 0 15px rgba(212, 175, 55, 0.1)'
                        }} />

                        {/* Inner Animated Ring */}
                        <div style={{
                            position: 'absolute', inset: -6,
                            border: '1px dashed rgba(212, 175, 55, 0.4)',
                            borderRadius: '50%',
                            animation: 'spin 20s linear infinite'
                        }} />

                        {/* Image Slot */}
                        <div style={{
                            width: '100%', height: '100%',
                            borderRadius: '50%',
                            background: '#1a1408',
                            border: '3px solid #d4af37',
                            overflow: 'hidden',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 0 20px rgba(0,0,0,0.8), inset 0 0 20px rgba(212,175,55,0.2)',
                            position: 'relative',
                            zIndex: 2
                        }}>
                            {stats.avatar ? (
                                <img src={stats.avatar} alt="Director" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                <Trophy size={60} color="#78350f" />
                            )}
                        </div>

                        {/* Pet Bubble */}
                        {stats.pet && (
                            <div style={{
                                position: 'absolute',
                                bottom: -5,
                                right: -5,
                                width: '40px',
                                height: '40px',
                                borderRadius: '50%',
                                border: '2px solid #d4af37',
                                background: '#000',
                                overflow: 'hidden',
                                zIndex: 5,
                                boxShadow: '0 4px 10px rgba(0,0,0,0.5)'
                            }}>
                                <img src={stats.pet} alt="Mascota" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            </div>
                        )}
                    </div>
                </div>

                {/* Stats Grid */}
                <div style={{ marginBottom: '1.5rem' }}>
                    <StatRow icon={Brain} label="Inteligencia" value={hasVoted || !currentUser ? stats.intelligence : votes.intelligence} onChange={(v) => handleVoteChange('intelligence', v)} disabled={hasVoted || !currentUser} />
                    <StatRow icon={Zap} label="Energía" value={hasVoted || !currentUser ? stats.energy : votes.energy} onChange={(v) => handleVoteChange('energy', v)} disabled={hasVoted || !currentUser} />
                    <StatRow icon={Smile} label="Alegría" value={hasVoted || !currentUser ? stats.joy : votes.joy} onChange={(v) => handleVoteChange('joy', v)} disabled={hasVoted || !currentUser} />
                    <StatRow icon={Sparkles} label="Entusiasmo" value={hasVoted || !currentUser ? stats.teachingEnthusiasm : votes.teachingEnthusiasm} onChange={(v) => handleVoteChange('teachingEnthusiasm', v)} disabled={hasVoted || !currentUser} />
                    <StatRow icon={BookOpen} label="Sapiencia" value={hasVoted || !currentUser ? stats.knowledge : votes.knowledge} onChange={(v) => handleVoteChange('knowledge', v)} disabled={hasVoted || !currentUser} />

                    <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(212, 175, 55, 0.1)' }}>
                        <StatRow icon={Droplets} label="PERFUME" value={hasVoted || !currentUser ? stats.perfumeRating : votes.perfumeRating} onChange={(v) => handleVoteChange('perfumeRating', v)} disabled={hasVoted || !currentUser} />
                        <StatRow icon={Shirt} label="OUTFIT DE HOY" value={hasVoted || !currentUser ? stats.outfitRating : votes.outfitRating} onChange={(v) => handleVoteChange('outfitRating', v)} disabled={hasVoted || !currentUser} />
                    </div>
                </div>

                {/* Submit Section */}
                {!hasVoted && currentUser ? (
                    <button
                        onClick={handleSubmitVote}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            background: 'linear-gradient(180deg, #d4af37 0%, #78350f 100%)',
                            border: '1px solid #ffeb3b',
                            borderRadius: '12px',
                            color: '#000',
                            fontWeight: '900',
                            fontSize: '1rem',
                            letterSpacing: '2px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 15px rgba(212, 175, 55, 0.3)',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
                        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                        REGISTRAR EVALUACIÓN
                    </button>
                ) : !currentUser ? (
                    <div style={{
                        textAlign: 'center',
                        fontSize: '0.8rem',
                        color: 'rgba(212, 175, 55, 0.5)',
                        padding: '1rem',
                        border: '1px dashed rgba(212, 175, 55, 0.3)',
                        borderRadius: '12px'
                    }}>
                        INICIA SESIÓN PARA EVALUAR
                    </div>
                ) : null}

                {showSuccess && (
                    <div style={{
                        marginTop: '1rem',
                        padding: '0.8rem',
                        background: 'rgba(46, 204, 113, 0.1)',
                        border: '1px solid #2ecc71',
                        borderRadius: '10px',
                        color: '#2ecc71',
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: '0.8rem',
                        animation: 'fadeIn 0.5s'
                    }}>
                        ¡Vínculo Reforzado! +20 Puntos
                    </div>
                )}
            </div>

            <style>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @keyframes orbit {
                    from { transform: translate(-50%, -50%) rotate(0deg); }
                    to { transform: translate(-50%, -50%) rotate(360deg); }
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.2; transform: translateX(-50%) scale(1); }
                    50% { opacity: 0.5; transform: translateX(-50%) scale(1.2); }
                }
                @font-face {
                    font-family: 'Cinzel';
                    src: url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&display=swap');
                }
            `}</style>
        </div>
    );
};

export default DirectorStats;
