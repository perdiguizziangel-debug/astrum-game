import React, { useState, useEffect } from 'react';
import { FlaskConical, Play, CheckCircle, RotateCcw } from 'lucide-react';
import { useGame } from '../../context/GameContext';

const PotionMaster = ({ onComplete, onClose }) => {
    const { completeActivity, gameState } = useGame();
    const [sequence, setSequence] = useState([]);
    const [userSequence, setUserSequence] = useState([]);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isShowingSequence, setIsShowingSequence] = useState(false);
    const [round, setRound] = useState(1);
    const [result, setResult] = useState(null); // 'win', 'lose', null
    const [activeColor, setActiveColor] = useState(null);

    const colors = [
        { id: 'red', color: '#e74c3c', name: 'Sangre de Dragón' },
        { id: 'blue', color: '#3498db', name: 'Lágrimas de Sirena' },
        { id: 'green', color: '#2ecc71', name: 'Veneno de Basilisco' },
        { id: 'yellow', color: '#f1c40f', name: 'Polvo de Hada' }
    ];

    const startGame = () => {
        setSequence([]);
        setUserSequence([]);
        setRound(1);
        setResult(null);
        setIsPlaying(true);
        addToSequence([]);
    };

    const addToSequence = (currentSeq) => {
        const nextColor = colors[Math.floor(Math.random() * colors.length)];
        const newSeq = [...currentSeq, nextColor];
        setSequence(newSeq);
        setUserSequence([]);
        showSequence(newSeq);
    };

    const showSequence = async (seq) => {
        setIsShowingSequence(true);
        for (let i = 0; i < seq.length; i++) {
            await new Promise(resolve => setTimeout(resolve, 800));
            setActiveColor(seq[i].id);
            await new Promise(resolve => setTimeout(resolve, 500));
            setActiveColor(null);
        }
        setIsShowingSequence(false);
    };

    const handleColorClick = (color) => {
        if (!isPlaying || isShowingSequence) return;

        // Flash visual feedback
        setActiveColor(color.id);
        setTimeout(() => setActiveColor(null), 200);

        const newUserSeq = [...userSequence, color];
        setUserSequence(newUserSeq);

        // Check correct check logic
        const currentIndex = newUserSeq.length - 1;
        if (color.id !== sequence[currentIndex].id) {
            // Wrong move
            setIsPlaying(false);
            setResult('lose');
            return;
        }

        // If completed sequence
        if (newUserSeq.length === sequence.length) {
            if (round === 3) { // Win condition: 3 successful rounds
                setIsPlaying(false);
                setResult('win');
                completeActivity(gameState.currentUser.id, 'potionMaster', 30);
            } else {
                setRound(prev => prev + 1);
                setTimeout(() => addToSequence(sequence), 1000);
            }
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '1rem' }}>
            <h2 style={{ color: 'var(--color-gold)', marginBottom: '0.5rem' }}>Maestro de Pociones</h2>
            <p style={{ marginBottom: '1rem', color: '#aaa' }}>Repite la secuencia de ingredientes. Ronda {round}/3.</p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
                maxWidth: '400px',
                margin: '0 auto 2rem'
            }}>
                {colors.map(color => (
                    <button
                        key={color.id}
                        onClick={() => handleColorClick(color)}
                        disabled={!isPlaying || isShowingSequence}
                        style={{
                            height: '100px',
                            background: activeColor === color.id ? color.color : `${color.color}80`, // Dim if not active
                            border: 'none',
                            borderRadius: '12px',
                            cursor: (!isPlaying || isShowingSequence) ? 'default' : 'pointer',
                            color: 'white',
                            fontWeight: 'bold',
                            textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                            transform: activeColor === color.id ? 'scale(0.95)' : 'scale(1)',
                            transition: 'all 0.1s',
                            boxShadow: activeColor === color.id ? `0 0 20px ${color.color}` : 'none'
                        }}
                    >
                        {color.name}
                    </button>
                ))}
            </div>

            {!isPlaying && !result && (
                <button
                    onClick={startGame}
                    className="button-primary"
                    style={{ fontSize: '1.2rem', padding: '1rem 3rem', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '0 auto' }}
                >
                    <Play size={24} /> COMENZAR
                </button>
            )}

            {result === 'win' && (
                <div style={{ animation: 'fadeIn 0.5s' }}>
                    <CheckCircle size={48} color="#2ecc71" style={{ margin: '0 auto 1rem' }} />
                    <h3 style={{ color: '#2ecc71' }}>¡Poción Perfecta!</h3>
                    <p>Has ganado 30 puntos.</p>
                    <button className="button-primary" onClick={onClose} style={{ marginTop: '1rem' }}>Volver al Aula</button>
                </div>
            )}

            {result === 'lose' && (
                <div style={{ animation: 'fadeIn 0.5s' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💥</div>
                    <h3 style={{ color: '#e74c3c' }}>¡El caldero ha explotado!</h3>
                    <p>Secuencia incorrecta.</p>
                    <button className="button-primary" onClick={startGame} style={{ marginTop: '1rem', background: '#333', display: 'flex', alignItems: 'center', gap: '0.5rem', margin: '1rem auto' }}>
                        <RotateCcw size={18} /> Intentar de nuevo
                    </button>
                </div>
            )}
        </div>
    );
};

export default PotionMaster;
