import React, { useState, useEffect, useRef } from 'react';
import { Keyboard, CheckCircle, XCircle, Timer } from 'lucide-react';
import { useGame } from '../../context/GameContext';

const SpellTyper = ({ onComplete, onClose }) => {
    const { completeActivity, gameState } = useGame();
    const [targetSpell, setTargetSpell] = useState('');
    const [input, setInput] = useState('');
    const [timeLeft, setTimeLeft] = useState(5);
    const [isPlaying, setIsPlaying] = useState(false);
    const [result, setResult] = useState(null); // 'win', 'lose'
    const inputRef = useRef(null);

    const spells = [
        "Expecto Patronum",
        "Wingardium Leviosa",
        "Expelliarmus",
        "Lumos Maxima",
        "Riddikulus",
        "Alohomora",
        "Petrificus Totalus"
    ];

    const startGame = () => {
        const randomSpell = spells[Math.floor(Math.random() * spells.length)];
        setTargetSpell(randomSpell);
        setInput('');
        setTimeLeft(8); // 8 seconds for typing
        setResult(null);
        setIsPlaying(true);
        setTimeout(() => {
            if (inputRef.current) inputRef.current.focus();
        }, 100);
    };

    useEffect(() => {
        let timer;
        if (isPlaying && timeLeft > 0) {
            timer = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (isPlaying && timeLeft === 0) {
            // Time ran out
            endGame(false);
        }
        return () => clearInterval(timer);
    }, [isPlaying, timeLeft]);

    const handleInput = (e) => {
        if (!isPlaying) return;

        const value = e.target.value;
        setInput(value);

        if (value === targetSpell) {
            endGame(true);
        }
    };

    const endGame = (success) => {
        setIsPlaying(false);
        if (success) {
            setResult('win');
            completeActivity(gameState.currentUser.id, 'spellTyper', 20);
        } else {
            setResult('lose');
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '1rem' }}>
            <h2 style={{ color: 'var(--color-gold)', marginBottom: '0.5rem' }}>Duelo de Hechizos</h2>

            {!isPlaying && !result && (
                <>
                    <p style={{ marginBottom: '2rem', color: '#ccc' }}>Debes escribir el hechizo EXACTO antes de que se agote el tiempo.</p>
                    <button
                        onClick={startGame}
                        className="button-primary"
                        style={{ fontSize: '1.2rem', padding: '1rem 3rem' }}
                    >
                        PREPARAR VARITA
                    </button>
                </>
            )}

            {isPlaying && (
                <div style={{ animation: 'fadeIn 0.3s' }}>
                    <div style={{
                        fontSize: '2rem',
                        fontWeight: 'bold',
                        color: '#e0b0ff',
                        marginBottom: '1rem',
                        textShadow: '0 0 10px rgba(224, 176, 255, 0.5)',
                        letterSpacing: '1px'
                    }}>
                        {targetSpell}
                    </div>

                    <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: timeLeft <= 3 ? '#e74c3c' : 'white' }}>
                        <Timer size={20} />
                        <span style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{timeLeft}s</span>
                    </div>

                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={handleInput}
                        placeholder="Escribe el hechizo..."
                        autoComplete="off"
                        style={{
                            width: '100%',
                            maxWidth: '400px',
                            padding: '1rem',
                            fontSize: '1.5rem',
                            textAlign: 'center',
                            background: 'rgba(0,0,0,0.5)',
                            border: '2px solid var(--color-gold)',
                            color: 'white',
                            borderRadius: '8px',
                            outline: 'none'
                        }}
                    />
                </div>
            )}

            {result === 'win' && (
                <div style={{ animation: 'fadeIn 0.5s' }}>
                    <CheckCircle size={48} color="#2ecc71" style={{ margin: '0 auto 1rem' }} />
                    <h3 style={{ color: '#2ecc71' }}>¡Hechizo Lanzado!</h3>
                    <p>Has ganado 20 puntos por tu rapidez.</p>
                    <button className="button-primary" onClick={onClose} style={{ marginTop: '1rem' }}>Volver al Aula</button>
                </div>
            )}

            {result === 'lose' && (
                <div style={{ animation: 'fadeIn 0.5s' }}>
                    <h3 style={{ color: '#e74c3c', fontSize: '2rem' }}>💨 Fizz...</h3>
                    <p>El hechizo falló o se acabó el tiempo.</p>
                    <button className="button-primary" onClick={startGame} style={{ marginTop: '1rem', background: '#333' }}>Jugar de nuevo</button>
                    <button className="button-primary" onClick={onClose} style={{ marginTop: '1rem', marginLeft: '1rem', background: 'none', border: '1px solid #555' }}>Salir</button>
                </div>
            )}
        </div>
    );
};

export default SpellTyper;
