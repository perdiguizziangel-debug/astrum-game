import React, { useState } from 'react';
import { Search, CheckCircle, XCircle } from 'lucide-react';
import { useGame } from '../../context/GameContext';

const TextDetective = ({ onComplete, onClose }) => {
    const { completeActivity, gameState } = useGame();
    const [result, setResult] = useState(null);

    const text = "En las profundidades del Bosque Prohibido, donde los centauros observan las estrellas y los unicornios pastan bajo la luz plateada, se dice que un antiguo cisne de cristal guarda el secreto del lago.";
    const targetWord = "cisne";

    const handleAnswer = (exists) => {
        const actuallyExists = text.toLowerCase().includes(targetWord.toLowerCase());

        if (exists === actuallyExists) {
            setResult('success');
            completeActivity(gameState.currentUser.id, 'textDetective', 10);
        } else {
            setResult('fail');
        }
    };

    return (
        <div style={{ textAlign: 'center', padding: '1rem' }}>
            <h2 style={{ color: 'var(--color-gold)', marginBottom: '0.5rem' }}>Detector de Encantamientos</h2>
            <p style={{ marginBottom: '1.5rem' }}>Lee atentamente el siguiente texto antiguo:</p>

            <div style={{
                background: '#2a1b1b',
                padding: '1.5rem',
                borderRadius: '4px',
                border: '1px solid #555',
                marginBottom: '2rem',
                fontFamily: 'var(--font-serif)',
                lineHeight: '1.6',
                color: '#ddd'
            }}>
                "{text}"
            </div>

            <p style={{ marginBottom: '1rem' }}>
                ¿Aparece la palabra mágica <strong style={{ color: '#e0b0ff', fontSize: '1.2rem' }}>"{targetWord}"</strong> en el texto?
            </p>

            {!result && (
                <div style={{ display: 'flex', gap: '2rem', justifyContent: 'center' }}>
                    <button
                        onClick={() => handleAnswer(true)}
                        style={{
                            padding: '1rem 3rem',
                            background: '#27ae60',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        SÍ
                    </button>
                    <button
                        onClick={() => handleAnswer(false)}
                        style={{
                            padding: '1rem 3rem',
                            background: '#c0392b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1.2rem',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        NO
                    </button>
                </div>
            )}

            {result === 'success' && (
                <div style={{ marginTop: '2rem', animation: 'fadeIn 0.5s' }}>
                    <CheckCircle size={48} color="#2ecc71" style={{ margin: '0 auto 1rem' }} />
                    <h3 style={{ color: '#2ecc71' }}>¡Análisis Correcto!</h3>
                    <p>Has ganado 10 puntos.</p>
                    <button className="button-primary" onClick={onClose} style={{ marginTop: '1rem' }}>Volver al Aula</button>
                </div>
            )}

            {result === 'fail' && (
                <div style={{ marginTop: '2rem', animation: 'fadeIn 0.5s' }}>
                    <XCircle size={48} color="#e74c3c" style={{ margin: '0 auto 1rem' }} />
                    <h3 style={{ color: '#e74c3c' }}>Análisis Incorrecto</h3>
                    <p>Debes prestar más atención a los detalles.</p>
                    <button className="button-primary" onClick={() => setResult(null)} style={{ marginTop: '1rem', background: '#333' }}>Intentar de nuevo</button>
                    <button className="button-primary" onClick={onClose} style={{ marginTop: '1rem', marginLeft: '1rem', background: 'none', border: '1px solid #555' }}>Salir</button>
                </div>
            )}
        </div>
    );
};

export default TextDetective;
