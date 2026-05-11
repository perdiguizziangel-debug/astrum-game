import React, { useState } from 'react';
import { Eye, CheckCircle, XCircle } from 'lucide-react';
import { useGame } from '../../context/GameContext';

const VisionTest = ({ onComplete, onClose }) => {
    const { completeActivity, gameState } = useGame();
    const [selectedOption, setSelectedOption] = useState(null);
    const [result, setResult] = useState(null);

    // Mock content - In a real app, this could come from an API or a larger database
    const story = "La visión muestra un vasto lago oscuro bajo la luz de la luna llena. En el centro, una pequeña barca avanza silenciosamente hacia una cueva iluminada por un resplandor verde fantasmal.";

    // Using placeholder colored blocks or generic tech imagery if actual assets aren't available
    // Ideally we would generate assets, but for code speed I'll use colored divs with text or emojis.
    const options = [
        { id: 1, content: '🌋', label: 'Volcán en erupción', isCorrect: false },
        { id: 2, content: '🚣‍♂️💚', label: 'Barca y luz verde', isCorrect: true },
        { id: 3, content: '🏰☀️', label: 'Castillo soleado', isCorrect: false },
        { id: 4, content: '🌲🦄', label: 'Bosque y unicornio', isCorrect: false }
    ];

    const handleSubmit = () => {
        if (!selectedOption) return;

        const isCorrect = options.find(o => o.id === selectedOption).isCorrect;

        if (isCorrect) {
            setResult('success');
            completeActivity(gameState.currentUser.id, 'visionTest', 15);
        } else {
            setResult('fail');
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '1rem' }}>
            <h2 style={{ color: 'var(--color-gold)', marginBottom: '0.5rem' }}>Visiones del Oráculo</h2>
            <p style={{ fontStyle: 'italic', color: '#ccc', marginBottom: '1.5rem', background: '#222', padding: '1rem', borderRadius: '8px' }}>
                "{story}"
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                {options.map(opt => (
                    <div
                        key={opt.id}
                        onClick={() => !result && setSelectedOption(opt.id)}
                        style={{
                            border: selectedOption === opt.id ? '2px solid var(--color-gold)' : '2px solid #444',
                            background: selectedOption === opt.id ? 'rgba(255, 215, 0, 0.1)' : 'rgba(0,0,0,0.3)',
                            borderRadius: '8px',
                            padding: '1.5rem',
                            cursor: result ? 'default' : 'pointer',
                            fontSize: '2rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        {opt.content}
                        <div style={{ fontSize: '0.9rem', color: '#888', marginTop: '0.5rem' }}>{opt.label}</div>
                    </div>
                ))}
            </div>

            {!result && (
                <button
                    className="button-primary"
                    disabled={!selectedOption}
                    onClick={handleSubmit}
                    style={{ opacity: selectedOption ? 1 : 0.5 }}
                >
                    Interpretar Visión
                </button>
            )}

            {result === 'success' && (
                <div style={{ animation: 'fadeIn 0.5s' }}>
                    <CheckCircle size={48} color="#2ecc71" style={{ margin: '0 auto 1rem' }} />
                    <h3 style={{ color: '#2ecc71' }}>¡Interpretación Correcta!</h3>
                    <p>Has ganado 15 puntos.</p>
                    <button className="button-primary" onClick={onClose} style={{ marginTop: '1rem' }}>Concluir</button>
                </div>
            )}

            {result === 'fail' && (
                <div style={{ animation: 'fadeIn 0.5s' }}>
                    <XCircle size={48} color="#e74c3c" style={{ margin: '0 auto 1rem' }} />
                    <h3 style={{ color: '#e74c3c' }}>La visión se nubla...</h3>
                    <p>Esa no era la interpretación correcta.</p>
                    <button className="button-primary" onClick={() => { setResult(null); setSelectedOption(null); }} style={{ marginTop: '1rem', background: '#333' }}>Intentar de nuevo</button>
                    <button className="button-primary" onClick={onClose} style={{ marginTop: '1rem', marginLeft: '1rem', background: 'none', border: '1px solid #555' }}>Salir</button>
                </div>
            )}
        </div>
    );
};

export default VisionTest;
