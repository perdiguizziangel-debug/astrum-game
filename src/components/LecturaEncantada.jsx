import React, { useState, useEffect, useRef } from 'react';
import { useGame } from '../context/GameContext';
import { BookOpen, Play, Square, Sparkles, Clock, Trophy, Send } from 'lucide-react';

// --- Animated Waveform Visualizer ---
const AudioVisualizer = ({ isActive }) => {
    const bars = Array.from({ length: 20 });
    return (
        <div style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            gap: '3px', height: '60px', padding: '0 1rem'
        }}>
            {bars.map((_, i) => (
                <div
                    key={i}
                    style={{
                        width: '4px',
                        height: isActive ? `${20 + Math.random() * 40}px` : '8px',
                        background: isActive
                            ? `hsl(${200 + i * 8}, 80%, 60%)`
                            : '#1e3a5f',
                        borderRadius: '2px',
                        transition: 'height 0.15s ease',
                        animation: isActive ? `wave-${i % 5} ${0.5 + (i % 5) * 0.1}s ease-in-out infinite alternate` : 'none',
                    }}
                />
            ))}
            <style>{`
                @keyframes wave-0 { from { height: 8px } to { height: 50px } }
                @keyframes wave-1 { from { height: 14px } to { height: 40px } }
                @keyframes wave-2 { from { height: 20px } to { height: 55px } }
                @keyframes wave-3 { from { height: 10px } to { height: 45px } }
                @keyframes wave-4 { from { height: 18px } to { height: 35px } }
            `}</style>
        </div>
    );
};

// --- Main Component ---
const LecturaEncantada = () => {
    const { gameState, interactWithReading } = useGame();
    const { directorStats, currentUser } = gameState;
    const bookImage = directorStats?.lecturaEncantada;
    const bookStory = directorStats?.lecturaEncantadaStory || 'El libro de hoy guarda secretos entre sus páginas...';

    const [phase, setPhase] = useState('idle'); // idle | reading | summary | feedback | done
    const [timer, setTimer] = useState(30);
    const [summary, setSummary] = useState('');
    const [aiFeedback, setAiFeedback] = useState('');
    const [loadingFeedback, setLoadingFeedback] = useState(false);
    const intervalRef = useRef(null);

    const today = new Date().toISOString().split('T')[0];
    const alreadyRead = currentUser?.readingHistory?.[today]?.done;
    const historyValues = Object.values(currentUser?.readingHistory || {});
    const totalDaysRead = historyValues.filter(d => d.done).length;
    const currentStreak = currentUser?.streakReading || 0;
    const maxDays = 30;
    const progressPercent = Math.min((currentStreak / maxDays) * 100, 100);

    // Countdown timer during reading phase
    useEffect(() => {
        if (phase === 'reading') {
            setTimer(30);
            intervalRef.current = setInterval(() => {
                setTimer(t => {
                    if (t <= 1) {
                        clearInterval(intervalRef.current);
                        setPhase('summary');
                        return 0;
                    }
                    return t - 1;
                });
            }, 1000);
        }
        return () => clearInterval(intervalRef.current);
    }, [phase]);

    const handleStartReading = () => {
        if (alreadyRead) return;
        setPhase('reading');
    };

    const handleStop = () => {
        clearInterval(intervalRef.current);
        setPhase('summary');
    };

    const handleSubmitSummary = async () => {
        if (!summary.trim()) return;
        setLoadingFeedback(true);
        setPhase('feedback');

        try {
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
            if (!apiKey) throw new Error('NO_API_KEY');

            const res = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        contents: [{
                            parts: [{
                                text: `Eres un maestro de un castillo mágico de aprendizaje llamado Astrum. Un alumno acaba de leer durante 30 segundos y escribe esto sobre lo que leyó:

"${summary}"

Dale un feedback corto, positivo y alentador (3-4 frases como máximo). Usa un tono mágico y motivador. Finaliza con una frase especial de ánimo como un hechizo de sabiduría. Responde en español.`
                            }]
                        }]
                    })
                }
            );

            const data = await res.json();
            const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || '¡Excelente lectura! Cada página es un hechizo que te hace más sabio.';
            setAiFeedback(text);
        } catch (err) {
            setAiFeedback('¡Excelente lectura, joven mago! Las palabras que absorbiste hoy nutren tu sabiduría. Sigue leyendo y los secretos del universo se revelarán ante ti. ✨ *Verba docent, exempla trahunt!*');
        }

        // Award XP + record
        interactWithReading(currentUser.id);
        setLoadingFeedback(false);
    };

    const handleFinish = () => setPhase('done');

    // --- Empty state when no book is set by director ---
    if (!bookImage) {
        return (
            <div className="card magic-border" style={{
                textAlign: 'center',
                background: 'linear-gradient(to bottom, #0f1f3d, #061120)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '300px'
            }}>
                <h3 style={{ marginBottom: '1rem', color: '#60a5fa', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                    <BookOpen size={20} /> Lectura Encantada
                </h3>
                <div style={{ color: '#555', fontStyle: 'italic' }}>
                    <p>La biblioteca está cerrada...</p>
                    <p style={{ fontSize: '0.8rem' }}>El Director aún no ha elegido el libro del día.</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{
            background: '#061120',
            border: '2px solid #3b82f6',
            borderRadius: '20px',
            padding: '2px',
            position: 'relative',
            boxShadow: '0 0 25px rgba(59, 130, 246, 0.35)',
            maxWidth: '400px',
            margin: '0 auto',
            fontFamily: '"Orbitron", sans-serif',
            overflow: 'hidden'
        }}>
            {/* Corner Accents */}
            {['topLeft', 'topRight', 'bottomLeft', 'bottomRight'].map(pos => (
                <div key={pos} style={{
                    position: 'absolute',
                    top: pos.includes('top') ? 0 : 'auto',
                    bottom: pos.includes('bottom') ? 0 : 'auto',
                    left: pos.includes('Left') ? 0 : 'auto',
                    right: pos.includes('Right') ? 0 : 'auto',
                    width: '20px', height: '20px',
                    borderTop: pos.includes('top') ? '2px solid #93c5fd' : 'none',
                    borderBottom: pos.includes('bottom') ? '2px solid #93c5fd' : 'none',
                    borderLeft: pos.includes('Left') ? '2px solid #93c5fd' : 'none',
                    borderRight: pos.includes('Right') ? '2px solid #93c5fd' : 'none',
                    borderTopLeftRadius: pos === 'topLeft' ? '15px' : 0,
                    borderTopRightRadius: pos === 'topRight' ? '15px' : 0,
                    borderBottomLeftRadius: pos === 'bottomLeft' ? '15px' : 0,
                    borderBottomRightRadius: pos === 'bottomRight' ? '15px' : 0,
                }} />
            ))}

            <div style={{
                background: 'linear-gradient(180deg, rgba(6,17,32,0.97) 0%, rgba(2,8,20,0.99) 100%)',
                borderRadius: '18px', padding: '1.5rem',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem'
            }}>

                {/* Book Image Header */}
                <div style={{ position: 'relative', width: '160px', height: '160px' }}>
                    <div style={{
                        position: 'absolute', inset: -10,
                        border: '2px solid #3b82f6', borderRadius: '50%',
                        boxShadow: '0 0 15px #3b82f6, inset 0 0 10px #3b82f6'
                    }} />
                    <div style={{
                        position: 'absolute', inset: -5,
                        border: '1px dashed #bfdbfe', borderRadius: '50%',
                        animation: 'spin 20s linear infinite'
                    }} />
                    <img src={bookImage} alt="Libro" style={{
                        width: '100%', height: '100%',
                        borderRadius: '50%', objectFit: 'cover',
                        position: 'relative', zIndex: 1
                    }} />
                    <div style={{
                        position: 'absolute', bottom: -15, left: '50%', transform: 'translateX(-50%)',
                        background: '#0f172a', border: '1px solid #3b82f6',
                        padding: '4px 12px', borderRadius: '10px',
                        color: '#93c5fd', fontSize: '0.75rem', fontWeight: 'bold',
                        zIndex: 2, whiteSpace: 'nowrap', boxShadow: '0 4px 6px rgba(0,0,0,0.5)'
                    }}>
                        LECTURA ENCANTADA
                    </div>
                </div>

                <div style={{ textAlign: 'center', color: '#60a5fa', fontSize: '0.85rem', marginTop: '-0.5rem' }}>
                    RITUAL DE SABIDURÍA
                </div>

                {/* --- PHASE: IDLE --- */}
                {(phase === 'idle' || phase === 'done') && (
                    <>
                        <AudioVisualizer isActive={false} />
                        {alreadyRead || phase === 'done' ? (
                            <div style={{
                                width: '100%', textAlign: 'center', padding: '0.8rem',
                                background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.3)',
                                borderRadius: '8px', color: '#86efac', fontSize: '0.85rem'
                            }}>
                                ✓ LECTURA COMPLETADA HOY
                            </div>
                        ) : (
                            <button onClick={handleStartReading} style={{
                                width: '100%', padding: '0.85rem',
                                background: 'linear-gradient(90deg, #1d4ed8, #2563eb)',
                                border: 'none', borderRadius: '8px', color: '#fff',
                                fontFamily: '"Orbitron", sans-serif', fontSize: '0.85rem',
                                letterSpacing: '2px', cursor: 'pointer',
                                boxShadow: '0 0 15px rgba(59,130,246,0.4)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                            }}>
                                <Play size={16} /> COMENZAR LECTURA
                            </button>
                        )}
                    </>
                )}

                {/* --- PHASE: READING --- */}
                {phase === 'reading' && (
                    <>
                        <AudioVisualizer isActive={true} />
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                fontSize: '2.5rem', fontWeight: 'bold', color: '#93c5fd',
                                fontFamily: 'monospace',
                                textShadow: '0 0 20px rgba(147,197,253,0.7)',
                                animation: timer <= 10 ? 'pulse-text 1s infinite' : 'none'
                            }}>
                                {String(timer).padStart(2, '0')}s
                            </div>
                            <div style={{ color: '#475569', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                                LEE Y CONCÉNTRATE...
                            </div>
                        </div>
                        <button onClick={handleStop} style={{
                            width: '100%', padding: '0.75rem',
                            background: 'rgba(239,68,68,0.1)', border: '1px solid #ef4444',
                            borderRadius: '8px', color: '#fca5a5',
                            fontFamily: '"Orbitron", sans-serif', fontSize: '0.8rem',
                            cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                        }}>
                            <Square size={14} /> TERMINAR ANTES
                        </button>
                    </>
                )}

                {/* --- PHASE: SUMMARY INPUT --- */}
                {phase === 'summary' && (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        <div style={{ color: '#93c5fd', fontSize: '0.8rem', textAlign: 'center', letterSpacing: '1px' }}>
                            ✦ ¿QUÉ LEÍSTE HOY? ✦
                        </div>
                        <textarea
                            value={summary}
                            onChange={e => setSummary(e.target.value)}
                            placeholder="Escribe aquí un resumen de lo que leíste hoy... (Puedes ser breve)"
                            style={{
                                width: '100%', minHeight: '90px',
                                background: 'rgba(30,58,138,0.2)',
                                border: '1px solid #1d4ed8',
                                borderRadius: '8px',
                                color: '#e2e8f0',
                                padding: '0.75rem',
                                fontFamily: 'inherit',
                                fontSize: '0.85rem',
                                resize: 'vertical',
                                outline: 'none',
                                boxSizing: 'border-box'
                            }}
                        />
                        <button onClick={handleSubmitSummary} disabled={!summary.trim()} style={{
                            width: '100%', padding: '0.85rem',
                            background: summary.trim() ? 'linear-gradient(90deg, #1d4ed8, #3b82f6)' : 'rgba(59,130,246,0.1)',
                            border: '1px solid #3b82f6',
                            borderRadius: '8px', color: summary.trim() ? '#fff' : '#1d4ed8',
                            fontFamily: '"Orbitron", sans-serif', fontSize: '0.8rem',
                            cursor: summary.trim() ? 'pointer' : 'default',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                            letterSpacing: '1px'
                        }}>
                            <Send size={15} /> ENVIAR AL SABIO
                        </button>
                    </div>
                )}

                {/* --- PHASE: AI FEEDBACK --- */}
                {phase === 'feedback' && (
                    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {loadingFeedback ? (
                            <div style={{ textAlign: 'center', color: '#60a5fa', padding: '1rem' }}>
                                <div style={{ animation: 'spin 1.5s linear infinite', display: 'inline-block', fontSize: '1.5rem' }}>✦</div>
                                <div style={{ marginTop: '0.5rem', fontSize: '0.8rem', letterSpacing: '1px' }}>
                                    EL SABIO RESPONDE...
                                </div>
                            </div>
                        ) : (
                            <>
                                <div style={{
                                    background: 'rgba(30,58,138,0.2)',
                                    border: '1px solid #1d4ed8',
                                    borderLeft: '3px solid #3b82f6',
                                    borderRadius: '8px',
                                    padding: '1rem',
                                    color: '#bfdbfe',
                                    fontSize: '0.9rem',
                                    lineHeight: '1.6',
                                    fontStyle: 'italic',
                                    fontFamily: 'var(--font-sans, sans-serif)'
                                }}>
                                    <Sparkles size={14} color="#93c5fd" style={{ display: 'inline', marginRight: '0.5rem' }} />
                                    {aiFeedback}
                                </div>
                                <div style={{
                                    background: 'rgba(34,197,94,0.1)',
                                    border: '1px solid rgba(34,197,94,0.3)',
                                    borderRadius: '8px', padding: '0.65rem',
                                    color: '#86efac', fontSize: '0.8rem', textAlign: 'center'
                                }}>
                                    ✓ +20 XP DE SABIDURÍA GANADOS
                                </div>
                                <button onClick={handleFinish} style={{
                                    width: '100%', padding: '0.75rem',
                                    background: 'rgba(59,130,246,0.1)',
                                    border: '1px solid #3b82f6', borderRadius: '8px',
                                    color: '#93c5fd',
                                    fontFamily: '"Orbitron", sans-serif', fontSize: '0.8rem',
                                    cursor: 'pointer', letterSpacing: '1px'
                                }}>
                                    CERRAR RITUAL
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* Progress Bar */}
                <div style={{ width: '100%', padding: '0 0.5rem' }}>
                    <div style={{ height: '35px', position: 'relative', width: '100%' }}>
                        {/* Milestones Labels removed for design cleanliness */}
                        <div style={{ height: '14px' }} />

                        {/* Bar Container */}
                        <div style={{
                            height: '14px', background: '#0c1a3a', borderRadius: '7px',
                            position: 'absolute', bottom: 4, width: '100%', border: '1px solid #3b82f6',
                            boxShadow: 'inset 0 0 10px rgba(0,0,0,0.8)'
                        }}>
                            <div style={{
                                width: `${progressPercent}%`, height: '100%',
                                background: 'linear-gradient(90deg, #1d4ed8, #60a5fa)',
                                borderRadius: '7px', boxShadow: '0 0 10px #60a5fa',
                                transition: 'width 0.5s ease'
                            }} />

                            {/* Ticks */}
                            {[16.6, 50, 83.3].map((pos, i) => (
                                <div key={i} style={{
                                    position: 'absolute', bottom: 0, left: `${pos}%`,
                                    width: '1px', height: '100%',
                                    background: 'rgba(255,255,255,0.3)', zIndex: 2
                                }} />
                            ))}
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#60a5fa', marginTop: '4px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                            <Clock size={11} /> Racha: {currentStreak} días
                        </span>
                        <span>{Math.round(progressPercent)}%</span>
                    </div>
                </div>

                {/* Stats */}
                <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.82rem', color: '#e5e7eb' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e3a5f', paddingBottom: '4px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <BookOpen size={13} color="#60a5fa" /> DÍAS DE LECTURA:
                        </span>
                        <span style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{totalDaysRead}/30</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #1e3a5f', paddingBottom: '4px' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Trophy size={13} color="#fbbf24" /> RACHA ACTUAL:
                        </span>
                        <span style={{ fontWeight: 'bold', fontFamily: 'monospace' }}>{currentStreak} DÍAS</span>
                    </div>
                </div>

                {/* Story */}
                <div style={{
                    width: '100%', background: 'rgba(0,0,0,0.3)',
                    padding: '0.8rem', borderRadius: '8px',
                    borderLeft: '3px solid #3b82f6',
                    fontSize: '0.82rem', fontStyle: 'italic',
                    color: '#93c5fd', lineHeight: '1.4',
                    fontFamily: 'var(--font-sans, sans-serif)'
                }}>
                    "{bookStory}"
                </div>
            </div>

            <style>{`
                @keyframes spin { 100% { transform: rotate(360deg); } }
                @keyframes pulse-text { 0%,100% { opacity:1 } 50% { opacity:0.4 } }
            `}</style>
        </div>
    );
};

export default LecturaEncantada;
